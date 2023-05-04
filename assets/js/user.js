import {generatetoast, getCookie} from "./main.js";

export class UserPage {

  constructor() {
    document.querySelector("#userLoginForm #loginButton").addEventListener('click', function(e){
      e.preventDefault();
  
      this.login();
    });

    document.querySelector("#userRegisterForm #registerButton").addEventListener('click', (e) => {
      this.create();
    });
  }

  async login() {
    let formData = new FormData(document.getElementById("userLoginForm"));
    let data = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      await fetch("/user/login", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data,
      }).then((response) => {
        return response.json();
      }).then((response) => {
        generatetoast(response);

      }); 
    } catch (error) {
      generatetoast(error);
    }
  }

  async create() {
  
      let formData = new FormData(document.getElementById("userRegisterForm"));
      let data = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      await fetch("/user/create", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data,
      }).then((response) => {
        return response.json();
      }).then((response) => {
        generatetoast(response);

      }); 
    } catch (error) {
      console.log(error);
    }
  }
}