const express = require('express');

const QueryController = require('./controllers/QueryController');

const routes = express.Router();


// Routes
routes.get('/', QueryController.init);

routes.get('/weapon/:id?', (req, res) => {QueryController.showWeapons(req, res)});

routes.get('/crime/:id?', (req, res) => {QueryController.showCrimes(req, res)});

routes.post('/crime/insert', (req, res) => {QueryController.executeTransaction(req, res);});

routes.delete('/crime/:id', (req, res) => {QueryController.deleteCrime(req, res)});



module.exports = routes;