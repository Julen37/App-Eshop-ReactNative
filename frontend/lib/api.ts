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
//#endregion All products

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
//#endregion All Categories

export { getProducts, getCategories };