const url = 'http://localhost:3000/test/question';
let lastId = 0;
let questionConfig = [];
const maxOptions = getCookie("maxOptions");
const maxQuestions = getCookie("maxQuestions");

function getCookie(cookieName) {
  let cookie = {};

  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })

  return cookie[cookieName];
}

async function submit() {
  let result = {
    test_id: document.querySelector("form #testId").value,
    questions: []
  };

  for (const key in questionConfig) {
    if (Object.hasOwnProperty.call(questionConfig, key)) {
      const row = questionConfig[key];
      result.questions.push({
        question: document.getElementById(row.question).value,
        answer: document.getElementById(row.answer).value,
        options: row.options.map((o, i) => ({ 
          text: document.getElementById(o.input).value,
          value: o.value,
        })),
      });
    }
  }

  try {
    await fetch("/test/question/store", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result),
    }).then(response => response.json())
    .then((response) => {
      document.querySelector('form').reset();
      let success = document.createElement('div');
      success.classList.add('toast-message', 'success');
      success.innerHTML = '<p>Perguntas cadastradas com sucesso</p>';
      document.querySelector('.main-content').appendChild(success);
  
      setTimeout(() => {
        success.remove();
      }, 3000);
    });
    
  } catch (error) {
    console.log(error);
  }

};

function createQuestion() {
  lastId++;

  if (lastId > maxQuestions) {
    let button = document.getElementById('addQuestion');
    button.disabled = true;
    button.classList.add('disabled-button');
    button.setAttribute('title', 'você só pode adicionar ' +maxQuestions+ ' questões neste teste');

    return;
  }

  questionConfig[lastId] = {
    question: 'question-' + lastId,
    answer: 'answerlist-' + lastId,
    options: [{ input: 'optionsquestion-' + 1 + '-' + lastId, value: String.fromCharCode('A'.charCodeAt()) }],
  };

  let question = document.createElement('div');
  question.classList.add('question');
  question.setAttribute('id-question', lastId);
  question.tabIndex = lastId;

  let optionsHtml = '<div id="optionsquestion'+ lastId +'" class="options-question"><p>Alternativas:</p><div class="options-list"><input class="form-control" type="text"  alternative="A" id="'+questionConfig[lastId].options[0].input + '" name="option'+ lastId +'" placeholder="Alternativa A" required></div><button id="addOption'+ lastId +'" class="btn-default" type="button" onclick="createOption('+ lastId +')">Adicionar Opção</button></div>';
  let answerHtml = '<div class="answer"><p>Resposta:</p><select id="answerlist-'+ lastId +'" "name="answerlist'+ lastId +'" required><option value="A">A</option></select></div>';

  question.innerHTML = '<label for="question">Pergunta:</label><input id="' + questionConfig[lastId].question + '" class="form-control" type="text" name="question['+ lastId +'][question]" placeholder="Pergunta '+lastId+'" required>'+ optionsHtml + answerHtml +'</div>';
  document.querySelector("#questionRegisterForm .questions-list-fields").appendChild(question);
}

function createOption(id) {
  document.querySelector("#questionRegisterForm #addOption"+id).addEventListener('click', function(e){
    e.preventDefault();
    const question = questionConfig[id];
    const size = question.options.length;

    if (size >= maxOptions) {
      return;
    }

    const newOption = { input: 'optionsquestion-' + (question.options.length + 1) + '-' + id, value: String.fromCharCode('A'.charCodeAt() + question.options.length) };
    question.options.push(newOption);

    let option = document.createElement('input');
    option.setAttribute('id', newOption.input);
    option.setAttribute('alternative', newOption.value);
    option.setAttribute('type', 'text');
    option.setAttribute('name', newOption.input);
    option.placeholder = 'Alternativa ' + newOption.value;
    document.querySelector("#questionRegisterForm .options-list").appendChild(option);

    let answer = document.createElement('option');
    answer.setAttribute('value', newOption.value);
    answer.innerText = newOption.value;
    document.querySelector("#answerlist-"+lastId).appendChild(answer);

    if (question.options.length >= maxOptions) {
      this.disabled = true;
      this.classList.add('disabled-button');
      this.title = 'Você só pode adicionar '+getCookie("maxOptions")+' opções nesta questão';
    }
  });
}

document.querySelector("#questionRegisterForm #sendButton").addEventListener('click', function(e){
    e.preventDefault();

    submit();
});

window.onload = function(){
    document.querySelector("#questionRegisterForm #addQuestion").addEventListener('click', function(e){
      e.preventDefault();
      
      createQuestion();
    });

    createQuestion();

  // $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
  //     e.preventDefault(); $(this).parent('div').remove(); x--;
  // })
};