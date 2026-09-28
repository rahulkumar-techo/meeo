import api from "@/apis";
import { ApiRoute } from "@/routes";

export const categoryService = {
    async getAllRootCategories<T>(): Promise<T> {
        const { data } = await api.get(ApiRoute.CATEGORIES.CATEGORIES);
        return data;
    }
};