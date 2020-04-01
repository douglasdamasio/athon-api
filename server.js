const express = require('express');
const bodyParser = require('body-parser')
// Porta
const port = 3000;

// Iniciando o App
const app = express();

app.use(bodyParser.json());

app.set("json spaces", 4);

app.use('/api', require('./src/routes'));

app.listen(port);
console.log('API OK!');