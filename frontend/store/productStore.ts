// import des fonctions d'api et des types nécessaires
import { getCategories, getProducts } from '@/lib/api';
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
//action to fetch products
    fetchProducts: () => Promise<void>;         //methode pour recuperer les produits depuis l'api
    fetchCategories: () => Promise<void>;      //methode pour recuperer les categories depuis l'api
};

//création du store avec Zustand et persistance avec AsyncStorage
export const useProductStore = create<ProductsState>()(
    // middleware de persistance
    persist(
        (set, get)=>({
            //initialisation des valeurs du state
            products: [],
            filteredProducts: [],
            categories: [],
            loading: false,
            error: null,

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
        }),
        //option du middleware de persistance
        {
            name: 'product-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);