const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');
const user_name = document.getElementById('description').dataset.id_user;
let href = window.location.href
let arr = href.split('/')
let tablero_name = arr[4]
console.log(tablero_name)

listAllTable();

document.getElementById('ftodo').onsubmit = function(e){
  e.preventDefault();
  fetch('/' + user_name + '/' + tablero_name + '/todos/add/', {
    method: 'POST',
    body: JSON.stringify({
      'description': document.getElementById('description').value,
      'deadline': document.getElementById('deadline').value
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(res => {
    console.log(res)
		if(res['status'] == 'true') {
      listAllTable();
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
  fetch('/' + user_name + '/' + tablero_name + '/todos/displayall/')
    .then(response => response.json())
    .then(todos => {
      console.log(todos);
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
    var dead = new Date(todo['deadline']);
    dead.setDate(dead.getDate()+1);
    pDeadline.innerHTML = dead.toDateString();
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
    var d = new Date(todo['created_date']);
    pCreatedDate.innerHTML = d.toDateString();
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

    checkbox.onclick =function() {updateTodo(todo,trTodo,checkbox,pStatus,todo.is_done)};    
    editButton.addEventListener('click', () => this.editTodo(inputTodo,trTodo,todo.is_done));
    removeButton.addEventListener('click', () => this.removeTodo(tbodyAll,trTodo));
}

function removeTodo(tbody,trTodo){
  fetch('/' + user_name + '/' + tablero_name + '/todos/delete/',{
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
      console.log("edit todo")
      fetch('/' + user_name + '/' + tablero_name + '/todos/update/' ,{
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

function updateTodo(todo,trTodo,checkbox,pStatus,is_done){
  if(is_done){
    todo.is_done = false;
    checkbox.checked = false;
    pStatus.innerHTML = "Incompleted";
    pStatus.classList.remove("uk-label-success");
    pStatus.classList.add("uk-label-danger");
  }
  else{
    todo.is_done = true;
    checkbox.checked = true;
    pStatus.innerHTML = "Success";
    pStatus.classList.remove("uk-label-danger");
    pStatus.classList.add("uk-label-success");
  }
  fetch('/' + user_name + '/' + tablero_name + '/todos/update_is_done/',{
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


var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} 
if(mm<10){
  mm='0'+mm
}
today = yyyy+'-'+mm+'-'+dd;
document.getElementById("deadline").setAttribute("min", today);