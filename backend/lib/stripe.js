import Stripe from "stripe";

// Vérification que la clé secrète Stripe est définie dans les variables d'environnement
// Cette clé est nécessaire pour authentifier les requêtes vers l'API Stripe
if (!process.env.STRIPE_SECRET_KEY){
    throw new Error("STRIPE_SECRET_KEY is not defined");
}

// Initialisation d'une instance Stripe avec la clé secrète
// La version de l'API Stripe est spécifiée explicitement (ici "2025-09-30.clover")
// Cela garantit que les appels utilisent cette version d'API même si l'API évolue
const stripe = new Stripe( process.env.STRIPE_SECRET_KEY, {
    // version de l'API Stripe à utiliser
    apiVersion: "2025-09-30.clover", //"2025-04-30.basil" si besoin 
});

// Exportation de l'instance Stripe configurée pour l'utiliser dans le reste de l'application
export default stripe;