const express = require('express');
const fs = require('fs');
const uuid = require("uuid");
const slugify = require("slugify");

const router = express.Router();

router.get("/", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let testPage = fs.readFileSync('././assets/html/test/test.html', 'utf-8');
  let tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  let testTemplate = fs.readFileSync('././assets/templates/test-list.html', 'utf-8');

  let testHtml = tests.map((test) => {
    let testHtml = testTemplate.replace("{{slug}}", test.slug);
    testHtml = testHtml.replace("{{name}}", test.name);
    testHtml = testHtml.replace("{{numQuestions}}", test.numQuestions);
    testHtml = testHtml.replace("{{maxOptions}}", test.maxOptions);

    return testHtml;
  });

  if(testHtml.length > 0){
    testHtml = testHtml.join();
    testHtml = testHtml.replace(',', '').replace(', ', ''). replace(' ,', '');
  }else{
    testHtml = '<h3 class="no-tests">Nenhum teste cadastrado</h3>';
  }
  testPage = testPage.replace("{{list}}", testHtml);
  indexHtml = indexHtml.replace("{{component}}", testPage);

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(indexHtml);
});

router.post("/store", (req, res) => {
  const tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  const {name, numQuestions, maxOptions} = req.body;
  const id = uuid.v1();
  const slug = slugify(req.body.name);
  const test = {id, slug, name, numQuestions, maxOptions}; 
  tests.push(test);
  fs.writeFileSync("./src/data/test.json", JSON.stringify(tests), {encoding: "utf-8"});

  res.redirect("http://localhost:3000/test");
  res.end();
});

router.get("/:slug/question", (req, res) => {
  let slug = req.params.slug;
  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).filter(test => test.slug === slug); 
  let html = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let question = fs.readFileSync('././assets/html/question/question.html', 'utf-8');

  if(test.length === 1){
    let questions = test[0].questions ? test[0].questions.length : 0;
    let numQuestions = test[0].numQuestions - questions;
    res.cookie('maxQuestions', numQuestions > 0 ? numQuestions : 0);
    res.cookie('maxOptions', test[0].maxOptions);

    if(numQuestions < 0){
      question = fs.readFileSync('././assets/templates/no-questions.html', 'utf-8');
    }
  }

  
  question = question.replace("{{testId}}", test[0].id);
  html = html.replace("{{component}}", question);
  html = html.replace("{{jsCustom}}", '<script src="/js/question.js"></script>')

  res.end(html);
});

router.post("/question/store", (req, res) => {
  let data = req.body;
  let testFile = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  let testData = testFile.map((t) => {
      if(data.test_id === t.id){
        if(t.questions === null || t.questions === "undefined" || !t.questions){
         t.questions = [];
        }
        t.questions.push(data.questions);
      }
      return t;
    });
  
  fs.writeFileSync("./src/data/test.json", JSON.stringify(testData), {encoding: "utf-8"});  

  res.status(201).send(testData);
});

module.exports = router;