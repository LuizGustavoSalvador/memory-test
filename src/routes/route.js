const express = require('express');
const fs = require('fs');
const routes = express.Router();

routes.get('/', function (req, res) {
  let indexHtml = fs.readFileSync("././assets/html/index.html", { encoding: 'utf-8' });
  const login = fs.readFileSync("././assets/html/user/login.html", { encoding: 'utf-8' });

  if(!req.cookies.token){
    indexHtml = indexHtml.replace("{{component}}", login)

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml)
  }else{
    res.redirect("/test").end();
  }
});

module.exports = routes;