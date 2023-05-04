const express = require('express');
const fs = require('fs');
const uuid = require("uuid");

const router = express.Router();

router.get("/", (req, res) => {
  let indexHtml = fs.readFileSync("././assets/html/index.html", "utf-8");
  let a = fs.readFileSync("./src/data/user.json");
  const register = fs.readFileSync("././assets/html/user/register.html");
  indexHtml = indexHtml.replace("{{jsCustom}}", `
  <script type="module">
    import { UserPage } from "/js/user.js";
    window.UserPage = new UserPage();
  </script>
`);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  indexHtml = indexHtml.toString().replace("{{component}}", register);

  res.end(indexHtml)
});

router.post("/create", (req, res) => {
  const users = JSON.parse(fs.readFileSync('./src/data/user.json', 'utf-8'));
  const { name, email, password } = req.body;
  const id = uuid.v1();
  const user = { id, name, email, password };
  const errors = {
    type: 'error',
    messages: []
  };

  if (!req.body.name || typeof req.body.name === undefined || req.body.name === null) {
    errors.messages.push({ text: "Nome inválido" });
  }

  if (!req.body.email || typeof req.body.email === undefined || req.body.email === null) {
    errors.messages.push({ text: "Email inválido" });
  }

  if (Object.keys(users.filter((u) => u.email === req.body.email)).length > 0) {
    errors.messages.push({ text: "Email já cadastrado" });
  }

  if (!req.body.password || typeof req.body.password === undefined || req.body.password === null) {
    errors.messages.push({ text: "Senha inválida" });
  }

  if (req.body.password.length < 4) {
    errors.messages.push({ text: "A senha deve conter pelo menos 4 dígitos" });
  }

  if (errors.messages.length > 0) {
    res.status(400).send(errors);
  } else {
    users.push(user);

    fs.writeFileSync("./src/data/user.json", JSON.stringify(users), { encoding: "utf-8" });

    let response = {
      type: 'success',
      messages: [
        {
          text: JSON.stringify(Object.keys(users.find(u => u.email === req.body.email)).length)
        }
      ]
    };

    res.status(201).send(response);
  }
});

router.post('/login', function (req, res) {
  const users = JSON.parse(fs.readFileSync('./src/data/user.json', "utf-8" ));
  const { email, password } = req.body;
  const login = { email, password };
  const errors = {
    type: 'error',
    messages: []
  };

  if (Object.keys(users.filter(user => user.email === login.email)).length === 0) {
    errors.messages.push({ text: 'Usuário não encontrado' });
  }

  if (Object.keys(users.filter(user => user.password === login.password)).length === 0) {
    errors.messages.push({ text: 'Senha incorreta' });
  }

  if (errors.messages.length > 0) {
    res.status(400).send(errors);
  } else {
    let response = {
      type: 'success',
      messages: [
        {
          text: 'Bem vindo'
        }
      ]
    };

    res.status(200).send(response);
  }

});

module.exports = router;