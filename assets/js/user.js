import { generatetoast, getCookie, addLogin, addLogout } from "./helpers.js";

export class User {

  constructor() {
    let loginButton = document.querySelector("#userLoginForm #loginButton");
    let createUserButton = document.querySelector("#userRegisterForm #createUserButton");

    this.token = getCookie("token");

    window.addEventListener('load', () => {
      if (this.token) {
        addLogout();

        document.querySelector("#logoutButton").addEventListener('click', (e) => {
          e.preventDefault();

          this.logout();
        });

        document.querySelector(".menu-principal .login-item")?.remove();
        document.querySelector(".menu-principal .user-link")?.classList.add("hide");
      } else {
        addLogin();

        document.querySelector("#loginButton").addEventListener('click', (e) => {
          e.preventDefault();

          window.location.replace("/").reload();
        });

        document.querySelector(".menu-principal .user-link")?.classList.remove("hide");
        document.querySelector(".menu-principal .logout-item")?.remove();
      }
    });

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
          }, 300);
        } else {
          formTest.reset();
        }

      });
    } catch (error) {
      generatetoast(error);
    }
  }

  async logout() {
    try {
      await fetch("/user/logout", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => response.json()).then((response) => {
        document.querySelector("ul .logout-item").remove();

        setTimeout(() => {
          window.location.replace("/").reload();
        }, 300);
      });

    } catch (error) {
      console.log(error);
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
      }).then(response => response.json()).then((response) => {
        generatetoast(response);

        setTimeout(() => {
          window.location.reload();
        }, 300);
      });
    } catch (error) {
      console.log(error);
    }
  }
}