// Importation des modules nécessaires pour le serveur Express
// - express: framework web pour Node.js
// - dotenv: chargement des variables d'environnement depuis .env
// - cors: middleware pour gérer les requêtes cross-origin
// - checkout: routes personnalisées pour le checkout (importées depuis ./routes/checkout.js)
import express from "express";
import "dotenv/config";
import cors from "cors";
import checkout from "./routes/checkout.js"

// Configuration de l'application Express
// PORT récupéré depuis les variables d'environnement ou 8000 par défaut
const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares appliqués globalement
// - CORS activé pour toutes les origines (autorise les requêtes cross-origin)
app.use(cors());
// - Parser JSON pour les bodies des requêtes POST/PUT
app.use(express.json());

// Route de test racine - vérifie que le serveur répond correctement
app.get("/", (req, res) => {
    // Réponse simple de confirmation que le serveur fonctionne
    res.send("ehe on est bon");
});

// Montage des routes checkout sur la racine "/"
// Toutes les routes définies dans checkout.js seront accessibles
app.use("/",checkout);

// Démarrage du serveur sur le port spécifié
// Log de confirmation dans la console avec le port utilisé
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});