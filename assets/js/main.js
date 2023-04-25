export default function generatetoast(params){
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