import axios from "axios";
import { Product } from "../types/product";

const API_URL = 'https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json'

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return [];
    }
}
