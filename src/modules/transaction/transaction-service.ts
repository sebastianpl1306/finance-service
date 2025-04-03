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

interface UpdateTransactionParams {
    idTransaction: string;
    name: string;
    description?: string;
    date?: Date;
    value?: string;
    categoryId?: string;
    type?: string;
    userId: string;
}

export class TransactionService {
    constructor() {}

    /**
     * Permite actualizar una transacción
     */
    async updateTransaction({ idTransaction, userId, name, description, date, value, categoryId, type }: UpdateTransactionParams){
        try {
            const updateTransaction = await TransactionModel.findOneAndUpdate({ _id: idTransaction, user: userId }, {
                name,
                description,
                date,
                value,
                category: categoryId,
                type
            }, { new: true });

            return updateTransaction;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

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