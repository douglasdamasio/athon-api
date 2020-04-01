// Importação do Express para estrutura webapp 
const express = require('express');

// Função para o JSON
const bodyParser = require('body-parser')

// Porta
const port = 3000;

// Iniciando o App
const app = express();

// Declaração do uso do JSON nos bodys
app.use(bodyParser.json());

// Formatação do JSON
app.set("json spaces", 4);

// Informando ao App o uso do prefixo /api para as routes
app.use('/api', require('./src/routes'));

// Ouvir o nodemon na porta declarada.
app.listen(port);

// Mensagem de OK
console.log('API OK!');