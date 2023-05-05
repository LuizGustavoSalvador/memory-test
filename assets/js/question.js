import { generatetoast, getCookie } from "./helpers.js";

export class QuestionPage {
  maxOptions = 0;
  maxQuestions = 0;
  lastId = 0;
  questionConfig = [];

  constructor() {
    this.maxOptions = +getCookie("maxOptions");
    this.maxQuestions = +getCookie("maxQuestions");

    document.querySelector("#questionRegisterForm #sendButton").addEventListener('click', (e) => {
      e.preventDefault();
      this.submit();
    });

    window.onload = () => {
      this.createQuestion();

      document.querySelector("#questionRegisterForm #addQuestion").addEventListener('click', (e) => {
        e.preventDefault();
        this.createQuestion();
      });

    };
  }

  createQuestion() {
    this.lastId++;

    if (this.lastId > this.maxQuestions) {
      let button = document.getElementById('addQuestion');
      button.disabled = true;
      button.classList.add('disabled-button');
      button.setAttribute('title', 'você só pode adicionar ' + this.maxQuestions + ' questões neste teste');

      return;
    }

    this.questionConfig[this.lastId] = {
      id: this.lastId,
      question: 'question-' + this.lastId,
      answer: 'answerlist-' + this.lastId,
      options: [{ input: 'optionsquestion-' + 1 + '-' + this.lastId, value: String.fromCharCode('A'.charCodeAt()) }],
    };

    let question = document.createElement('div');
    question.classList.add('question');
    question.tabIndex = this.lastId;

    let optionsHtml = '<div id="optionsquestion' + this.lastId + '" class="options-question"><p>Alternativas:</p><div class="options-list"><input class="form-control" type="text"  alternative="A" id="' + this.questionConfig[this.lastId].options[0].input + '" name="option' + this.lastId + '" placeholder="Alternativa A" required></div><button id="addOption' + this.lastId + '" class="btn-default" type="button" onclick="questionPage.createOption(' + this.lastId + ')">Adicionar opção</button></div>';
    let answerHtml = '<div class="answer"><p>Resposta:</p><select id="answerlist-' + this.lastId + '" "name="answerlist' + this.lastId + '" required><option value="A">A</option></select></div>';

    question.innerHTML = '<label for="question">Pergunta:</label><input id="' + this.questionConfig[this.lastId].question + '" class="form-control" type="text" name="question[' + this.lastId + '][question]" placeholder="Pergunta ' + this.lastId + '" required>' + optionsHtml + answerHtml + '</div>';
    document.querySelector("#questionRegisterForm .questions-list-fields").appendChild(question);
  }

  createOption(id) {
    const question = this.questionConfig[id];
    const size = question.options.length;

    if (size >= this.maxOptions) {
      return;
    }

    const newOption = { input: 'optionsquestion-' + (question.options.length + 1) + '-' + id, value: String.fromCharCode('A'.charCodeAt() + question.options.length) };
    question.options.push(newOption);

    let option = document.createElement('input');
    option.setAttribute('id', newOption.input);
    option.setAttribute('alternative', newOption.value);
    option.setAttribute('type', 'text');
    option.setAttribute('name', newOption.input);
    option.placeholder = 'Alternativa ' + newOption.value;

    document.querySelector("#optionsquestion" + this.lastId + " .options-list").appendChild(option);

    let answer = document.createElement('option');
    answer.setAttribute('value', newOption.value);
    answer.innerText = newOption.value;
    document.querySelector("#answerlist-" + this.lastId).appendChild(answer);

    if (question.options.length >= this.maxOptions) {
      let button = document.querySelector("form #addOption" + this.lastId);
      button.setAttribute('disabled', true);
      button.classList.add('disabled-button');
      button.setAttribute('title', 'Você só pode adicionar ' + getCookie("maxOptions") + ' opções nesta questão');
    }
  }

  async submit() {
    let data = {
      test_id: document.querySelector("form #testId").value,
      questions: []
    };

    for (const key in this.questionConfig) {
      if (Object.hasOwnProperty.call(this.questionConfig, key)) {
        const row = this.questionConfig[key];
        data.questions.push({
          id: row.id + 1,
          question: document.getElementById(row.question).value,
          answer: document.getElementById(row.answer).value,
          options: row.options.map((o, i) => ({
            text: document.getElementById(o.input).value,
            value: o.value,
          })),
        });
      }
    }

    try {
      await fetch("/test/question/create", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then(response => response.json()).then((response) => {
        generatetoast(response);

        if (response.type === 'success') {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      });

    } catch (error) {
      console.log(error);
    }
  }
}