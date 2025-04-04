import { Request, Response } from 'express';
import { TransactionModel } from '../../database';
import { TypesTransaction } from '../../interfaces';
import { Types } from 'mongoose';

export class StatsController {

    constructor() {}

    async generalStats(request: Request, response: Response) {
        const { tokenInfo } = request.body;

        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);

            // Consultar el total del último mes y año, segmentado por tipo
            const transactionsLastMonth = await TransactionModel.aggregate([
                {
                $match: { user: new Types.ObjectId(String(tokenInfo.uid)), date: { $gte: firstDayOfMonth } }
                },
                {
                $group: {
                    _id: "$type",
                    total: { $sum: "$value" }
                }
                }
            ]);

            const transactionsLastYear = await TransactionModel.aggregate([
                {
                  $match: { user: new Types.ObjectId(String(tokenInfo.uid)), date: { $gte: firstDayOfYear } }
                },
                {
                  $group: {
                    _id: "$type",
                    total: { $sum: "$value" }
                  }
                }
            ]);

            const totalObtainedLastMonth = transactionsLastMonth.find(t => t._id === TypesTransaction.INCOME)?.total || 0;
            const totalSpentLastMonth = transactionsLastMonth.find(t => t._id === TypesTransaction.EXPENSE)?.total || 0;
            const totalLastMonth = totalObtainedLastMonth - totalSpentLastMonth;

            // Procesar los resultados
            const summaryLastMonth = {
                total: totalLastMonth,
                obtained: totalObtainedLastMonth,
                spent: totalSpentLastMonth,
            };

            const totalObtainedLastYear = transactionsLastYear.find(t => t._id === TypesTransaction.INCOME)?.total || 0;
            const totalSpentLastYear = transactionsLastYear.find(t => t._id === TypesTransaction.EXPENSE)?.total || 0;
            const totalLastYear = totalObtainedLastYear - totalSpentLastYear;
        
            const summaryLastYear = {
                total: totalLastYear,
                obtained: totalObtainedLastYear,
                spent: totalSpentLastYear,
            };

            return response.status(200).json({
                ok: true,
                summaryLastMonth,
                summaryLastYear
            });
        } catch (error) {
            console.error(`[ERROR][statsController][generalStats]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }
}