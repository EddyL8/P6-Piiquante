const express = require('express'); // Importation du framework Express qui permet la création de routeurs
const router = express.Router(); // Création d'un routeur

const auth = require('../middleware/auth'); // Importation du middleware d'authentification pour sécuriser les routes
const multer = require('../middleware/multer-config'); // Importation du middleware de configuration Multer pour la gestion de fichiers

const sauceCtrl = require('../controllers/sauce'); // Importation du controller sauce

// Création des routes CRUD (Create, Read, Update, Delete) avec middlewares et controllers
router.get('/', auth, sauceCtrl.getAllSauces); // Récupération de toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce); // Création d'une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Récupération d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modification d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppression d'une sauce
router.post('/:id/like', auth,sauceCtrl.likeSauce); // Like et dislike d'une sauce

// Exportation du routeur
module.exports = router;