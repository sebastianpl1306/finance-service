import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { validateJWT, validateMembership } from '../../middlewares';

export const TransactionRouter = Router();

const transactionController = new TransactionController();

//Permite buscar las transacciones
TransactionRouter.post('/', [validateJWT, validateMembership], transactionController.findTransactions.bind(transactionController));

//Crear un ingreso
TransactionRouter.post('/create', [validateJWT, validateMembership], transactionController.addTransaction.bind(transactionController));

//Actualizar un ingreso
TransactionRouter.put('/update', [validateJWT, validateMembership], transactionController.updateTransaction.bind(transactionController));

//Obtener los meses y años de las transacciones
TransactionRouter.get('/get-dates', [validateJWT, validateMembership], transactionController.getDatesOFTransactions.bind(transactionController));