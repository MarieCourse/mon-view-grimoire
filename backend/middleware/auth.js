require('dotenv').config();
const jwt = require('jsonwebtoken'); // Importe le module jsonwebtoken pour la création et la vérification des tokens d'authentification

// Middleware pour vérifier le token d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //  Divise la chaîne d'en-tête pour récupérer la partie du token après "Bearer" de la requête.
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // Vérifie et décode le token en utilisant la clé secrète
    const userId = decodedToken.userId; // Récupère l'identifiant de l'utilisateur à partir du token décodé
    req.auth = {
      userId: userId, // Stocke l'identifiant de l'utilisateur dans l'objet 'auth' de la requête
    };
    next(); // Passe au prochain middleware ou à la fonction de routage
  } catch (error) {
    res.status(401).json({ error }); // Répond avec une erreur 401 en format JSON si le token est invalide ou expiré
  }
};
