const passwordValidator = require("password-validator"); // Importation du package de validation de mdp

// Création du schéma de mdp
const passwordSchema = new passwordValidator();

passwordSchema // Schéma de création d'un mdp
.is().min(8)                                    // 8 caractères minimum
.is().max(20)                                   // 20 caractères maximum
.has().uppercase()                              // Doit contenir au moins une majuscule
.has().lowercase()                              // Doit contenir au moins une minuscule
.has().digits(2)                                // Doit contenir au moins 2 chiffres
.has().symbols()                                // Doit contenir au moins un symbole
.has().not().spaces()                           // Ne doit pas contenir d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Exemples d'écriture de mdp refusés 

// Vérification du mdp
module.exports = (req,res,next) => {
    if(passwordSchema.validate(req.body.password)){ // Validation si le mdp est conforme au schéma
        next();
    }else{ // Envoi d'une erreur si le mdp n'est pas valide
        res.status(400).json({ error : `Le mot de passe n'est pas valide ! ${passwordSchema.validate('req.body.password',{list: true})}`})
    }
};