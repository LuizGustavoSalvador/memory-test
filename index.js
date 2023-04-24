const express = require('express');
const routes = require('./src/routes/route');
const test = require('./src/routes/test');
const user = require('./src/routes/user');
const fs = require('fs');

const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(routes);
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

app.use('/test', test);
app.use('/user', user);
app.use(function(req,res){
  let html = fs.readFileSync('././assets/html/index.html');
  let error404 = fs.readFileSync('././assets/html/404.html');
  html = html.toString().replace('{{component}}', error404);

  res.status(404).end(html);
});

app.listen(PORT, HOST);