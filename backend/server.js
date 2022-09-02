const http = require('http'); // Importation du package http pour la création d'un serveur
const app = require('./app'); // Importation de l'application Express sur le serveur avec le fichier app.js

// Renvoi d'un port valide avec normalizePort
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Utilisation du port renseigné dans le fichier .env si aucun port n'est fourni
const port = normalizePort(process.env.PORT);
app.set('port', port);

// Gestion des erreurs avec errorHandler
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création et écoute des requêtes du serveur
const server = http.createServer(app);

server.on('error', errorHandler); // Lancement du server et gestion des erreurs
server.on('listening', () => { // Écouteur d'évènements sur le port sur lequel le serveur s'exécute
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Écoute du serveur
server.listen(port);