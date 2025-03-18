import { TransactionModel } from "../../database";
import { setFiltersTransactions } from "../../helpers";
import { QueryFiltersTransaction, TransactionFilters, TypesTransaction } from "../../interfaces";

interface CreateTransactionParams {
    name: string;
    description?: string;
    categoryId: string;
    userId: string;
    date: Date;
    type: TypesTransaction;
    value: number;
}

export class TransactionService {
    constructor() {}

    /**
     * Permite crear un movimiento en la base de datos
     */
    async createTransaction({ name, description, categoryId, userId, type, date, value}: CreateTransactionParams) {
        try {
            if (!name || !value || !userId || !categoryId || !type || !date ) {
              throw new Error('Missing Info');
            }

            const newTransaction = new TransactionModel({
              name,
              description,
              category: categoryId,
              user: userId,
              type,
              date,
              value
            });

            await newTransaction.save();

            return newTransaction;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    /**
   * getTransactions: Permite obtener las transacciones y generar filtros
   * @returns Transacciones o arreglo vació
   */
    async getTransactions (filters?: TransactionFilters, page: number = 1, limit: number = 10 ) {
        try {
            const query: QueryFiltersTransaction = setFiltersTransactions(filters);

            // Calcular el número de documentos a omitir
            const skip = (page - 1) * limit;

            const transactions = await TransactionModel.find(query)
            .populate('category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            const totalPages = await TransactionModel.countDocuments(query);

            if (transactions) {
                return {
                    transactions,
                    totalPages,
                    page
                }
            }

            return {
                transactions: [],
                totalPages: 0,
                page: 0
            };
        } catch (error) {
            throw new Error(`[ERROR][getTransactions] ${error}`);
        }
    }
}