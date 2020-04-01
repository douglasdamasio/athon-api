// Importação do Express para estrutura webapp 
const express = require('express');

// Impotação do arquivo controller das rotas
const QueryController = require('./controllers/QueryController');

// Criando a const responsavel pelas routes
const routes = express.Router();

// Routes

// Rota inicial, traz uma mensagem de Inicialização 
routes.get('/', QueryController.init);

// Rota para visualização das armas, com a opção de enviar o ID do crime
routes.get('/weapon/:id?', (req, res) => {QueryController.showWeapons(req, res)});

// Rota de visualização dos crimes, com a opção de enviar o ID do crime
routes.get('/crime/:id?', (req, res) => {QueryController.showCrimes(req, res)});

// Rota de inserção passando o formato JSON na requisição:
// {	
    //     "pais": "Nova Guiné",
    //     "data": "2020-02-01 00:00:00",
    //     "vitima": "Maui",
    //     "criminoso": "Moana",
    //     "tipoCrime": "Homicidio",
    //     "arma": "Coco",	
    //     "tipoArma": "Fruta"
// }
routes.post('/crime/insert', (req, res) => {QueryController.executeTransaction(req, res);});

// Rota delete com a obrigação de passar o ID do crime
routes.delete('/crime/:id', (req, res) => {QueryController.deleteCrime(req, res)});


// Exporta as routes para o arquivo server.js
module.exports = routes;