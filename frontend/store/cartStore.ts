import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Représente un article dans le panier avec le produit et sa quantité
interface CartItem {
    product: Product;
    quantity: number;
}

// Définit la forme du store du panier et toutes les actions disponibles
interface CartState {
    items: CartItem[];                                                      // Liste des articles dans le panier
    addItem: (product: Product, quantity?: number) => void;                 // Ajouter un produit au panier
    removeItem: (productId: number) => void;                                // Supprimer un produit du panier
    updateQuantity: (productId: number, quantity: number) => void;          // Modifier la quantité d'un produit dans le panier
    clearCart: () => void;                                                  // Vider complètement le panier
    getTotalPrice: () => void;                                              // Calculer le prix total des articles dans le panier
    getItemCount: () => void;                                               // Obtenir le nombre total d'articles dans le panier
}

// Hook Zustand pour gérer l’état du panier avec persistance dans AsyncStorage
export const useCartStore=create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product: Product, quantity: number = 1) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product.id === product.id
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity}
                                : item
                            ),
                        };
                    } else {
                        return {
                            items: [ ...state.items, { product, quantity}],
                        }
                    }
                });
            },
            removeItem: (productId: number) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },
            updateQuantity: (productId: number, quantity: number) =>{
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((item) => 
                        item.product.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },
            clearCart: () => {
                set({items: [] });
            },
            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.product.price * item.quantity,
                    0
                );
            },
            getItemCount: () => {
                return get().items.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            },
        }),
        {
            name: "cart-storage", 
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)