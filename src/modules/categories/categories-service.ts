import { CategoryModel } from "../../database";

interface CreateCategoryParams {
    name: string;
    description?: string;
    color?: string;
    userId: string;
}

interface UpdateCategoryParams {
    idCategory: string;
    name: string;
    description?: string;
    color?: string;
    userId: string;
}

export class CategoriesService {
    constructor() {}

    /**
     * Permite actualizar una categoría
     */
    async updateCategory({ idCategory, userId, name, description, color }: UpdateCategoryParams){
        try {
            const updateCategory = await CategoryModel.findOneAndUpdate({ _id: idCategory, user: userId }, {
                name,
                description,
                color
            }, { new: true });

            return updateCategory;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    /**
     * Permite crear una categoría
     */
    async createCategory({ name, description, userId, color }: CreateCategoryParams) {
        try {
            if (!name) {
                throw new Error('Missing Info');
            }

            const newCategory = new CategoryModel({
                user: userId,
                name,
                color,
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