import { Product } from "@/type";

const API_URL = "https://fakestoreapi.com";

//#region All Products
// recuperation de tous les produits via l'api
const getProducts = async (): Promise<Product[]> => { 
// fonction async avec await dedans pour avoir la resolution de la promesse pour la retourner 
// la promesse va etre retourné ce sera le tableau de tous les produits a l'interieur (Promise<Product[]>)
    try {
        const response = await fetch(`${API_URL}/products`); // appel api au endpoint products
        if (!response.ok) { // gestion de l'erreur si la reponse n'est pas ok
            throw new Error('Network response was not ok');
        }
        return await response.json(); // conversion du corps de la reponse json en tableau de produit
    } catch (error) {
        console.log('Error fetching products:', error); // console log de l'erreur en console
        throw error;
    }
};
//#endregion

//#region Single Product
export const getProduct = async (id:number): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};
//#endregion

//#region All Categories
// recuperation de toutes les categories de produits disponibles via l'api
const getCategories = async (): Promise<string[]> => { 
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) { 
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.log('Error fetching products:', error); 
        throw error;
    }
};
//#endregion

//#region By Category
const getProdutsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products/category/${category}`);
        if (!response.ok) {
            throw new Error("Network reponse was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch products in category ${category}`, error);
        throw error;
    }
};
//#endregion

//#region search products
const searchProductsApi = async (query: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Network reponse was not ok");
        }

        const products = await response.json();
        const searchTerm = query.toLowerCase().trim();

        return products.filter(
            (product :Product) =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
        );
    } catch (error) {
        console.error(`Failed to fetch products:`, error);
        throw error;
    }
};
//#endregion


export { getProducts, getCategories, getProdutsByCategory, searchProductsApi };