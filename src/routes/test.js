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
  question = question.replace("{{testId}}", test[0].id);
  html = html.replace("{{component}}", question);
  html = html.replace("{{jsCustom}}", '<script src="/js/question.js"></script>')
  
  if(test.length === 1){
    res.cookie('maxQuestions', test[0].numQuestions);
    res.cookie('maxOptions', test[0].maxOptions);
  }

  res.end(html);
});

router.post("/question/store", async (req, res) => {
  let testId = req.body.test_id;
  let testFile = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  // const {name, email, password} = req.body;
  // const id = uuid.v1();
  // const question = {id, name, email, password}; 
  // users.push(user);
  let testData = testFile.map((t) => {
      if(testId === t.id){
        if(t.questions === null || t.questions === "undefined"){
          t.questions = [];
        }else{
          t.questions.push(req.body.questions);
        }
      }
      
      return test;
    });
  
    fs.writeFileSync("./src/data/test.json", JSON.stringify(testData), {encoding: "utf-8"});
  res.status(201).send('oiiii');
  // let test = tests.map((t) => {
  //   if(testId === t.id){
  //     if(t.questions === null || t.questions === "undefined"){
  //       t.questions = [];
  //     }else{
  //     }
  //   }
    
  //   return test;
  // });

  // fs.writeFileSync("./src/data/test.json", JSON.stringify(test), {encoding: "utf-8"});

  //dataFile.push(req.body);
  //fs.writeFileSync(jsonPath, JSON.stringify(dataFile));
  res.redirect('/test/' +slug+'/question');
})

module.exports = router;