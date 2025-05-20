import Stripe from 'stripe';
import { Request, Response } from 'express';
import { MembershipService } from './membership-service';
import { UserMembershipModel, UserModel } from '../../database';
import { stripe } from '../../helpers';
import { envs } from '../../config';
import { MembershipStatus } from '../../interfaces';

export class MembershipController {
    private membershipService: MembershipService;

    constructor() {
        this.membershipService = new MembershipService();
    }

    async getMemberShipPlans(request: Request, response: Response) {
        try {
            const membershipPlans = await this.membershipService.getMembershipPlans();
            return response.status(200).json({
                ok: true,
                membershipPlans
            })
        } catch (error) {
            console.error(`[ERROR][MembershipController][getMemberShipPlans]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    async createCheckoutSession(request: Request, response: Response) {
        try {
            const { tokenInfo } = request.body;

            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                customer_email: tokenInfo.email,
                client_reference_id: tokenInfo.uid,
                line_items: [
                    {
                        price: 'price_1RO66lB32rMZvHMX4it3BrOr',
                        quantity: 1,
                    },
                ],
                success_url: `${envs.FRONT_DOMAIN}/config/payment/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${envs.FRONT_DOMAIN}/config/payment/cancel`,
            });

            await UserMembershipModel.create({
                user: tokenInfo.uid,
                plan: '682a392d614bf182de1ea3f9',
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                isActive: false,
                status: MembershipStatus.INCOMPLETE,
            });

            return response.status(200).json({
                ok: true,
                session
            });
        } catch (error) {
            console.error(`[ERROR][MembershipController][createCheckoutSession]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    async createPortalSession(request: Request, response: Response) {
        try {
            const { tokenInfo } = request.body;

            const session = await stripe.billingPortal.sessions.create({
                customer: 'cus_SJR2McEYt7lWPy',
                return_url: `${envs.FRONT_DOMAIN}/config/account`,
            });

            return response.status(200).json({
                ok: true,
                session
            });
        } catch (error) {
            console.error(`[ERROR][MembershipController][createPortalSession]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    async webhook(request: Request, response: Response) {
        try {
            const sig = request.headers['stripe-signature'];
            const event = stripe.webhooks.constructEvent(request.body, sig as string, envs.STRIPE_WEBHOOK_SECRET);

            // Handle the event
            switch (event.type) {
                case 'checkout.session.completed':
                    try {
                        const session = event.data.object as Stripe.Checkout.Session;

                        const user = await UserModel.findById(session.client_reference_id);

                        console.log('valida la sesión completada',{ event: event.type, user });
                        
                        if(!user) {
                            console.error('No se encontró el usuario', session.client_reference_id);
                            return response.status(404).send('No se encontró el usuario');
                        }

                        const userMembership = await UserMembershipModel.findOne({ user: user._id });
                    
                        console.log('Busca el userMemberShip',{ event: event.type, userMembership, status: session.status });

                        if(!userMembership) {
                            console.error('No se encontró la membresía del usuario');
                            return response.status(404).send('No se encontró la membresía del usuario');
                        }

                        if(session.status !== 'complete') {
                            console.error('La sesión de checkout no está completa');
                            return response.status(400).send('La sesión de checkout no está completa');
                        }

                        userMembership.status = session.status as MembershipStatus;
                        userMembership.startDate = new Date(session.created * 1000);
                        userMembership.stripeCustomerId = session.customer as string;
                        userMembership.stripeSubscriptionId = session.subscription as string;
                        await userMembership.save();

                        console.log('Actualizar info',{ event: event.type });
                        break;
                    } catch (error) {
                        console.error('Error procesando evento de checkout:', error);
                        return response.status(500).send('Error interno');
                    }
                case 'customer.subscription.created':
                    try {
                        const subscription = event.data.object as Stripe.Subscription;

                        const userMembership = await UserMembershipModel.findOne({
                            stripeCustomerId: subscription.customer,
                            stripeSubscriptionId: subscription.id,
                        });

                        console.log('Subscripción creada',{ event: event.type, userMembership, stripeCustomerId: subscription.customer as string,
                            stripeSubscriptionId: subscription.id, });

                        if(!userMembership) {
                            console.error('No se encontró la membresía del usuario');
                            return response.status(404).send('No se encontró la membresía del usuario');
                        }

                        if(subscription.status == MembershipStatus.ACTIVE || subscription.status == MembershipStatus.TRIALING) {
                            userMembership.isActive = true;
                        }

                        userMembership.status = subscription.status as MembershipStatus;
                        userMembership.startDate = new Date(subscription.start_date * 1000);
                        await userMembership.save();

                        console.log('Subscripción actualizada',{ event: event.type, userMembership });
                        break;
                    } catch (error) {
                        console.error('Error procesando evento de suscripción:', error);
                        return response.status(500).send('Error interno');
                    }
                    break;
                case 'customer.subscription.updated':
                    try {
                        const subscription = event.data.object as Stripe.Subscription;

                        const userMembership = await UserMembershipModel.findOne({
                            stripeCustomerId: subscription.customer,
                            stripeSubscriptionId: subscription.id,
                        });

                        if(!userMembership) {
                            console.error('No se encontró la membresía del usuario');
                            return response.status(404).send('No se encontró la membresía del usuario');
                        }

                        if(subscription.status == MembershipStatus.ACTIVE || subscription.status == MembershipStatus.TRIALING) {
                            userMembership.isActive = true;
                        }

                        userMembership.status = subscription.status as MembershipStatus;
                        userMembership.startDate = new Date(subscription.start_date * 1000);
                        await userMembership.save();
                        break;
                    } catch (error) {
                        console.error('Error procesando evento de suscripción:', error);
                        return response.status(500).send('Error interno');
                    }
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            response.status(200).json({ received: true });
        } catch (error) {
            console.error(`[ERROR][MembershipController][webhook]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }
}