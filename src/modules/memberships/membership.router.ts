import { raw, Router } from 'express';
import { validateJWT } from '../../middlewares';
import { MembershipController } from './membership.controller';

export const MembershipRouter = Router();

const membershipController = new MembershipController();

// Obtener los planes de membresía
MembershipRouter.get('/plans', validateJWT, membershipController.getMemberShipPlans.bind(membershipController));

// Crear una sesión de checkout
MembershipRouter.post('/checkout', validateJWT, membershipController.createCheckoutSession.bind(membershipController));

// Crear una sesión de portal
MembershipRouter.post('/create-portal-session', validateJWT, membershipController.createPortalSession.bind(membershipController));

// Webhook de Stripe
MembershipRouter.post('/webhook', membershipController.webhook.bind(membershipController));