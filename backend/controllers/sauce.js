// Importation du model Sauce
const Sauce = require('../models/sauce');
// Fonction de gestion de fichiers (modification/suppression)
const fs = require('fs');

// Ajout d'une nouvelle sauce (requête POST)
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // Suppression id généré automatiquement
    const sauce = new Sauce({
        ...sauceObject, // Récupération des données avec l'opérateur spread
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Récupération de l'url de l'image
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

// Affichage d'une sauce (requête GET)
/**
 * Affichage d'une sauce
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id}) // Récupération d'une sauce à partir de son id
  .then((sauce) => { res.status(200).json(sauce)})
  .catch((error) => { res.status(404).json({ error })});
};

// Affichage de toutes les sauces (requête GET)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauce) => { res.status(200).json(sauce)})
  .catch((error) => { res.status(404).json({ error })});
};

// Modification d'une sauce seulement par l'utilisateur qui l'a créé (requête PUT)
exports.modifySauce = (req, res, next) => {
  // Modification du contenu et de l'image si elle est changée
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Suppression de l'image stockée localement
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
};

// Suppression d'une sauce (requête DELETE)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; // Récupération du nom du fichier
      // Suppression des données et de l'image de la sauce
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
          .catch(error => res.status(401).json({ error }));
      }); 
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};

// Like et Dislike des sauces
exports.likeSauce = (req, res) => {
  // Si l'utilisateur like la sauce
  if (req.body.like === 1) { 
    Sauce.updateOne(
      { _id: req.params.id }, 
      { $inc: { likes: 1 }, // Incrémentation de 1
      $push: { usersLiked: req.body.userId }} // Ajout de l'utilisateur qui like dans la tableau des likes
    )
    .then(() => res.status(200).json({ message: 'Like ajouté' }))
    .catch((error) => res.status(400).json({ error }));

  // Si l'utilisateur dislike la sauce
  } else if (req.body.like === -1) {
      Sauce.updateOne( 
        { _id: req.params.id },
        { $inc: { dislikes: 1 }, 
        $push: { usersDisliked: req.body.userId }} // Ajout de l'utilisateur qui dislike dans le tableau des dislikes
      )
      .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
      .catch((error) => res.status(400).json({ error }));

  // Si l'utilisateur retire son like ou son dislike
  } else {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.usersLiked.includes(req.body.userId)){ 
        Sauce.updateOne( 
        { _id: req.params.id },
        { $inc: { likes: -1 }, 
        $pull: { usersLiked: req.body.userId }} // Retrait de l'utilisateur du tableau des likes
        )
        .then(() => res.status(200).json({ message: 'Like retiré' }))
        .catch((error) => res.status(400).json({ error }));
      
      } else if (sauce.usersDisliked.includes(req.body.userId)){ 
        Sauce.updateOne( 
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, 
          $pull: { usersDisliked: req.body.userId }} // Retrait de l'utilisateur du tableau des dislikes
        )
        .then(() => res.status(200).json({ message: 'Dislike retiré' }))
        .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
  }
};