const express = require('express');
const routes = require('./src/routes/route');
const user = require('./src/routes/user');
const test = require('./src/routes/test');

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(routes);
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/user', user);
app.use('/test', test);
app.listen(PORT, HOST);