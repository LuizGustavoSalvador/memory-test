const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get("/:id", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let resultHtml = fs.readFileSync('././assets/html/result/result-details.html', 'utf-8');
  let questionResultTemplate = fs.readFileSync('././assets/templates/question-result.html', 'utf-8');

  let result = JSON.parse(fs.readFileSync('./src/data/results.json', 'utf-8')).filter(r => r.id === req.params.id); 

  if(result.length > 0){
    resultHtml = resultHtml.replace("{{test}}", result[0].test);
    resultHtml = resultHtml.replace("{{answeredQuestions}}", result[0].answered_questions);
    resultHtml = resultHtml.replace("{{totalQuestions}}", result[0].total_questions);
    resultHtml = resultHtml.replace("{{amountHits}}", result[0].amount_hits);
    resultHtml = resultHtml.replace("{{amountErrors}}", result[0].amount_errors);

    let resultQuestions = result.questions.map((q, i) => {
      let questionHtml = questionResultTemplate.replace("{{numQuestion}}", i + 1);
      questionHtml = questionHtml.replace("{{status}}", q.details.status);
      questionHtml = questionHtml.replace("{{question}}", q.details.question);
      questionHtml = questionHtml.replace("{{optionValue}}", q.details.option_selected.value);
      questionHtml = questionHtml.replace("{{optionText}}", q.details.option_selected.text);
      questionHtml = questionHtml.replace("{{answerValue}}", q.details.answer.value);
      questionHtml = questionHtml.replace("{{answerText}}", q.details.answer.text);

      questionHtml = questionHtml.replace("{{options}}", options.join(""));
      return questionHtml;
    });
    
    indexHtml = indexHtml.replace("{{component}}", resultHtml);
  }else{
    indexHtml = indexHtml.replace("{{component}}", fs.readFileSync('././assets/html/404.html'));
  }

  res.end(indexHtml);
});

router.get("/", (req, res) => {
  let indexHtml = fs.readFileSync('././assets/html/index.html', 'utf-8');
  let resultsPage = fs.readFileSync('././assets/html/result/list.html', 'utf-8');
  let resultsTemplate = fs.readFileSync('././assets/templates/result-list.html', 'utf-8');

  let results = JSON.parse(fs.readFileSync('./src/data/result.json', 'utf-8')); 
  
  if(results.length > 0){
    results = results.sort((a, b) => {
      if ((a.amount_hits > b.amount_hits) && a.answered_questions > b.answered_questions) {
        return -1;
      }
    });
    
    let resultHtml = results.map((r) => {
      let result = resultsTemplate.replace("{{test}}", r.test);
      result = result.replace("{{answeredQuestions}}", r.answered_questions);
      result = result.replace("{{totalQuestions}}", r.total_questions);
      result = result.replace("{{amountHits}}", r.amount_hits);
      result = result.replace("{{amountErrors}}", r.amount_errors);
      result = result.replace("{{id}}", r.id);
  
      return result;
    });

    resultsPage = resultsPage.replace("{{list}}", '<div class="list-result">'+resultHtml.join("")+'</div>');
    indexHtml = indexHtml.replace("{{component}}", resultsPage);
  }else{
    indexHtml = indexHtml.replace("{{component}}", fs.readFileSync('././assets/html/result/no-results.html', 'utf-8'));
  }

  res.end(indexHtml);
});

module.exports = router;