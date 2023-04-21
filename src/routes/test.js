const express = require('express');
const fs = require('fs');
const uuid = require("uuid");

const router = express.Router();

router.get("/", (req, res) => {
  let html = fs.readFileSync("././assets/html/index.html");
  const test = fs.readFileSync("././assets/html/test/test.html");
  html = html.toString().replace("{{component}}", test)
  res.end(html)
});

router.post("/store", (req, res) => {
});

module.exports = router;