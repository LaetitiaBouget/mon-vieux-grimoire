const express = require('express');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://letitibou:MGzOhZPFXhJ72gA0@cluster0.7649tae.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(err => console.error('Connexion à MongoDB échouée !', err));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());


module.exports = app;

