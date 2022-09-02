const bcrypt = require('bcrypt'); // Package de cryptage (hash) des mots de passe utilisateurs
const jwt = require('jsonwebtoken'); // Package qui permet de la création et la vérification d'un token d'authentification
const User = require('../models/user'); // Importation du schéma mongoose de création utilisateur

// Enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Hashage avec bcrypt, "salage" du mdp 10 fois
      .then(hash => {
        const user = new User({ // Création du nouvel utilisateur
          email: req.body.email, // Récupération de l'email utilisateur
          password: hash // Récupération du mdp hashé
        });
        user.save() // Enregistrement de l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Identification d'un utilisateur  
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Vérification de la présence de l'email dans la base de données
    .then(user => {
        if (!user) { // Envoi d'une erreur si l'email n'est pas trouvé
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // Vérification du mdp saisi avec le mdp hashé de la base de données
            .then(valid => {
                if (!valid) { // Envoi d'une erreur si le mdp saisi est incorrect
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign( // Encodage d'un nouveau token
                        { userId: user._id }, // Données utilisateur pour encodage
                        process.env.JWT_SECRET_TOKEN, // Clé secrète pour encodage
                        { expiresIn: '24h' } // Expiration du token
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};