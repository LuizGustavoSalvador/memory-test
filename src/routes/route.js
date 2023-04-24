const express = require('express');
const fs = require('fs');
const { encode } = require('punycode');
const routes = express.Router();

routes.get('/', function(req, res){
  let html = fs.readFileSync("././assets/html/index.html");
  const login = fs.readFileSync("././assets/html/user/login.html");
  html = html.toString().replace("{{component}}", login)
  res.end(html)
});

module.exports = routes;