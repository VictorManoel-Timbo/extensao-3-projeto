import api from "@/config/api";
import type { IOpenFoodProduct } from "@/models/open-food.model";

const BASE_URL = "/openfood";

export const openFoodRest = {
    /**
     * Busca um produto pelo código de barras
     * @param barcode Código de barras do produto
     * @param params Objeto contendo os fields desejados
     */
    getProduct: (barcode: string, params?: { fields: string }): Promise<IOpenFoodProduct> => {
        return api.get(`${barcode}.json`, params, BASE_URL);
    }
};