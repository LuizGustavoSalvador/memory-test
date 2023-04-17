const express = require('express');
const routes = require('./src/routes');

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(routes);
app.listen(PORT, HOST);