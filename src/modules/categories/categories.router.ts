import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { validateJWT } from '../../middlewares';

export const CategoriesRouter = Router();

const categoriesController = new CategoriesController();

//Consular las categorías del usuario
CategoriesRouter.get('/getAll', validateJWT, categoriesController.findCategoriesByUser.bind(categoriesController))

//Crear categorías
CategoriesRouter.post('/create', validateJWT, categoriesController.createCategory.bind(categoriesController));

//Actualizar categorías
CategoriesRouter.put('/update', validateJWT, categoriesController.updateCategory.bind(categoriesController));