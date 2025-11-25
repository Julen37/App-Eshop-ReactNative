// import des fonctions d'api et des types nécessaires
import { getCategories, getProducts, getProdutsByCategory, searchProductsApi } from '@/lib/api';
// import du type product
import { Product } from '@/type';
// import des bibliotheque necessaire pour la gestion de l'etat avec persistance
import AsyncStorage from '@react-native-async-storage/async-storage';
// zustand pour la gestion de l'etat, creation du store
import { create } from 'zustand';
// middleware pour la persistance de l'etat
import { createJSONStorage, persist } from 'zustand/middleware';

// definition de l'interface pour le state du store
interface ProductsState {
    products: Product[];                        //liste complete des produits
    filteredProducts: Product[];                //liste des produits filtrés
    categories: string[];                       //liste des categories de produits dispo
    loading: boolean;                           //indicateur de chargement
    error: string | null;                       //message d'erreur, s'il y en a
    selectedCategory: string | null;
//action to fetch products
    fetchProducts: () => Promise<void>;         //methode pour recuperer les produits depuis l'api
    fetchCategories: () => Promise<void>;      //methode pour recuperer les categories depuis l'api
    setCategory: (category: string | null) =>Promise<void>;
    searchProducts: (query: string) => void;
    sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;
    searchProductsRealTime: (query: string) => Promise<void>;
};

//création du store avec Zustand et persistance avec AsyncStorage
export const useProductStore = create<ProductsState>(
        (set, get)=>({
            //initialisation des valeurs du state
            products: [],
            filteredProducts: [],
            categories: [],
            loading: false,
            error: null,
            selectedCategory: null,

            fetchProducts: async () => {
                try {
                    set({ loading: true, error: null});             // active le mode de chargement et reinitialise les erreurs
                    const products = await getProducts();           // appel de l'api pour recuperer les produits
                    set({                                           // maj du state (donc le store) avec les produits recuperes
                        products,                                   // liste des produits
                        filteredProducts: products,                 // initialement, les produits filtrés sont la liste complete
                        loading: false                              // desactive le mode de chargement
                    });
                } catch (error: any) {
                    set({ error: error.message, loading: false}); // enregistre l'erreur et stop le chargement
                }
            },
            fetchCategories: async () => {
                try {
                    set({ loading: true, error: null});
                    const categories = await getCategories();
                    set({ 
                        categories,
                        loading: false,
                    });
                } catch (error: any) {
                    set({ error: error.message, loading: false});
                }
            },
            setCategory: async (category: string | null) => {
                try {
                    set({ selectedCategory: category, loading: true, error: null});

                    if (category) {
                        set ({ loading: true, error: null});
                        const products = await getProdutsByCategory(category);
                        set ({ filteredProducts: products, loading: false});
                    } else {
                        set ({ filteredProducts: get().products, loading: false});
                    }
                } catch (error: any) {
                    set({ error: error.message, loading: false});
                }
            },
            searchProducts: async (query: string) => {
                const searchTerm = query.toLowerCase().trim();
                const {products, selectedCategory} = get();

                let filtered = products;

                if (selectedCategory) {
                    filtered = products.filter(
                        (product) => product.category === selectedCategory
                    );
                }

                if (searchTerm) {
                    filtered = filtered.filter(
                        (product) =>
                            product.title.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm) ||
                            product.category.toLowerCase().includes(searchTerm)
                    );
                }
                set({ filteredProducts: filtered});
            },
            sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => {
                const {filteredProducts} = get();
                let sorted = [...filteredProducts];

                switch (sortBy) {
                    case "price-asc":
                        sorted.sort((a, b) => a.price - b.price);
                        break;
                    case "price-desc":
                        sorted.sort((a, b) => b.price - a.price);
                        break;
                    case "rating":
                        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
                        break;
                    default:
                        break;
                }
                set({ filteredProducts: sorted});
            },
            searchProductsRealTime: async (query: string) => {
                try {
                    set({ loading: true, error: null});

                    if (!query.trim()) {
                        set({ filteredProducts: get().products, loading: false});
                        return;
                    }
                    const searchResults = await searchProductsApi(query);
                    set({ filteredProducts: searchResults, loading: false});
                } catch (error:any) {
                    set({ error: error.message, loading: false});

                }
            },
        })
);