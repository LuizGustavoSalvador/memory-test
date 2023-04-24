function getCookie(cookieName) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

const maxOptions = getCookie("maxOptions");

function addoption(id, index){
  document.querySelector("#questionRegisterForm #addOption"+id).addEventListener('click', function(e){
    e.preventDefault();
    
    if(index < maxOptions){
      console.log('entrou')
      let letter = String.fromCharCode('A'.charCodeAt() + index);
      let option = document.createElement('input');
      option.setAttribute('alternative', letter);
      option.setAttribute('type', 'text');
      option.setAttribute('name', 'question'+index);
      option.placeholder = 'Alternativa ' + letter;
      document.querySelector("#optionsquestion"+id+ " .options-list").appendChild(option);

      let answer = document.createElement('option');
      answer.setAttribute('value', letter);
      answer.innerText = letter;
      document.querySelector("#answerlist"+id+ " select").appendChild(answer);
      index++;
    }else{
        index = 1;
        this.disabled = true;
        this.classList.add('disabled-button');
        this.title = 'Você só pode adicionar '+getCookie("maxOptions")+' opções nesta questão';
        console.log(sum);
    }
  });
}

window.onload=function(){
    //document.getElementById("questionRegisterForm").addEventListener("submit", (e) => e.preventDefault());

    var id = 2;
    var idQuestion = 1;
    document.querySelector("#questionRegisterForm #addQuestion").addEventListener('click', function(e){
      e.preventDefault();
      
      if(idQuestion < getCookie('maxQuestions')){
        let question = document.createElement('div');
        question.classList.add('question');
        question.setAttribute('id-question', id);
        question.tabIndex = id;
  
        let optionsHtml = '<div id="optionsquestion'+ id +'" class="options-question"><p>Alternativas:</p><div class="options-list"><input class="form-control" type="text"  alternative="A" id="option" name="option'+ id +'" placeholder="Alternativa A" required></div><button id="addOption'+ id +'" class="btn-default" type="button" question='+ id +' onclick="addoption('+ id +', 1)">Adicionar Opção</button></div>';
        let answerHtml = '<div id="answerlist'+ id +'" class="answer-question"><p>Resposta:</p><select name="question['+ id +'][answer]" required><option value="A">A</option></select></div>';
  
        question.innerHTML = '<label for="question">Pergunta:</label><input class="form-control" type="text" name="question['+ id +'][question]" placeholder="Pergunta '+id+'" required>'+ optionsHtml + answerHtml +'</div>';
        document.querySelector("#questionRegisterForm .questions-list-fields").appendChild(question);
        idQuestion = id;
        id++;
      }else{
        this.disabled = true;
        this.classList.add('disabled-button');
        this.setAttribute('title', 'você só pode adicionar ' +getCookie("maxQuestions")+ ' questões neste teste');
      }

      return true;
    });

    var form = document.querySelector('#questionRegisterForm');
    var data = new FormData(form);

    console.log(data);
    
  
  // $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
  //     e.preventDefault(); $(this).parent('div').remove(); x--;
  // })
};