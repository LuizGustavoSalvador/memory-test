const express = require('express');
const fs = require('fs');
const uuid = require("uuid");
const axios = require('axios');

const router = express.Router();

router.get("/", (req, res) => {
  let html = fs.readFileSync("././assets/html/index.html");
  const test = fs.readFileSync("././assets/html/question/add.html");
  html = html.toString().replace("{{component}}", test)
  res.end(html)
});

router.post("/store", async (req, res) => {
    let data = {};

    fs.writeFileSync("./src/data/question.json", JSON.stringify(req.body));
    res.status(201).send(req.body);
})
// router.post("/store", (req, res) => {
//     console.log(req.body);
// });

module.exports = router;