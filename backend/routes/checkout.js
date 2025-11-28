import { Router } from "express";
import stripe from "../lib/stripe.js";

const router = Router();

// Route POST "/checkout" pour démarrer une session de paiement Stripe
router.post("/checkout", async (req, res) => {
    // Extraction des données envoyées dans le corps de la requête
    const reqBody = await req.body;
    const { email, price } = reqBody;

    // Validation du prix : doit être un nombre positif valide
    if (typeof price !== "number" || isNaN(price) || price <=0) {
        return res.status(400).send({
            success: false,
            message: "Valeur de prix invalide",
        });
    }

    // Conversion du prix en centimes (Stripe travaille en plus petites unités monétaires)
    const amountInCents = Math.round(price * 100);
    try {
        // Création d'un nouveau client Stripe (sans données supplémentaires)
        const customer = await stripe.customers.create();
        // Création d'une clé éphémère pour le client, utile pour Stripe mobile SDKs
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {
                customer: customer.id,
            },
            { // version spécifique de l'API Stripe utilisée
                apiVersion: "2025-09-30.clover"
            }
        );
        // Création d'un PaymentIntent avec les données fournies
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "EUR",
            customer: customer.id,
            automatic_payment_methods: {
                // active les méthodes de paiement automatiques proposées par Stripe
                enabled: true,
            },
            receipt_email: email,                           // email pour envoyer le reçu après paiement
            description: `Commande de ${email}`,            // description du paiement
            metadata: {                                     // métadonnées personnalisées attachées au paiement
                email: email,
            }
        });
        // Réponse HTTP 200 avec les infos nécessaires pour finaliser le paiement côté client
        return res.status(200).send({
            success: true,
            message: 'Session de paiement crée avec succés !',
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
        });
    } catch (error) {
        // Gestion d'erreur : log serveur et réponse HTTP 500
        console.log("Error:", error);
        return res.status(500).send({
            success: false,
            message: "Paiement échoué",
        });
    }
});
    
export default router;