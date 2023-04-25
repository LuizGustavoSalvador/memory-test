async function login() {
  try {
    await fetch("/user/login", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"a": "aaa"}),
    }).then(response => response.json())
    .then((response) => {
      if(response){
        generatetoast('error', response );
      }
      console.log(response);
    }); 
  } catch (error) {
    generatetoast('error', error);
  }
}

function generatetoast(type, messages){
  let toast = document.createElement('div');
  toast.classList.add('toast-message', type);
  
  let msg = '';
  if(type === 'error'){
    messages.forEach(m => {
      msg = msg + '<p>'+m.text+'</p>';
    });
  }else{
    msg = '<p>Sucesso</p>';
  }

  toast.innerHTML = msg;
  document.querySelector('.main-content').appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

document.querySelector("#userLoginForm #loginButton").addEventListener('click', function(e){
  e.preventDefault();

  login();
});