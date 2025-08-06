import { Request, Response } from 'express';
import { MembershipService } from './membership-service';
import { UserMembershipModel } from '../../database';
import { CreateSubscriptionRequest, MembershipStatus } from '../../interfaces';

export class MembershipController {
    private membershipService: MembershipService;

    constructor() {
        this.membershipService = new MembershipService();
    }

    async createSubscription(req: Request, res: Response) {
        try {
            const subscriptionData: CreateSubscriptionRequest = req.body;

            // Validar datos requeridos
            if (!subscriptionData.userId || !subscriptionData.email || !subscriptionData.planId) {
                return res.status(400).json({
                error: 'userId, email y planId son requeridos'
                });
            }

            // Verificar si ya existe una suscripción activa para este usuario
            const existingSubscription = await UserMembershipModel.findOne({
                user: subscriptionData.userId,
                status: { $in: ['active', 'pending'] }
            });

            if (existingSubscription) {
                return res.status(400).json({
                error: 'El usuario ya tiene una suscripción activa'
                });
            }

            // Crear suscripción en Mercado Pago
            const mpSubscription = await this.membershipService.createSubscription(subscriptionData);

            // Calcular próxima fecha de pago
            const nextPaymentDate = new Date();
            if (subscriptionData.frequency === 'monthly') {
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            } else {
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            }

            // Guardar suscripción en la base de datos
            const subscription = new UserMembershipModel({
                user: subscriptionData.userId,
                planId: subscriptionData.planId,
                mercadoPagoSubscriptionId: mpSubscription.id,
                amount: subscriptionData.amount,
                frequency: subscriptionData.frequency,
                status: 'pending',
                startDate: new Date(),
                isActive: true,
                nextPaymentDate
            });

            await subscription.save();

            res.status(201).json({
                ok: true,
                msg: 'Suscripción creada exitosamente',
                subscription: {
                    id: subscription._id,
                    status: subscription.status,
                    mercadoPagoId: mpSubscription.id,
                    initPoint: mpSubscription.init_point
                }
            });

        } catch (error) {
            console.error('Error creating subscription:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Obtener suscripciones del usuario
    async getUserSubscriptions(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const subscriptions = await UserMembershipModel.find({ user: userId })
                .populate('user', 'name email')
                .sort({ createdAt: -1 });

            res.json({
                ok: true,
                msg: 'Suscripciones obtenidas exitosamente',
                subscriptions
            });

        } catch (error) {
            console.error('Error getting user subscriptions:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Cancelar suscripción
    async cancelSubscription(req: Request, res: Response) {
        try {
            const { subscriptionId } = req.params;

            const subscription = await UserMembershipModel.findById(subscriptionId);
            if (!subscription) {
                return res.status(404).json({
                error: 'Suscripción no encontrada'
                });
            }

            if (subscription.status === MembershipStatus.CANCELED) {
                return res.status(400).json({
                error: 'La suscripción ya está cancelada'
                });
            }

            // Cancelar en Mercado Pago
            if (subscription.mercadoPagoSubscriptionId) {
                await this.membershipService.cancelSubscription(subscription.mercadoPagoSubscriptionId);
            }

            // Actualizar estado en la base de datos
            subscription.status = MembershipStatus.CANCELED;
            await subscription.save();

            res.json({
                message: 'Suscripción cancelada exitosamente',
                subscription
            });

        } catch (error) {
            console.error('Error cancelling subscription:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }

    // Webhook para notificaciones de Mercado Pago
    async handleWebhook(req: Request, res: Response) {
        try {
        const { type, data } = req.body;

        if (type === 'preapproval') {
            const subscriptionId = data.id;
            
            // Obtener información actualizada de Mercado Pago
            const mpSubscription = await this.membershipService.getSubscription(subscriptionId);
            
            // Buscar suscripción en nuestra base de datos
            const subscription = await UserMembershipModel.findOne({
            mercadoPagoSubscriptionId: subscriptionId
            });

            console.log({ subscription, mpSubscription });
            
            if (subscription) {
            // Actualizar estado según Mercado Pago
            const statusMap: { [key: string]: string } = {
                'authorized': 'active',
                'paused': 'paused',
                'cancelled': 'cancelled'
            };

            const newStatus = statusMap[mpSubscription.status!] || 'pending';
            
            if (subscription.status !== newStatus) {
                subscription.status = newStatus as any;
                await subscription.save();
                
                console.log(`Subscription ${subscription._id} status updated to ${newStatus}`);
            }
            }
        }

        res.status(200).json({ received: true });

        } catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).json({
                error: 'Error procesando webhook'
            });
        }
    }
}