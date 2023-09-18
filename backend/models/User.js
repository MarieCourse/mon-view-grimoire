const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Ajoute une validation personnalisée pour l'email
userSchema.path('email').validate(function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}, 'Adresse email invalide');

// Ajoute une validation personnalisée pour le mot de passe
userSchema.path('password').validate(function (password) {
  return password.length >= 8;
}, 'Le mot de passe doit contenir au moins 8 caractères');

userSchema.plugin(uniqueValidator);

// Exporte le modèle 'User' basé sur le schéma défini
module.exports = mongoose.model('User', userSchema);
