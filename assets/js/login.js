import generatetoast from "./main.js";

async function login() {
  try {
    await fetch("/user/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"a": "aaa"}),
    }).then((response) => {
      return response.json();
    }).then((response) => {
      generatetoast(response);

    }); 
  } catch (error) {
    generatetoast(error);
  }
}

document.querySelector("#userLoginForm #loginButton").addEventListener('click', function(e){
  e.preventDefault();

  login();
});