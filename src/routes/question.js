const express = require('express');
const fs = require('fs');
const uuid = require("uuid");
// const axios = require('axios');

const router = express.Router();

router.get("/", (req, res) => {
  let html = fs.readFileSync("././assets/html/index.html");
  const test = fs.readFileSync("././assets/html/question/add.html");
  html = html.toString().replace("{{component}}", test)
  res.end(html)
});

router.post("/store", async (req, res) => {
  let jsonPath = "./src/data/question.json";
  let dataFile = JSON.parse(fs.readFileSync(jsonPath));

  //dataFile.push(req.body);
  //fs.writeFileSync(jsonPath, JSON.stringify(dataFile));
  res.status(201).send(JSON.stringify(req.body));
})
// router.post("/store", (req, res) => {
//     console.log(req.body);
// });

module.exports = router;