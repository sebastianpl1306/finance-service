import { Router } from 'express';
import { validateJWT } from '../../middlewares';
import { StatsController } from './stats.controller';

export const StatsRouter = Router();

const statsController = new StatsController();

//Consular las estadísticas del home
StatsRouter.get('/getStats', validateJWT, statsController.generalStats.bind(statsController))