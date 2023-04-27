import {generatetoast, getCookie} from "./main.js";

export class PerformTestPage {
  lastId = 0;
  answersConfig = [];
  stepLimit = 0; 

  constructor() {
    this.stepLimit = getCookie("stepLimit");

    document.querySelector("#performTestForm #sendButton").addEventListener('click', (e) => {
      this.submit();
    });

    window.onload = () => {
      document.querySelector("#performTestForm #prevQuestion").addEventListener('click', (e) => {
        e.preventDefault();
        this.prevQuestion();
      });

      this.prevQuestion();

      document.querySelector("#performTestForm #nextQuestion").addEventListener('click', (e) => {
        e.preventDefault();
        this.nextQuestion();
      });
    };
  }

  prevQuestion(){
    let prevId = this.lastId;

    this.lastId = prevId === 0 ? prevId : this.lastId--;
    console.log('prev: ' + this.lastId);
 
    if (this.lastId === 0) {
      let prev = document.querySelector('#performTestForm #prevQuestion');
      prev.setAttribute('disable', true);
      prev.classList.add('disabled-button');
      prev.setAttribute('title', 'você está na primeira questão');

      return;
    }

    if (this.lastId < +this.stepLimit) {
      let next = document.querySelector('#performTestForm #nextQuestion');
      next.setAttribute('disable', false);
      next.classList.remove('disabled-button');
      next.removeAttribute('title');
    }
    
    this.answersConfig[this.lastId] = {
      prevStep: 'step-' + prevId,
      nextStep: 'step-' + this.lastId,
      question: 'question-' + this.lastId,
      optionSelected: 'optionQustion-' + this.lastId,
    };

    let currentStep = this.answersConfig[this.lastId].prevStep;
    console.log(currentStep);
    document.getElementById(currentStep).classList.remove('hide');
    document.querySelector("#" + currentStep + " input").setAttribute('disable', false);

    let nextStep = this.answersConfig[this.lastId].nextStep;
    document.getElementById(nextStep).classList.add('hide');
    document.querySelector("#" + nextStep + " input").setAttribute('disable', true);
  }

  nextQuestion(){
    let currentId = this.lastId;

    this.lastI = this.stepLimit === currentId ? currentId : this.lastId++;

    console.log('next: ' + this.lastId);

    if (this.lastId === +this.stepLimit) {
      let prev = document.querySelector('#performTestForm #nextQuestion');
      prev.setAttribute('disable', true);
      prev.classList.add('disabled-button');
      prev.setAttribute('title', 'você está na última questão');

      return;
    }

    if (this.lastId > 0) {
      let next = document.querySelector('#performTestForm #prevQuestion');
      next.setAttribute('disable', false);
      next.classList.remove('disabled-button');
      next.removeAttribute('title');
    }
   
    this.answersConfig[this.lastId] = {
      prevStep: 'step-' + currentId,
      nextStep: 'step-' + this.lastId,
      question: 'question-' + this.lastId,
      optionSelected: 'optionQustion-' + this.lastId,
    };

    let currentStep = this.answersConfig[this.lastId].prevStep;
    document.getElementById(currentStep).classList.add('hide');
    document.querySelector("#" + currentStep + " input").setAttribute('disable', true);

    let nextStep = this.answersConfig[this.lastId].nextStep;
    document.getElementById(nextStep).classList.remove('hide');
    document.querySelector("#" + nextStep + " input").setAttribute('disable', false);
  }

  async submit() {

   // const formTest = document.querySelector("#testRegisterForm");
    // const data = {
    //   name: formTest.querySelector('#name').value,
    //   numQuestions: formTest.querySelector('#numQuestions').value,
    //   maxOptions: formTest.querySelector('#maxOptions').value,
    // };

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