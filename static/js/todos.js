const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');

errormsg.style.display = 'none';

listAll();
listIncomplete();
listComplete();

let user_id = ''

document.getElementById('ftodo').onsubmit = function(e){
  e.preventDefault();
	let user_id = document.getElementById('description').dataset.id_user;
	console.log(user_id)
  fetch('/' + user_id + '/add/todo', {
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
		console.log(res)
		if(res['status'] == 'true') {
			console.log("TODO creado!!!")
		}
    // listAll();
    // errormsg.style.display = 'none';
  })
  .catch(function(error) {
    //errormsg.style.display = '';
    console.log("Error: " + error.message)
  });
}

document.getElementById('all').onclick = function(){
  listAll();
}

document.getElementById('incomplete').onsubmit = function(){
  listIncomplete();
}

document.getElementById('complete').onsubmit = function(){
  listComplete();
}

function listAll() {
  todosElement.innerHTML = '';
  fetch('todos/displayall')
  .then(response => response.json())
  .then(todos => {
    console.log(todos);
    todos.forEach(todo => {
      const div = document.createElement('div');
      const name = document.createElement('h3');
      header.textContent = todo.description;

      div.appendChild(name);

      todosElement.appendChild(div);
    })
  })
}

function listIncomplete() {
  todosElement.innerHTML = '';
  fetch('todos/displayincomplete')
  .then(response => response.json())
  .then(todos => {
    console.log(todos);
    todos.forEach(todo => {
      const div = document.createElement('div');
      const name = document.createElement('h3');
      header.textContent = todo.description;
      
      div.appendChild(name);

      todosElement.appendChild(div);
    })
  })
}

function listComplete() {
  todosElement.innerHTML = '';
  fetch('todos/displaycomplete')
  .then(response => response.json())
  .then(todos => {
    console.log(todos);
    todos.forEach(todo => {
      const div = document.createElement('div');
      const name = document.createElement('h3');
      header.textContent = todo.description;

      div.appendChild(name);

      todosElement.appendChild(div);
    })
  })
}
