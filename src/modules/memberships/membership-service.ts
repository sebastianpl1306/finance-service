import { MercadoPagoConfig, PreApproval } from 'mercadopago';
import { MembershipPlanModel } from "../../database";
import { CreateSubscriptionRequest } from '../../interfaces';

export class MembershipService {
    private client: MercadoPagoConfig;
    private preApproval: PreApproval;

    constructor() {
        this.client = new MercadoPagoConfig({
        accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
        options: {
            timeout: 5000
        }
        });
        this.preApproval = new PreApproval(this.client);
    }

    async createSubscription(subscriptionData: CreateSubscriptionRequest) {
        try {
            const frequencyMap = {
                monthly: 1,
                yearly: 12
            };
            
            const body = {
                reason: `Suscripción ${subscriptionData.planId}`,
                auto_recurring: {
                frequency: frequencyMap[subscriptionData.frequency],
                frequency_type: 'months',
                transaction_amount: subscriptionData.amount,
                currency_id: 'COP' // Cambia según tu país
                },
                payer_email: subscriptionData.email,
                card_token_id: subscriptionData.cardToken,
                status: 'pending',
                external_reference: subscriptionData.userId,
                back_url: `https://www.buhoon.com/success`,
                notification_url: `${process.env.BACKEND_URL}/api/membership/webhook`
            };

            const response = await this.preApproval.create({ body });
            return response;
        } catch (error) {
            console.error('Error creating MercadoPago subscription:', error);
            throw error;
        }
    }

    /**
     * Permite obtener los planes de membresía
     * @description Este método permite obtener los planes de membresía
     * @returns 
     */
    async getSubscription(subscriptionId: string) {
        try {
            const response = await this.preApproval.get({ id: subscriptionId });
            return response;
        } catch (error) {
            console.error('Error getting MercadoPago subscription:', error);
            throw error;
        }
    }

    async cancelSubscription(subscriptionId: string) {
        try {
            const response = await this.preApproval.update({
                id: subscriptionId,
                body: { status: 'cancelled' }
            });
            return response;
        } catch (error) {
            console.error('Error cancelling MercadoPago subscription:', error);
            throw error;
        }
    }
}