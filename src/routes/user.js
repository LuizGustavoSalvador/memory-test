const { error } = require('console');
const express = require('express');
const fs = require('fs');
const uuid = require("uuid");

const router = express.Router();

router.get("/registra", (req, res) => {
  let html = fs.readFileSync("././assets/html/index.html");
  const register = fs.readFileSync("././assets/html/user/register.html");
  html = html.toString().replace("{{component}}", register)
  res.end(html)
});

router.post("/register", (req, res) => {
  var errors = [];

  if(!req.body.name || typeof req.body.name === undefined || req.body.name === null){
    errors.push({text: "Nome inválido"})
  }

  if(!req.body.email || typeof req.body.email === undefined || req.body.email === null){
    errors.push({text: "Email inválido"})
  }

  if(!req.body.password || typeof req.body.password === undefined || req.body.password === null){
    errors.push({text: "Senha inválida"})
  }

  if(req.body.password.length < 4){
    errors.push({text: "A senha deve conter pelo menos 4 dígitos"});
  }

  if(req.body.password !== req.body.passwordRepeat){
    errors.push({text: "A senhas não coincidem"});
  }

  if(errors.length > 0){
    const a = fs.readFileSync("././assets/html/index.html");
   res.end(alert(JSON.stringify(errors)));
  }else{
    var data = {"id": uuid.v4(), "name": req.body.name, "email": req.body.email, "password": req.body.password};

    fs.writeFileSync("./src/data/user.json", JSON.stringify(data));
    res.status(201).end('completo');
  }
});

module.exports = router;