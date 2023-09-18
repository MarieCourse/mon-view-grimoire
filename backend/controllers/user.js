require('dotenv').config();
const bcrypt = require('bcrypt'); // Importe le module de hachage bcrypt pour le cryptage des mots de passe
const jwt = require('jsonwebtoken'); // Importe le module jsonwebtoken pour la gestion des jetons JWT
const User = require('../models/User'); // Importe le modèle User depuis le dossier '../models/User'

// Crée un nouvel utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // Hache le mot de passe avec un niveau de salage de 10
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash, // Stocke le mot de passe haché dans la base de données
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // Répond avec un message de succès en format JSON
        .catch((error) => res.status(400).json({ error })); // Répond avec une erreur 400 en format JSON si une erreur survient
    })
    .catch((error) => res.status(500).json({ error })); // Répond avec une erreur 500 en format JSON si une erreur survient
};

// Connecte un utilisateur
exports.login = (req, res, next) => {
  // Vérifie si l'email existe dans la base de données
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: 'Paire identifiant/mot de passe incorrecte' }); // Répond avec une erreur 401 en format JSON si l'utilisateur n'existe pas
      } else {
        // Si l'utilisateur existe, compare les mots de passe
        bcrypt
          .compare(req.body.password, user.password) // Compare le mot de passe fourni avec celui stocké
          .then((valid) => {
            if (!valid) {
              // Mot de passe incorrect
              res
                .status(401)
                .json({ message: 'Paire identifiant/mot de passe incorrecte' }); // Répond avec une erreur 401 en format JSON si le mot de passe est incorrect
            } else {
              // Mot de passe correct
              const token = jwt.sign(
                { userId: user._id },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: '4h',
                }
              );

              res.status(200).json({
                userId: user._id,
                token: token,
              });

              // res.status(200).json({
              //   userId: user._id,
              //   token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
              //     expiresIn: '4h', // Crée un jeton JWT avec une durée de validité de 4 heures
              //   }),
              // });
            }
          })
          .catch((error) => {
            res.status(500).json({ error }); // Répond avec une erreur 500 en format JSON si une erreur survient lors de la comparaison
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); // Répond avec une erreur 500 en format JSON si une erreur survient lors de la recherche de l'utilisateur
    });
};
