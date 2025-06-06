import { NextFunction, Request, Response, Router } from 'express';
import { AuthRouter, CategoriesRouter, TransactionRouter, StatsRouter, MembershipRouter } from './modules';

export const router = Router();

router.use((request: Request, response: Response, next: NextFunction) => {
  console.log(`[INFO][EXECUTE] ${request.method} ${request.url}`);
  next();
});

//Autenticación
router.use('/api/auth', AuthRouter);

//Ingresos
router.use('/api/transaction', TransactionRouter);

//Categorías
router.use('/api/category', CategoriesRouter);

//Stats
router.use('/api/stats', StatsRouter);

//Memberships
router.use('/api/membership', MembershipRouter);