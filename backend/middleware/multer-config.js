const multer = require('multer'); // Importe le module multer pour la gestion des fichiers uploadés
const SharpMulter = require('sharp-multer'); // Importe le module sharp-multer pour la transformation d'images lors de l'upload

// Fonction pour générer un nouveau nom de fichier
const newFilenameFunction = (originalname, options) => {
  const nameWithoutSpaces = originalname.split(' ').join('_'); // Remplace les espaces par des underscores dans le nom de fichier original
  const nameWithoutExtension = nameWithoutSpaces
    .split('.')
    .slice(0, -1)
    .join('.'); // Supprime l'extension du nom de fichier
  const timestamp = Date.now(); // Génère un timestamp actuel
  const newname = `${nameWithoutExtension}_${timestamp}.${options.fileFormat}`; // Crée un nouveau nom de fichier avec le timestamp et l'extension spécifiée
  return newname;
};

// Configuration du stockage avec SharpMulter
const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, 'images'), // Définit le dossier de destination des images uploadées

  imageOptions: {
    fileFormat: 'webp', // Spécifie le format de l'image après transformation
    resize: {
      height: 400,
      resizeMode: 'contain',
    }, // Définit les options de redimensionnement de l'image
  },

  filename: newFilenameFunction, // Utilise la fonction de génération de nom de fichier définie précédemment
});

// Exporte le middleware Multer configuré pour gérer un seul fichier 'image'
module.exports = multer({ storage }).single('image');
