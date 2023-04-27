// import {generatetoast} from "./main.js";

export class TestPage {
  constructor() {
    document.querySelector("#testRegisterForm #sendButton").addEventListener('click', (e) => {
      this.submit();
    });
  }

  async submit() {

    const formTest = document.querySelector("#testRegisterForm");
    const data = {
      name: formTest.querySelector('#name').value,
      numQuestions: formTest.querySelector('#numQuestions').value,
      maxOptions: formTest.querySelector('#maxOptions').value,
    };

    try {
      await fetch("/test/store", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      }).then(response => response.json()).then((response) => {
        generatetoast(response);
        
        formTest.reset();

        if(response.type === 'success'){
          window.location.replace("/test");
        }
      });

    } catch (error) {
      console.log(error);
    }
  }
}