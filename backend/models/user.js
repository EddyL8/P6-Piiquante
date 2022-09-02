const mongoose = require('mongoose'); // Package pour les interactions avec la base de données
const uniqueValidator = require('mongoose-unique-validator'); // Package de validation d'email unique

// Création de schéma de données utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // Utilisation du plugin pour la vérification d'email unique

// Exportation du modèle utilisateur
module.exports = mongoose.model('User', userSchema);