const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');
const user_name = document.getElementById('description').dataset.id_user;

// listAll();
listAllTable();

document.getElementById('ftodo').onsubmit = function(e){
  e.preventDefault();
  fetch('/todos/add/' + user_name + '/', {
    method: 'POST',
    body: JSON.stringify({
      'description': document.getElementById('description').value
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
		if(res['status'] == 'true') {
      listAllTable();
      // listAll(); 
      // listComplete();
      // listIncomplete();
			document.getElementById("description").value = ""
			UIkit.notification({
				message: 'Todo created!',
				status: 'success',
				timeout: 3000
			});
		}
  })
  .catch(function(error) {
		UIkit.notification({
			message: 'Todo could not be created!',
			status: 'danger',
			timeout: 3000
		});
  });
}

function listAllTable() {
  fetch('/todos/displayall/'+ user_name + '/')
    .then(response => response.json())
    .then(todos => {
        let tbodyAll = document.getElementById("tasks");
        tbodyAll.innerHTML = "";
        todos.forEach(todo => {
            fillRowTable(tbodyAll,todo);
        })
    })
}

function fillRowTable(tbodyAll,todo){
    let tdCheckbox = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add("uk-checkbox");
    tdCheckbox.appendChild(checkbox);

    let tdTodo = document.createElement('td');
    let inputTodo = document.createElement('input');
    inputTodo.value = todo['description'];
    inputTodo.disabled = true;
    inputTodo.type = "text"; 
    inputTodo.classList.add("uk-form-blank"); 
    tdTodo.appendChild(inputTodo);

    let tdDeadline = document.createElement('td');
    let pDeadline = document.createElement('p');
    pDeadline.innerHTML = todo['deadline'];
    tdDeadline.appendChild(pDeadline);

    let tdStatus = document.createElement('td');
    let pStatus = document.createElement('span');    
    if(todo.is_done == false){
      pStatus.classList.add("uk-label");
      pStatus.classList.add("uk-label-danger");
      pStatus.innerHTML = "Incompleted";
      checkbox.checked = false;
    }
    else{
      pStatus.classList.add("uk-label");
      pStatus.classList.add("uk-label-success");
      pStatus.innerHTML  = "Success";
      checkbox.checked = true;
    }
    tdStatus.appendChild(pStatus);

    let tdCreatedDate = document.createElement('td');
    let pCreatedDate = document.createElement('p');
    pCreatedDate.innerHTML = todo['created_date'];
    tdCreatedDate.appendChild(pCreatedDate);

    let tdOptions = document.createElement('td');
    let editButton = document.createElement('i');
    editButton.setAttribute("class", "far fa-edit");
    editButton.style.margin = '0 5px 0 2px';
    let removeButton = document.createElement('i');
    removeButton.setAttribute("class", "far fa-trash-alt");
    removeButton.style.margin = '0 5px 0 2px';
    tdOptions.appendChild(editButton);
    tdOptions.appendChild(removeButton);

    let trTodo = document.createElement('tr');
    trTodo.dataset.todoid = todo['id'];
    trTodo.classList.add("row_table");
    
    tbodyAll.appendChild(trTodo);
    trTodo.appendChild(tdCheckbox)
    trTodo.appendChild(tdTodo);
    trTodo.appendChild(tdDeadline);
    trTodo.appendChild(tdStatus);
    trTodo.appendChild(tdCreatedDate);
    trTodo.appendChild(tdOptions);

    
    checkbox.addEventListener('click', () => this.updateTodo(trTodo,checkbox,pStatus,todo.is_done));    
    editButton.addEventListener('click', () => this.editTodo(inputTodo,trTodo,todo.is_done));
    removeButton.addEventListener('click', () => this.removeTodo(tbodyAll,trTodo));
}


function removeTodo(tbody,trTodo){
  fetch('/todos/delete/' + user_name + '/',{
    method: 'POST',
    body: JSON.stringify({
      'user_name': user_name,
      'todo_id': trTodo.dataset.todoid
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    tbody.removeChild(trTodo);
  })
}
function editTodo(inputTodo, trTodo){
  inputTodo.disabled = !inputTodo.disabled; 
  inputTodo.addEventListener('keydown', function(event){
    
    if(event.which == 13){

      inputTodo.disabled = !inputTodo.disabled;
      let todo_val = inputTodo.value;
      
      fetch('/todos/update/' + user_name + '/' ,{
        method: 'POST',
        body: JSON.stringify({
          'user_name': user_name,
          'todo_id': trTodo.dataset.todoid,
          'description': todo_val
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then(response => response.json())
    }

  })

}

function updateTodo(trTodo,checkbox,pStatus,is_done){
  if(is_done){
    checkbox.checked = false;
    pStatus.innerHTML = "Incompleted";
    pStatus.classList.remove("uk-label-success");
    pStatus.classList.add("uk-label-danger");
  }
  else{
    checkbox.checked = true;
    pStatus.innerHTML = "Success";
    pStatus.classList.remove("uk-label-danger");
    pStatus.classList.add("uk-label-success");
  }
  fetch('/todos/update/' + user_name + '/',{
    method: 'POST',
    body: JSON.stringify({
      'user_name': user_name,
      'todo_id': trTodo.dataset.todoid
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
}
