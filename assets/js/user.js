import { generatetoast, getCookie } from "./main.js";

export class UserPage {

  constructor() {
    let loginButton = document.querySelector("#userLoginForm #loginButton");
    let createUserButton = document.querySelector("#userRegisterForm #createUserButton");

    if (loginButton) {
      document.querySelector("#userLoginForm #loginButton").addEventListener('click', (e) => {
        e.preventDefault();

        this.login();
      });
    }

    if (createUserButton) {
      document.querySelector("#userRegisterForm #createUserButton").addEventListener('click', (e) => {
        this.create();
      });
    }
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

        if (response.type === 'success') {
          setTimeout(() => {
            window.location.replace("/test");
          }, 2000);
        } else {
          formTest.reset();
        }

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