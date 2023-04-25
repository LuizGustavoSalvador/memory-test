const express = require('express');
const fs = require('fs');
const uuid = require("uuid");

const router = express.Router();

router.get("/", (req, res) => {
  let html = fs.readFileSync("././assets/html/index.html");
  let  a = fs.readFileSync("./src/data/user.json");
  const register = fs.readFileSync("././assets/html/user/register.html");
  html = html.toString().replace("{{component}}", register);
  html = html.toString().replace("{{users}}", a);
  res.end(html)
});

router.post("/register", (req, res) => {
  const users = JSON.parse(fs.readFileSync('./src/data/user.json', {encoding: "utf-8"}));
  const {name, email, password} = req.body;
  const id = uuid.v1();
  const user = {id, name, email, password}; 
  users.push(user);
  fs.writeFileSync("./src/data/user.json", JSON.stringify(users), {encoding: "utf-8"});
  // var errors = [];

  // if(!req.body.name || typeof req.body.name === undefined || req.body.name === null){
  //   errors.push({text: "Nome inválido"})
  // }

  // if(!req.body.email || typeof req.body.email === undefined || req.body.email === null){
  //   errors.push({text: "Email inválido"})
  // }

  // if(!req.body.password || typeof req.body.password === undefined || req.body.password === null){
  //   errors.push({text: "Senha inválida"})
  // }

  // if(req.body.password.length < 4){
  //   errors.push({text: "A senha deve conter pelo menos 4 dígitos"});
  // }

  // if(req.body.password !== req.body.passwordRepeat){
  //   errors.push({text: "A senhas não coincidem"});
  // }

  // if(errors.length > 0){
  //   const a = fs.readFileSync("././assets/html/index.html");
  //  //res.end(alert(JSON.stringify(errors)));
  // }else{
    // dataFile.push({"id": uuid.v1(), "name": req.body.name, "email": req.body.email, "password": req.body.password});
    // fs.writeFileSync("./src/data/user.json", JSON.stringify(dataFile));
    res.end(res.redirect("/"));
  // }
});

router.post('/login', function(req, res){
  const users = JSON.parse(fs.readFileSync('./src/data/user.json', {encoding: "utf-8"}));
  const {email, password} = req.body;
  const login = {email, password};
  const errors = [];

  if(users.filter(user => user.email === login.email).length === 0){
    errors.push({
      text: 'Usuário não encontrado'
    });
  }

  if(users.filter(user => user.password === login.password).length === 0){
    errors.push({
      text: 'Senha incorreta'
    });
  }
  
  if(errors.length > 0){
    res.status(400).send(errors);
  }else{
    res.status(200).send({opa: "tudo bão"});
    //res.redirect('../test');
  }

});

module.exports = router;