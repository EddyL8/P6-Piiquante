const jwt = require('jsonwebtoken'); // Package qui permet de la création et la vérification d'un token d'authentification

// Exportation du module de token
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1]; // Récupération du token dans le header autorisation
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // Décodage du token pour vérification
       const userId = decodedToken.userId; // Récupération de l'id utilisateur du token vérifié
       if (req.body.userId && req.body.userId !== userId) { // Comparaison de l'id utilisateur de la requête avec celui du token
        throw "User Id non valide"; // Envoi d'une erreur si l'utilisateur n'est pas valide
        } else {
            next();
        }
   } catch(error) {
    res.status(401).json({ error: error | "Requete non authentifiée" });
   }
};