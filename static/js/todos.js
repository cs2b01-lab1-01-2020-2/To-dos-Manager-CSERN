const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');
const user_name = document.getElementById('description').dataset.id_user;

listAll();

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
      listAll(); 
      listComplete();
      listIncomplete();
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

document.getElementById('all').onclick = function(e){
  e.preventDefault();
  listAll();
}

document.getElementById('incomplete').onclick= function(e){
  e.preventDefault();
	listIncomplete();
}

document.getElementById('complete').onclick = function(e){
  e.preventDefault();
	listComplete();
}

function listAll() {
  fetch('/todos/displayall/'+ user_name + '/')
    .then(response => response.json())
    .then(todos => {
        let divAll = document.getElementById("alltasks");
        divAll.innerHTML = ""
        todos.forEach(todo => {
            fillTodoall(divAll,todo);
        })
    })
}

function listIncomplete() {
  fetch('/todos/displayincompleted' + '/'+ user_name + '/')
    .then(response => response.json())
    .then(todos => {
        let divIncompleted = document.getElementById("incompletedtasks");
        divIncompleted.innerHTML = ""
        todos.forEach(todo => {
            fillTodolist(divIncompleted,todo);
        })
    })
}

function listComplete() {
  let user_name = document.getElementById('description').dataset.id_user;
  fetch('/todos/displaycompleted' + '/' + user_name + '/')
    .then(response => response.json())
    .then(todos => {
        let divCompleted = document.getElementById("completedtasks");
        divCompleted.innerHTML = ""
        todos.forEach(todo => {
            fillTodolist(divCompleted,todo);
        })
    })
}

function fillTodolist(divTask, todo){
  if(todo.is_done == false){
    let inputTodo = document.createElement('input');
    inputTodo.value = todo['description'];
    inputTodo.disabled = true;
    inputTodo.type = "text"; 
    inputTodo.classList.add("uk-form-blank");
    

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add("uk-checkbox");
    
    let liTodo = document.createElement('li');
    liTodo.dataset.todoid = todo['id'];

    let editButton = document.createElement('i');
    editButton.setAttribute("class", "far fa-edit");
		editButton.style.margin = '0 5px 0 2px';

    let removeButton = document.createElement('i');
    removeButton.setAttribute("class", "far fa-trash-alt");
		removeButton.style.margin = '0 5px 0 2px';

    divTask.appendChild(liTodo);
    liTodo.appendChild(checkbox);
    liTodo.appendChild(inputTodo);
    liTodo.appendChild(editButton);
    liTodo.appendChild(removeButton);

    checkbox.addEventListener('click', () => this.updateTodo_activated(liTodo,divTask))
    editButton.addEventListener('click', () => this.editTodo(inputTodo,liTodo));
    removeButton.addEventListener('click', () => this.removeTodo(divTask,liTodo));
  }
  else if(todo.is_done == true){
    let inputTodo = document.createElement('input');
    inputTodo.value = todo['description'];
    inputTodo.disabled = true;
    inputTodo.type = "text"; 
    inputTodo.classList.add("uk-form-blank");
    inputTodo.style.textDecoration = "line-through";
    let liTodo = document.createElement('li');
    liTodo.dataset.todoid = todo['id'];

    let removeButton = document.createElement('i');
    removeButton.setAttribute("class", "far fa-trash-alt");
    removeButton.style.margin = '0 5px 0 2px';

    divTask.appendChild(liTodo);
    liTodo.appendChild(inputTodo);
    liTodo.appendChild(removeButton);
    
    removeButton.addEventListener('click', () => this.removeTodo(divTask,liTodo));
  }
}

function fillTodoall(divTask,todo){
  if(todo.is_done == false){
    let inputTodo = document.createElement('input');
    inputTodo.value = todo['description'];
    inputTodo.disabled = true;
    inputTodo.type = "text"; 
    inputTodo.classList.add("uk-form-blank");
    

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add("uk-checkbox");
    
    let liTodo = document.createElement('li');
    liTodo.dataset.todoid = todo['id'];

    let editButton = document.createElement('i');
    editButton.setAttribute("class", "far fa-edit");
    editButton.style.margin = '0 5px 0 2px';

    let removeButton = document.createElement('i');
    removeButton.setAttribute("class", "far fa-trash-alt");
    removeButton.style.margin = '0 5px 0 2px';


    divTask.appendChild(liTodo);
    liTodo.appendChild(checkbox);
    liTodo.appendChild(inputTodo);
    liTodo.appendChild(editButton);
    liTodo.appendChild(removeButton);

    checkbox.addEventListener('click', () => this.updateTodo_all(liTodo,editButton,checkbox,inputTodo));
    editButton.addEventListener('click', () => this.editTodo(inputTodo,liTodo));
    removeButton.addEventListener('click', () => this.removeTodo(divTask,liTodo));
  }
  else if(todo.is_done == true){
    let inputTodo = document.createElement('input');
    inputTodo.value = todo['description'];
    inputTodo.disabled = true;
    inputTodo.type = "text"; 
    inputTodo.classList.add("uk-form-blank");
    inputTodo.style.textDecoration = "line-through";
    let liTodo = document.createElement('li');
    liTodo.dataset.todoid = todo['id'];

    let removeButton = document.createElement('i');
    removeButton.setAttribute("class", "far fa-trash-alt");
    removeButton.style.margin = '0 5px 0 2px';

    divTask.appendChild(liTodo);
    liTodo.appendChild(inputTodo);
    liTodo.appendChild(removeButton);
    
    removeButton.addEventListener('click', () => this.removeTodo(divTask,liTodo));
  }
}

function removeTodo(divAlltasks,liTodo){
  fetch('/todos/delete/' + user_name + '/',{
    method: 'POST',
    body: JSON.stringify({
      'user_name': user_name,
      'todo_id': liTodo.dataset.todoid
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    divAlltasks.removeChild(liTodo);
  })
}
function editTodo(inputTodo, liTodo){
  inputTodo.disabled = !inputTodo.disabled; 
  inputTodo.addEventListener('keydown', function(event){
    if(event.which == 13){
      inputTodo.disabled = !inputTodo.disabled;
      let todo_val = inputTodo.value;
      fetch('/todos/update/' + user_name + '/' ,{
        method: 'POST',
        body: JSON.stringify({
          'user_name': user_name,
          'todo_id': liTodo.dataset.todoid,
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

function updateTodo_activated(liTodo,divTask){
    divTask.removeChild(liTodo);
    fetch('/todos/update_is_done/' + user_name + '/' ,{
      method: 'POST',
      body: JSON.stringify({
        'user_name': user_name,
        'todo_id': liTodo.dataset.todoid
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => response.json())
}

function updateTodo_all(liTodo,editButton,checkbox,inputTodo){
  liTodo.removeChild(checkbox);
  liTodo.removeChild(editButton);
  inputTodo.classList.remove("uk-text-danger");
  inputTodo.style.textDecoration = "line-through";
  fetch('/todos/update_is_done/' + user_name + '/',{
    method: 'POST',
    body: JSON.stringify({
      'user_name': user_name,
      'todo_id': liTodo.dataset.todoid
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
}
