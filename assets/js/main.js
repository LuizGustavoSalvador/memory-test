import { getCookie } from "./helpers.js";

export class Main {
  constructor() {
    this.token = getCookie("token");

    window.onload = () => {
      if (this.token !== '' && this.token !== null) {
        this.addLogout();

        document.querySelector("#logoutButton").addEventListener('click', (e) => {
          e.preventDefault();

          this.logout();
        });
      }else{
        document.querySelector("ul .logout-item").remove();
      }
    };
  }

  addLogout() {
    let menu = document.querySelector(".menu-principal");
    let logout = document.createElement("li");
    logout.classList.add("menu-item", "logout-item");
    logout.innerHTML = '<button class="link-menu" id="logoutButton" type="button">Logout</button>';

    menu.appendChild(logout);
  }

  async logout() {
    try {
      await   fetch("/user/logout", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => response.json()).then((response) => {
        document.querySelector("ul .logout-item").remove();

        setTimeout(() => {
          window.location.replace("/").reload();
        }, 1000);
      });

    } catch (error) {
      console.log(error);
    }
  }
}