const rateLimit = require('express-rate-limit'); // Importe le module express-rate-limit

// Définit un limiteur de taux avec une limite de 15 requêtes par minute
const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limite de 15 requêtes par minute
  message: 'Trop de tentatives de connexion. Réessayez plus tard.',
});

module.exports = loginRateLimiter;
