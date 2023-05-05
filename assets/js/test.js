import { generatetoast } from "./helpers.js";

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
      await fetch("/test/create", {
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
          }, 1000);
        } else {
          formTest.reset();
        }
      });

    } catch (error) {
      console.log(error);
    }
  }
}