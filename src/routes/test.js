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
    let registeredQuestions = test.questions ? Object.keys(test.questions).length : 0;
    let addQuestion = (registeredQuestions < test.numQuestions) ? '<a class="btn-default" href="/test/' + test.slug + '/question">Cadastrar perguntas</a>' : '';
    let startTest = (registeredQuestions > 0) ? '<a class="btn-default" href="/test/' + test.slug + '/start">Iniciar o Teste</a>' : '';

    let testHtml = testTemplate.replace("{{slug}}", test.slug);
    testHtml = testHtml.replace("{{name}}", test.name);
    testHtml = testHtml.replace("{{registeredQuestions}}", registeredQuestions);
    testHtml = testHtml.replace("{{numQuestions}}", test.numQuestions);
    testHtml = testHtml.replace("{{maxOptions}}", test.maxOptions);
    testHtml = testHtml.replace("{{slug}}", test.slug);
    testHtml = testHtml.replace("{{addQuestion}}", addQuestion);
    testHtml = testHtml.replace("{{startTest}}", startTest);

    return testHtml;
  });

  if (testHtml.length < 1) {
    testHtml = '<h3 class="no-tests">Nenhum teste cadastrado</h3>';
  } else {
    testHtml = '<div class="list-test">' + testHtml.join("") + '</div>';
  }

  testPage = testPage.replace("{{list}}", testHtml);

  if(typeof req.cookies.token !== 'undefined' && req.cookies.token !== '' && req.cookies.token !== null){
    testPage = testPage;
  }else{
    testPage = fs.readFileSync('././assets/html/not-allowed.html', 'utf-8');
  }
  indexHtml = indexHtml.replace("{{component}}", testPage);
  indexHtml = indexHtml.replace("{{jsCustom}}", `
  <script type="module">
    import { TestPage } from "/js/test.js";
    window.TestPage = new TestPage();
  </script>
`);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml);
});

router.post("/create", (req, res) => {
  let tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  let data = req.body;
  data.id = uuid.v1();
  data.slug = slugify(data.name).toLowerCase();
  let errors = {
    type: 'error',
    messages: []
  };
  
  if (tests && Object.keys(tests.filter(t => t.slug === data.slug)).length > 0) {
    errors.messages.push({ text: 'Já existe um teste cadastrado com este nome' });
  }
  
  if (data.numQuestions > 10 || data.numQuestions < 1) {
    errors.messages.push({ text: 'A quantidade de questões deve ser entre 1 e 10' });
  }

  if (data.maxOptions > 5 || data.maxOptions < 2) {
    errors.messages.push({ text: 'A quantidade de opções por questão deve ser entre 2 e 5' });
  }
  
  if (errors.messages.length > 0) {
    res.status(400).send(errors);
  } else {
    tests.push(data);
    
    fs.writeFileSync("./src/data/test.json", JSON.stringify(tests), { encoding: "utf-8" });
    
    let response = {
      type: 'success',
      messages: [
        {
          text: 'Test cadastrado com sucesso'
        }
      ]
    };

      res.status(201).send(response);
  }
});

router.get("/:slug/question", (req, res) => {
  let slug = req.params.slug;
  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).filter(test => test.slug === slug);
  let html = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let question = fs.readFileSync('././assets/html/question/question.html', 'utf-8');

  if (test.length === 1) {
    let questions = test[0].questions ? test[0].questions.length : 0;
    let numQuestions = test[0].numQuestions - questions;
    res.cookie('maxQuestions', numQuestions > 0 ? numQuestions : 0);
    res.cookie('maxOptions', test[0].maxOptions);

    if (numQuestions < 1) {
      question = fs.readFileSync('././assets/html/question/limit-question.html', 'utf-8');
    }
  }

  question = question.replace("{{testName}}", test[0].name);
  question = question.replace("{{testId}}", test[0].id);
  html = html.replace("{{component}}", question);
  html = html.replace("{{jsCustom}}", `
    <script type="module">
      import { QuestionPage } from "/js/question.js";
      window.questionPage = new QuestionPage();
    </script>
  `);


  res.end(html);
});

router.post("/question/create", (req, res) => {
  let data = req.body;
  let tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  let errors = {
    type: 'error',
    messages: []
  };

  if (data.questions && Object.keys(data.questions).length > 0) {
    let newQuestions = data.questions.map((q) => {
      q.id = uuid.v1();

      if (q.question.trim().length === 0) {
        errors.messages.push({ text: 'Existe uma questão vazia informada' });
        return;
      }

      return q;
    });

    tests = tests.map((t) => {
      if (t.id === data.test_id) {
        if (!t.questions) {
          t.questions = [];
        }
        t.questions.push(newQuestions);
      }

      return t;
    });
  } else {
    errors.messages.push({ text: 'É obrigatório inserir pelo menos 1 questão' });
  }

  if (errors.messages.length > 0) {
    res.status(400).send(errors);
  } else {
    fs.writeFileSync("./src/data/test.json", JSON.stringify(tests), { encoding: "utf-8" });

    let response = {
      type: 'success',
      messages: [
        {
          text: 'Perguntas cadastradas com sucesso'
        }
      ]
    }
    res.status(201).send(response);
  }
});

router.get("/:slug/start", (req, res) => {
  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).filter(test => test.slug === req.params.slug);

  let performTestQuestionTemplate = fs.readFileSync('././assets/templates/perform-test-questions.html', 'utf-8');

  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let performTest = fs.readFileSync('././assets/html/test/perform-test.html', 'utf-8');

  if (test[0].questions) {
    let questions = test[0].questions.sort(() => Math.random() - 0.5);

    let performTestQuestionHtml = questions.map((q, i) => {
      let num = i + 1;
      let questionHtml = performTestQuestionTemplate.replace("{{numQuestion}}", num);
      questionHtml = questionHtml.replace("{{id}}", i);
      questionHtml = questionHtml.replace("{{status}}", (i > 0) ? 'hide' : '');
      questionHtml = questionHtml.replace("{{question}}", q.question);
      questionHtml = questionHtml.replace("{{id}}", i);
      questionHtml = questionHtml.replace("{{idQuestion}}", q.id);
      let options = q.options.map((o) => {
        return '<div class="option"><input class="radio" type="radio" name="optionQuestion-' + q.id + '" value="' + o.value + '"/><label for="optionQuestion-' + q.id + '">' + o.text + '</label></div>';
      });

      questionHtml = questionHtml.replace("{{options}}", options.join(""));
      return questionHtml;
    });

    performTest = performTest.replace("{{testName}}", test[0].name);
    performTest = performTest.replace("{{testId}}", test[0].id);
    performTest = performTest.replace("{{questions}}", performTestQuestionHtml.join(""));

    res.cookie("stepLimit", questions.length);
  } else {
    performTest = fs.readFileSync('././assets/html/question/no-question.html', 'utf-8');
    performTest = performTest.replace("{{test}}", test[0].name);
    performTest = performTest.replace("{{slug}}", test[0].slug);
  }

  indexHtml = indexHtml.replace("{{component}}", performTest);
  indexHtml = indexHtml.replace("{{jsCustom}}", `
  <script type="module">
    import { PerformTestPage } from "/js/perform-test.js";
    window.PerformTestPage = new PerformTestPage();
  </script>
`);

  res.end(indexHtml);
});

router.post("/attempt", (req, res) => {
  let data = req.body;
  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).find(t => t.id == data.test_id);
  let result = JSON.parse(fs.readFileSync('./src/data/result.json', 'utf-8'));
  let resultId = uuid.v1();

  data.test_name = test.name;
  let errors = {
    type: 'error',
    messages: []
  };

  if (Object.keys(data.questions).length === 0) {
    errors.messages.push({ text: 'É obrigatório responder pelo menos 1 questão' });
  }

  let hitsQuestion = 0;
  let errorQuestion = 0;
  let attemptResultDetails = [];

  data.questions.map((q) => {
    let question = test.questions.find((t) => t.id === q.id);
    let statusQuestion = 'error';

    if (question.answer === q.optionSelected) {
      statusQuestion = 'correct';
      hitsQuestion++;
    } else {
      errorQuestion++;
    }

    let answerText = question.options.find((a) => a.value === question.answer);
    let optionText = question.options.find((o) => o.value === q.optionSelected);

    attemptResultDetails.push({
      "question": question.question,
      "answer": {
        "text": answerText.text,
        "value": question.answer
      },
      "option_selected": {
        "text": optionText.text,
        "value": q.optionSelected,
      },
      "status": statusQuestion
    });

  });

  if (errors.messages.length > 0) {
    res.status(400).send(errors);
  } else {
    result.push({
      "id": resultId,
      "test": test.name,
      "answered_questions": data.questions.length,
      "total_questions": test.numQuestions,
      "amount_hits": hitsQuestion,
      "amount_errors": errorQuestion,
      "details": attemptResultDetails
    });

    fs.writeFileSync("./src/data/result.json", JSON.stringify(result), { encoding: "utf-8" });

    let response = {
      type: 'success',
      result: resultId,
      messages: [
        {
          text: 'Tentativa realizada com sucesso'
        }
      ]
    };

    res.status(201).send(response);
  }

});

module.exports = router;