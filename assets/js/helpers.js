export function generatetoast(params){
    let toast = document.createElement('div');
    toast.classList.add('toast-message', params.type);

    let msg = '';

    params.messages.forEach(m => {
    msg = msg + '<p>'+m.text+'</p>';
    });

    toast.innerHTML = msg;
    document.querySelector('.main-content').appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

export function getCookie(cookieName) {
    let cookie = {};

    document.cookie.split(';').forEach((el) => {
      let [key, value] = el.split('=');
      cookie[key.trim()] = value;
    })

    return cookie[cookieName];
  }