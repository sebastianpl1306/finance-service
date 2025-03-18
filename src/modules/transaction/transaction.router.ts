import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { validateJWT } from '../../middlewares';

export const TransactionRouter = Router();

const transactionController = new TransactionController();

//Permite buscar las transacciones
TransactionRouter.get('/', validateJWT, transactionController.findTransactions.bind(transactionController));

//Crear un ingreso
TransactionRouter.post('/create', validateJWT, transactionController.addTransaction.bind(transactionController));