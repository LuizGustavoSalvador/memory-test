const express = require('express');
const routes = require('./src/routes/route');
const user = require('./src/routes/user');

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(routes);
app.use('/user', user);
app.listen(PORT, HOST);