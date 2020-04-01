const express = require('express');

const QueryController = require('./controllers/QueryController');

const routes = express.Router();


// Routes
routes.get('/', QueryController.init);

routes.get('/weapon/:id?', (req, res) => {QueryController.showWeapons(req, res)});

routes.get('/crime/:id?', (req, res) => {QueryController.showCrimes(req, res)});


module.exports = routes;