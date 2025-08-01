import { Request, Response } from 'express';
import { TransactionService } from './transaction-service';
import { TransactionFilters } from '../../interfaces';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    /**
     * findTransactions: Permite buscar las movimientos
     */
    async findTransactions (request: Request, response: Response) {
        const { finishDate, textSearch, startDate, categories, type } = request.body;
        const page = request.query.page ? Number(request.query.page) : 1;
        const limit = request.query.limit ? Number(request.query.limit) : 10;

        try {
            //Agrega los filtros para realizar la búsqueda de los movimientos
            const filters: TransactionFilters = {
                categories,
                textSearch,
                type,
                startDate,
                finishDate,
                userId: request.body.tokenInfo.uid
            };

            const transactions = await this.transactionService.getTransactions(filters, page, limit);

            return response.status(200).json({
                ok: true,
                transactions: transactions?.transactions,
                page: transactions?.page,
                totalPages: transactions?.totalPages
            });
        } catch (error) {
            console.error(`[ERROR][findTransactions] ${error}`);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    /**
     * addTransaction: Permite registrar un nuevo movimiento
     */
    async addTransaction (request: Request, response: Response) {
        try {
            const { name, description, categoryId, type, date, value, tokenInfo } = request.body;

            if (!name || !value || !categoryId || !type || !date ) {
                return response.status(400).json({
                    ok: false,
                    msg: "Info missing"
                })
            }

            const newTransaction = await this.transactionService.createTransaction({ 
                name,
                description,
                categoryId,
                userId: tokenInfo.uid,
                type,
                date: new Date(date),
                value
            });

            return response.status(200).json({
                ok: true,
                newTransaction
            })
        } catch (error) {
            console.error(`[ERROR][addTransaction] ${error}`);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    /**
     * updateTransaction: Permite actualizar un nuevo movimiento
     */
    async updateTransaction (request: Request, response: Response) {
        try {
            const { name, description, categoryId, type, date, value, idTransaction, tokenInfo } = request.body;

            if (!idTransaction) {
                return response.status(400).json({
                    ok: false,
                    msg: "Info missing"
                })
            }

            const updateTransaction = await this.transactionService.updateTransaction({ 
                idTransaction,
                name,
                description,
                categoryId,
                userId: tokenInfo.uid,
                type,
                date: new Date(date),
                value
            });

            return response.status(200).json({
                ok: true,
                updateTransaction
            })
        } catch (error) {
            console.error(`[ERROR][updateTransaction] ${error}`);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    /**
     * Permite consultar los meses y años de las transacciones de los usuarios
     * @returns meses y años de las transacciones
     */
    async getDatesOFTransactions (request: Request, response: Response) {
        try {
            const { tokenInfo } = request.body;
            const dates = await this.transactionService.getDatesOFTransactions(tokenInfo.uid);

            return response.status(200).json({
                ok: true,
                dates
            })
        } catch (error) {
            console.error(`[ERROR][getDatesOFTransactions] ${error}`);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }
}