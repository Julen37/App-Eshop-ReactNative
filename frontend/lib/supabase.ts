// Importation des variables d'environnement contenant les identifiants Supabase
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, } from "@/config";

// Importation du client Supabase et des modules nécessaires
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Implémentation d'un adaptateur de stockage personnalisé pour SecureStore
// Cet adaptateur permettra à Supabase de stocker les tokens d'authentification
// de manière sécurisée, selon la plateforme.
const ExpoSecureStoreAdapter = {
    // Récupère un élément depuis le stockage sécurisé
    getItem: (key: string) => {
        // si on est sur le web utiliser localstorage
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        }
        // sinon (mobile), utiliser securestore de maniere asynchrone
        return SecureStore.getItemAsync(key);
    },
    // enregistre un element dans le stockage securisé
    setItem: (key: string, value: string) => {
        // utilisation du localstorage sur le web
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
            return;
        }
        // utlisation de securestore sur mobile
        return SecureStore.setItemAsync(key, value);
    },
    // supprime un element du stockage sécurisé
    removeItem: (key: string) => {
        // suppression avec localstorage sur le web
        if (Platform.OS === "web") {
            localStorage.removeItem(key);
            return;
        }
        // suppression sécurisée avec securestore sur mobile
        return SecureStore.deleteItemAsync(key);
    },
};

// Initialisation des variables de connexion à Supabase
// Ces valeurs proviennent de tes variables d'environnement définies dans config.ts
const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// Création du client Supabase avec configuration de l'authentification
