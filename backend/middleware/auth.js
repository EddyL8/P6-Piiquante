const jwt = require('jsonwebtoken'); // Package qui permet de la création et la vérification d'un token d'authentification

// Exportation du module de token
module.exports = (req, res, next) => {
   try {
    const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans le header autorisation
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // Décodage du token pour vérification
    const userId = decodedToken.userId; // Récupération de l'id utilisateur du token vérifié
    req.auth = {
    userId: userId
    };
    next();
   } catch(error) {
    res.status(401).json({ error: error | "Requete non authentifiée" });
   }
};