// Import du modèle Book depuis le dossier '../models/Book'
const Book = require('../models/Book');
// Import du module 'fs' pour accéder au système de fichiers
const fs = require('fs');

// GET -- Récupère tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books)) // Répond avec un tableau de livres en format JSON
    .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en format JSON si une erreur survient
};

// GET - Récupère les meilleurs livres notés
exports.getBestRatingBooks = (req, res, next) => {
  Book.find() // Récupère tous les livres dans la collection de la BDD
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Limite la réponse aux 3 premiers livres
    .then((books) => res.status(200).json(books)) // Répond avec un tableau de livres en format JSON
    .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en format JSON si une erreur survient
};

// POST - Crée un nouveau livre
exports.createBook = (req, res, next) => {
  // Parse les données JSON de la requête pour créer un nouvel objet livre
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject, // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
    userId: req.auth.userId, // Associe l'ID de l'utilisateur authentifié au livre
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`, // Construit l'URL de l'image du livre :
    // req.protocol récupère le protocol utilisé dans la requête (HTTP/HTTPS)
    // ${req.get('host')} renvoie le domaine du serveur de la requête
    // ${req.file.filename} contient le nom du fichier téléchargé
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Livre enregistré !' }); // Répond avec un message de succès en format JSON
    })
    .catch((error) => {
      res.status(400).json({ error }); // Répond avec une erreur 400 en format JSON si une erreur survient
    });
};

// GET - Récupère un livre par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book)) // Répond avec le livre trouvé en format JSON
    .catch((error) => res.status(404).json({ error })); // Répond avec une erreur 404 en format JSON si le livre n'est pas trouvé
};

// PUT - Met à jour un livre
exports.modifyBook = (req, res, next) => {
  let updatedBookObject = req.body;

  if (req.file) {
    updatedBookObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`;
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'Unauthorized request' }); // Répond avec un message d'erreur en format JSON si l'utilisateur n'est pas autorisé
      } else {
        if (req.file && book.imageUrl !== updatedBookObject.imageUrl) {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              console.error('Error deleting old image:', err);
            }
          });
        }
        // Met à jour le livre
        Book.updateOne(
          { _id: req.params.id },
          { ...updatedBookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Livre modifié !' })) // Répond avec un message de succès en format JSON
          .catch((error) => res.status(401).json({ error })); // Répond avec une erreur 401 en format JSON si une erreur survient
      }
    })

    .catch((error) => {
      res.status(400).json({ error }); // Répond avec une erreur 400 en format JSON si une erreur survient
    });
};

// POST - Noter un livre
exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const { rating } = req.body;
  const bookId = req.params.id;
  const newRating = { userId, grade: rating };

  Book.findOneAndUpdate(
    { _id: bookId },
    { $push: { ratings: newRating } },
    { new: true }
  )
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' }); // Répond avec un message d'erreur en format JSON si le livre n'est pas trouvé
      }

      const sumRatings = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );

      const averageRating = sumRatings / book.ratings.length;
      const roundedAverage = Math.round(averageRating);

      book.averageRating = roundedAverage;

      return book.save();
    })
    .then((updatedBook) => {
      res.status(200).json(updatedBook); // Répond avec le livre mis à jour en format JSON
    })
    .catch((error) => {
      res.status(500).json({ error }); // Répond avec une erreur 500 en format JSON si une erreur survient
    });
};

// DELETE - Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId != req.auth.userId) {
      res.status(403).json({ message: 'Unauthorized request' }); // Répond avec un message d'erreur en format JSON si l'utilisateur n'est pas autorisé
    } else {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Objet supprimé !' }); // Répond avec un message de succès en format JSON
          })
          .catch((error) => res.status(401).json({ error })); // Répond avec une erreur 401 en format JSON si une erreur survient
      });
    }
  });
};
