//  importation du client supabase preconfiguré
import { supabase } from "@/lib/supabase";

// importation de la fonction 'create' de zustand pour la gestion d'etat globale
import { create } from "zustand";

// definition du type utilisateur, avec id et email
export interface User {
    id: string;
    email: string;
}

// definition du type du store d'authentification
// il contient l'user, le loading
// eventuellement un message d'erreur et les methodes d'authentification
interface AuthState {
    user: User | null; 
    isLoading: boolean;
    error: string | null;

    // actions d'authentification
    signup: (email: string, password: string) => Promise<void>; //créé un compte
    login: (email: string, password: string) => Promise<void>; //connecte un user
    logout: () => Promise<void>; // deco le user
    checkSession: () => Promise<void>; // verifie la session en cours     
}

// creation du store zustand pour gerer l'authentification
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    // fonction de login par email et mdp
    login: async (email: string, password: string) => {
        try {
            // debut du chargement, reinitialisation de l'erreur
            set ({isLoading: true, error: null});
            // appel à l'api supabase pour se connecter
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            // gere l'erreur supabase eventuelle
            if (error) throw error;

            // si connexion reussie, met a jour l'user dans le store
            if (data && data.user) {
                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email || "",
                    },
                    isLoading: false,
                });
            }
        } catch (error: any) {
            // en cas d'echec, stocke le message d'erreur et arrete le chargement
            set({ error: error.message, isLoading: false});
        }
    },

    // fonction de creation de compte user
    signup: async (email: string, password: string) => {
        try {
            // indique le debut du processus et reinitialise les erreur
            set({isLoading: true, error: null});
            // appel a l'api supabase pour creer le compte
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            // gere les erreur eventuelles
            if (error) throw error;
            // si succes, stocke le new user dans la bdd
            if (data && data.user) {
                set({
                    user: {
                        id: data.user.id,
                        email: data.user.email || "",
                    },
                    isLoading: false,
                });
            }
        } catch (error: any) {
            // gere erreur lors de creation de compte
            set({ error: error.message, isLoading: false});
        }
    },

    // fonction deconnexion user
    logout:async () => {
        try {
            // debut du process de deconnexion, nettoyage de l'erreur
            set({isLoading: true, error: null});
            // appel a l'api supabase pour se deconnecter
            const { error } = await supabase.auth.signOut();
            // gere les erreurs eventuelles
            if (error) throw error;
            // reinitialisation le store a l'etat deconnecté
            set ({ user: null, isLoading: false});
        } catch (error: any) {
            // stocke l'erreur eventuelle
            set({ error: error.message, isLoading: false});
        }
    },

    // fonction pour verifier la session en cours (refresh du token, reconnect..)
    checkSession: async () => {
        try {
            // debut du chargement et reinitialisation de l'erreur
            set({isLoading: true, error: null});
            // appel a supabase pour recup la session de l'erreur
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            // si session existante, met a jour l'user dans le sotre
            if (data && data.session) {
                const { user } = data.session;
                set({
                    user: {
                        id: user.id,
                        email: user.email || "",
                    },
                    isLoading: false,
                });
            } else {
                // si aucune session, on met l'user a null
                set({ user: null, isLoading: false});
            }
        } catch (error: any) {
            // gestion des erreurs lors du check de session
            set({ user: null, error: error.message, isLoading: false});
        }
    },
}));