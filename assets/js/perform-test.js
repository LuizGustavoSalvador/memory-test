import { generatetoast, getCookie } from "./helpers.js";

export class PerformTestPage {
  lastId = 0;
  answersConfig = [];
  stepLimit = 0;

  constructor() {
    this.stepLimit = +getCookie("stepLimit");

    document.querySelector("#performTestForm #sendButton").addEventListener('click', (e) => {
      this.submit();
    });

    window.onload = () => {
      this.answersConfig[this.lastId] = {
        question: 'question-' + this.lastId,
        optionSelected: 'optionQuestion-' + document.getElementById('question-' + this.lastId).value,
      };

      document.querySelector("#performTestForm #prevQuestion").addEventListener('click', (e) => {
        e.preventDefault();

        this.prevQuestion();
      });

      this.updateButtons();

      document.querySelector("#performTestForm #nextQuestion").addEventListener('click', (e) => {
        e.preventDefault();

        this.nextQuestion();
      });
    };
  }

  prevQuestion() {
    let prevId = this.lastId;
    let prevStep = 'step-' + (prevId - 1);
    let nextStep = 'step-' + prevId;

    this.lastId--;
    
    document.getElementById(prevStep).classList.remove('hide');
    document.querySelector("#" + prevStep + " input").setAttribute('disabled', false);

    document.getElementById(nextStep).classList.add('hide');
    document.querySelector("#" + nextStep + " input").setAttribute('disabled', true);

    this.updateButtons();
  }

  nextQuestion() {
    let prevStep = 'step-' + this.lastId;
    let nextStep = 'step-' + (this.lastId + 1);
    this.lastId++;

    this.answersConfig[this.lastId] = {
      question: 'question-' + this.lastId,
      optionSelected: 'optionQuestion-' + document.getElementById('question-' + this.lastId).value,
    };
  
    document.getElementById(prevStep).classList.add('hide');
    document.querySelector("#" + prevStep + " input").setAttribute('disabled', true);

    document.getElementById(nextStep).classList.remove('hide');
    document.querySelector("#" + nextStep + " input").setAttribute('disabled', false);

    this.updateButtons();
  }

  updateButtons() {
    if (this.lastId <= 0) {
      let prev = document.querySelector('#performTestForm #prevQuestion');
      prev.disabled = true;
      prev.classList.add('disabled-button');
      prev.setAttribute('title', 'Você está na primeira questão');
    } else {
      let prev = document.querySelector('#performTestForm #prevQuestion');
      prev.disabled = false;
      prev.classList.remove('disabled-button');
      prev.removeAttribute('title');
    }

    if (this.lastId >= (this.stepLimit - 1)) {
      let next = document.querySelector('#performTestForm #nextQuestion');
      next.disabled = true;
      next.classList.add('disabled-button');
      next.setAttribute('title', 'Você está na última questão');
    } else {
      let next = document.querySelector('#performTestForm #nextQuestion');
      next.disabled = false;
      next.classList.remove('disabled-button');
      next.removeAttribute('title');
    }
  }

  async submit() {

    let data = {
      test_id: document.querySelector("form #testId").value,
      questions: []
    };

    for (const key in this.answersConfig) {
      if (Object.hasOwnProperty.call(this.answersConfig, key)) {
        const row = this.answersConfig[key];
        const options = document.getElementsByName(row.optionSelected);
        let optionValue;
        
        for (const option of options) {
          if(option.checked){
            optionValue = option.value;
          }
        }

        if(optionValue){
          data.questions.push({
            id: document.getElementById(row.question).value,
            optionSelected: optionValue
          });
        }
      }
    }

    try {
      await fetch("/test/attempt", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then(response => response.json()).then((response) => {
        generatetoast(response);

        formTest.reset();

      });

    } catch (error) {
      console.log(error);
    }
  }
}