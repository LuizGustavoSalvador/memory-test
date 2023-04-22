let sum = 1;
function addoption(id){
  let letter = String.fromCharCode('A'.charCodeAt() + sum);
  let option = document.createElement('input');
  option.setAttribute('alternative', letter);
  option.setAttribute('type', 'text');
  option.setAttribute('name', 'question['+ id +'][options][option]['+ sum +']');
  option.placeholder = 'Alternativa ' + letter;
  document.querySelector("#optionsquestion"+id+ " .options-list").appendChild(option);

  let answer = document.createElement('option');
  answer.setAttribute('value', letter);
  answer.innerText = letter;
  document.querySelector("#answerlist"+id+ " select").appendChild(answer);

  sum++;
  if(sum > 25){
    let button = document.querySelector("#addOption"+id)
    button.disabled = true;
    button.classList.add('disabled-button');
    button.title = 'Você não pode mais adicionar alternativas';
  }
}

window.onload=function(){
    //document.getElementById("questionRegisterForm").addEventListener("submit", (e) => e.preventDefault());

    var id = 2;
    var idQuestion = 1;
    document.querySelector("#questionRegisterForm #addQuestion").addEventListener('click', function(e){
      e.preventDefault();
      
      let question = document.createElement('div');
      question.classList.add('question');
      question.setAttribute('id-question', id);
      question.tabIndex = id;

      let optionsHtml = '<div id="optionsquestion'+ id +'" class="options-question"><p>Alternativas:</p><div class="options-list"><input class="form-control" type="text"  alternative="A" id="option" name="option'+ id +'" placeholder="Alternativa A" required></div><button id="addOption'+ id +'" class="btn-default" type="button" question='+ id +' onclick="addoption('+ id +')">Adicionar Opção</button></div>';
      let answerHtml = '<div id="answerlist'+ id +'" class="answer-question"><p>Resposta:</p><select name="question['+ id +'][answer]" required><option value="A">A</option></select></div>';

      question.innerHTML = '<label for="question">Pergunta:</label><input class="form-control" type="text" name="question['+ id +'][question]" placeholder="Pergunta '+id+'" required>'+ optionsHtml + answerHtml +'</div>';
      document.querySelector("#questionRegisterForm .questions-list-fields").appendChild(question);
      idQuestion = id;
      id++;

      return true;
    });

    var form = document.querySelector('#questionRegisterForm');
    var data = new FormData(form);

    console.log(data);
    
  
  // $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
  //     e.preventDefault(); $(this).parent('div').remove(); x--;
  // })
};