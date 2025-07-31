import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { validateJWT, validateMembership } from '../../middlewares';

export const TransactionRouter = Router();

const transactionController = new TransactionController();

//Permite buscar las transacciones
TransactionRouter.post('/', [validateJWT], transactionController.findTransactions.bind(transactionController));

//Crear un ingreso
TransactionRouter.post('/create', [validateJWT], transactionController.addTransaction.bind(transactionController));

//Actualizar un ingreso
TransactionRouter.put('/update', [validateJWT], transactionController.updateTransaction.bind(transactionController));

//Obtener los meses y años de las transacciones
TransactionRouter.get('/get-dates', [validateJWT], transactionController.getDatesOFTransactions.bind(transactionController));