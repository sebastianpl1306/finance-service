import { Request, Response } from 'express';
import { CategoriesService } from './categories-service';

export class CategoriesController {
    private categoriesService;

    constructor() {
        this.categoriesService = new CategoriesService();
    }

    /**
     * Permite crear una categoría
     * @returns Categoría creada
     */
    async createCategory(request: Request, response: Response){
        const { name, description, tokenInfo } = request.body;

        try {
            if(!name){
                return response.status(400).json({
                    ok: false,
                    msg: "name is missing"
                })
            }

            const newCategory = await this.categoriesService.createCategory({ name, description, userId: tokenInfo.uid });

            return response.status(200).json({
                ok: true,
                newCategory
            })
        } catch (error) {
            console.error(`[ERROR][categoriesController]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }

    /**
     * Permite buscar las categorías por usuario
     * @returns Categoría creada
     */
    async findCategoriesByUser(request: Request, response: Response){
        const { tokenInfo } = request.body;

        try {
            const categories = await this.categoriesService.findAllCategoriesByUser(tokenInfo.uid);

            return response.status(200).json({
                ok: true,
                categories
            })
        } catch (error) {
            console.error(`[ERROR][findCategoriesByUser]`, error);
            return response.status(500).json({
                ok: false,
                msg: 'Ups! something unexpected happened'
            });
        }
    }
}