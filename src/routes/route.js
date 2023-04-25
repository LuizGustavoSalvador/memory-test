const express = require('express');
const fs = require('fs');
const routes = express.Router();

routes.get('/', function(req, res){
  let html = fs.readFileSync("././assets/html/index.html", {encoding: 'utf-8'});
  const login = fs.readFileSync("././assets/html/user/login.html", {encoding: 'utf-8'});
  html = html.replace("{{component}}", login)
  html = html.replace("{{jsCustom}}", '<script src="/js/login.js"></script>')
  res.end(html)
});

module.exports = routes;