import { raw, Router } from 'express';
import { validateJWT, validateSubscription } from '../../middlewares';
import { MembershipController } from './membership.controller';

export const MembershipRouter = Router();

const membershipController = new MembershipController();

// Crear suscripción
MembershipRouter.post('/', validateJWT, [validateJWT, ...validateSubscription], membershipController.createSubscription.bind(membershipController));

// Obtener suscripciones del usuario
MembershipRouter.get('/user/:userId', validateJWT, membershipController.getUserSubscriptions.bind(membershipController));

// Cancelar suscripción
MembershipRouter.put('/:subscriptionId/cancel', validateJWT, membershipController.cancelSubscription.bind(membershipController));

// Webhook de Mercado Pago
MembershipRouter.post('/webhook', membershipController.handleWebhook.bind(membershipController));