const express = require('express');
const fs = require('fs');
const routes = express.Router();

routes.get('/', function(req, res){
  let html = fs.readFileSync("././assets/html/index.html");
  const login = fs.readFileSync("././assets/html/login.html");
  html = html.toString().replace("{{login}}", login)
  res.end(html)
});

module.exports = routes;