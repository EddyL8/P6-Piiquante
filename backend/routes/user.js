const express = require('express'); // Importation du framework Express qui permet la création de routeurs
const router = express.Router(); // Création d'un routeur
const passwordValidator = require('../middleware/password'); // Importation du middleware de configuration du mdp
const userCtrl = require('../controllers/user'); // Importation du controller user

// Création des routes POST pour la création et l'identification d'un utilisateur avec middleware password et controllers
router.post('/signup', passwordValidator, userCtrl.signup); 
router.post('/login', passwordValidator, userCtrl.login);  

// Exportation du routeur
module.exports = router;