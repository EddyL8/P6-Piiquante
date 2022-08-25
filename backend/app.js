const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
//const session=require('express-session')


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,    // 10 minutes
  max: 100                     // 100 requests per IP
});
app.use(limiter);

helmet({
    crossOriginResourcePolicy: false,
})

/*app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 600 * 100
  }
}));
*/

app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/sauces', sauceRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;