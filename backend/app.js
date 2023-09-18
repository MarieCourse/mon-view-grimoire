const express = require('express'); // Importe le module express pour la création d'une application web
const bodyParser = require('body-parser'); // Importe le module body-parser pour la gestion des données de requête
const cors = require('cors'); // Importe le module cors pour gérer les autorisations de partage de ressources inter-origines
const booksRoutes = require('./routes/books'); // Importe les routes liées aux livres
const userRoutes = require('./routes/user'); // Importe les routes liées aux utilisateurs
const path = require('path'); // Importe le module path pour la gestion des chemins de fichiers
const app = express(); // Crée une instance d'application Express

app.use(cors()); // Active le middleware cors pour gérer les autorisations de partage de ressources inter-origines
app.use(express.json()); // Active le middleware express.json pour analyser les données de requête au format JSON

app.use((req, res, next) => {
  // Middleware pour gérer les en-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines à accéder à l'API
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  ); // Autorise certains en-têtes dans les requêtes
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  ); // Autorise les méthodes HTTP spécifiées
  next(); // Passe au prochain middleware ou à la fonction de routage
});

app.use(bodyParser.json()); // Active le middleware body-parser.json pour analyser les données de requête JSON

app.use('/api/books', booksRoutes); // Utilise les routes liées aux livres
app.use('/api/auth', userRoutes); // Utilise les routes liées aux utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images'))); // Gère les requêtes d'accès aux images statiques

module.exports = app; // Exporte l'application Express pour pouvoir l'utiliser dans d'autres fichiers
