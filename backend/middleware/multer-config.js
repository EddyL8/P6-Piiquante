const multer = require('multer'); // Importation du package Multer pour la gestion de fichiers entrants

// Création d'un objet dictionnaire des types MIME pour la gestion des extensions de fichiers
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Création d'un objet de configuration de multer et la gestion des fichiers images
const storage = multer.diskStorage({ // Utilisation de diskStorage pour l'enregistrement des fichiers 
  destination: (req, file, callback) => { // Destination du fichier à enregistrer
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // Nommage du fichier à enregistrer
    const name = file.originalname.split(' ').join('_'); // Remplacement des espaces par un underscore
    const extension = MIME_TYPES[file.mimetype]; // Vérification et ajout de l'extension au fichier
    callback(null, name + Date.now() + '.' + extension); // Ajout d'un timestamp au nom du fichier
  }
});

// Création d'un objet de configuration de filtre des fichiers images
const fileFilter = (req, file, callback) => {
  if (( MIME_TYPES[file.mimetype] === "jpg") ||
      ( MIME_TYPES[file.mimetype] === "png") || 
      ( MIME_TYPES[file.mimetype] === "webp")) {
    return callback(null, true);
  }
  callback(new Error( 'Fichier non valide ! Seuls les formats jpg, jpeg, png et webp')); // Renvoi une erreur si fichier non valide
};

// Exportation de Multer avec la configuration de storage, fileFilter et les fichiers image unique
module.exports = multer({storage: storage, fileFilter: fileFilter}).single('image');