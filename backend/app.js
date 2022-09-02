const express = require('express'); // Importation du framework Express utilisé pour la création d'application node.js
const app = express(); // Importation de l'application Express sur le serveur
const mongoose = require('mongoose'); // Package pour les interactions avec la base de données
const path = require('path'); // Importation de Path pour avoir accès aux chemins de fichiers
const helmet = require("helmet"); // Package Helmet pour la sécurité des headers (en-têtes) http
const rateLimit = require('express-rate-limit'); // Package qui limite le nombre de requête d'un utilisateur/IP pour empêcher le DDOS
const mongoSanitize = require('express-mongo-sanitize'); // Package qui permet le nettoyage des données par injection
const xssClean = require('xss-clean'); // Package qui nettoie les entrées utilisateur, POST, GET, paramètres url
const cors = require('cors'); // Package qui permet l'utilisation de plusieurs domaines

// Importation des routes sauce et utilisateur
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

require('dotenv').config(); // Gestion des variables d'environnements qui protègent les informations de connexion à la base de données

// Connexion à mongoDB et récupération des données de la base via le lien sécurisé avec les variables d'environnements
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration de la limite de requêtes par utilisateur sur un temps donné
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max: 250                     // 250 requêtes maximum par IP
});
app.use(limiter);

app.use(helmet.crossOriginEmbedderPolicy());
app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());
app.use(cors());

// Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès de l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // Accès aux requêtes envoyées à l'API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Accès aux méthodes listées
    next();
  });

// Récupération des images et des routes sauces et auth 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'application
module.exports = app;