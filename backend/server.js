require('dotenv').config();
const http = require('http'); // Importe le module http pour créer le serveur HTTP
const mongoose = require('mongoose'); // Importe le module mongoose pour la gestion de la base de données
const app = require('./app'); // Importe l'application Express depuis le fichier app.js

//Conexion à MongoDB
mongoose
  .connect(process.env.DB_PASSWORD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !')); // Établit la connexion à la base de données MongoDB

//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne ;
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // Renvoie le port tel quel s'il n'est pas un nombre
  }
  if (port >= 0) {
    return port; // Renvoie le port s'il est supérieur ou égal à zéro
  }
  return false; // Renvoie false si le port est invalide
};

const port = normalizePort(process.env.PORT || '4000'); // Normalise le port en utilisant la fonction normalizePort
app.set('port', port); // Définit le port sur l'application Express

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = (error) => {
  // Fonction pour gérer les erreurs du serveur
  if (error.syscall !== 'listen') {
    throw error; // Lève une exception si l'erreur n'est pas liée à l'écoute du serveur
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); // Quitte le processus avec le code d'erreur 1 si l'accès est refusé
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1); // Quitte le processus avec le code d'erreur 1 si le port est déjà utilisé
      break;
    default:
      throw error; // Lève une exception pour les autres erreurs
  }
};

const server = http.createServer(app); // Crée le serveur HTTP en utilisant l'application Express

server.on('error', errorHandler); // Gère les erreurs du serveur en utilisant la fonction errorHandler
server.on('listening', () => {
  // Écouteur pour l'événement 'listening' du serveur
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Affiche un message lorsque le serveur écoute sur le port ou le canal nommé
});

server.listen(port); // Lance le serveur en écoutant sur le port spécifié
