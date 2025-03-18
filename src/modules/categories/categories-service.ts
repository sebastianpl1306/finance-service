import { CategoryModel } from "../../database";

interface CreateCategoryParams {
    name: string;
    description?: string;
    userId: string;
}

export class CategoriesService {
    constructor() {}

    /**
     * Permite crear una categoría
     */
    async createCategory({ name, description, userId }: CreateCategoryParams) {
        try {
            if (!name) {
                throw new Error('Missing Info');
            }

            const newCategory = new CategoryModel({
                user: userId,
                name,
                description
            });

            await newCategory.save();

            return newCategory;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    /**
     * Permite buscar todas las categorías de un usuario
     */
    async findAllCategoriesByUser(userId: string) {
        try {
            if (!userId) {
                throw new Error('[findAllCategoriesByUser] userId is required');
            }

            const categories = await CategoryModel.find({ user: userId })

            return categories;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}