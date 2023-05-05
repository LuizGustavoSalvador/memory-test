const express = require('express');
const fs = require('fs');
const uuid = require("uuid");
const slugify = require("slugify");

const router = express.Router();

router.get("/", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let testPage = fs.readFileSync('././assets/html/test/test.html', 'utf-8');

  let testTemplate = fs.readFileSync('././assets/templates/test-list.html', 'utf-8');

  let tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));

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

  if (req.cookies.token) {
    testPage = testPage;
  } else {
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

  const { name, numQuestions, maxOptions } = req.body;
  const id = uuid.v1();
  const questions = [];
  const slug = slugify(req.body.name).toLowerCase();
  let data = { id, slug, name, numQuestions, maxOptions, questions };

  let errors = {
    type: 'error',
    messages: []
  };

  if (tests && tests.find(t => t.slug === data.slug)) {
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
          text: 'Teste cadastrado com sucesso'
        }
      ]
    };

    res.status(201).send(response);
  }
});

router.get("/:slug/question", (req, res) => {
  const slug = req.params.slug;

  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let question = fs.readFileSync('././assets/html/question/question.html', 'utf-8');

  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).find(test => test.slug === slug);

  if (test) {
    let questions = test.questions ? test.questions.length : 0;
    let numQuestions = test.numQuestions - questions;
    res.cookie('maxQuestions', numQuestions > 0 ? numQuestions : 0);
    res.cookie('maxOptions', test.maxOptions);

    if (numQuestions < 1) {
      question = fs.readFileSync('././assets/html/question/limit-question.html', 'utf-8');
    }
  }

  question = question.replace("{{testName}}", test.name);
  question = question.replace("{{testId}}", test.id);

  indexHtml = indexHtml.replace("{{component}}", question);
  indexHtml = indexHtml.replace("{{jsCustom}}", `
    <script type="module">
      import { QuestionPage } from "/js/question.js";
      window.questionPage = new QuestionPage();
    </script>
  `);


  res.end(indexHtml);
});

router.post("/question/create", (req, res) => {
  const { test_id, questions } = req.body;
  let data = { test_id, questions };

  let tests = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8'));
  let errors = {
    type: 'error',
    messages: []
  };

  if (data.questions) {
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
        for(i = 0; i < newQuestions.length; i++){
          t.questions.push(newQuestions[i]);
        }
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
  const slug = req.params.slug;

  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).find(test => test.slug === slug);

  let performTestQuestionTemplate = fs.readFileSync('././assets/templates/perform-test-questions.html', 'utf-8');

  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let performTest = fs.readFileSync('././assets/html/test/perform-test.html', 'utf-8');

  if (test.questions) {
    let questions = test.questions.sort(() => Math.random() - 0.5);

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

    performTest = performTest.replace("{{testName}}", test.name);
    performTest = performTest.replace("{{testId}}", test.id);
    performTest = performTest.replace("{{questions}}", performTestQuestionHtml.join(""));

    res.cookie("stepLimit", questions.length);
  } else {
    performTest = fs.readFileSync('././assets/html/question/no-question.html', 'utf-8');
    performTest = performTest.replace("{{test}}", test.name);
    performTest = performTest.replace("{{slug}}", test.slug);
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
  const resultId = uuid.v1();
  const { test_id, questions } = req.body;
  let data = { test_id, questions };

  let test = JSON.parse(fs.readFileSync('./src/data/test.json', 'utf-8')).find(t => t.id == data.test_id);
  let result = JSON.parse(fs.readFileSync('./src/data/result.json', 'utf-8'));

  const test_name = test.name;

  let errors = {
    type: 'error',
    messages: []
  };

  if (!data.questions.length) {
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