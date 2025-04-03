const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(err => console.error('Connexion à MongoDB échouée !', err));

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

