const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');

errormsg.style.display = 'none';

// listAll();
// listIncomplete();
// listComplete();

let user_name = ''

document.getElementById('ftodo').onsubmit = function(e){
  e.preventDefault();
	let user_name = document.getElementById('description').dataset.id_user;
	console.log(user_name)
  fetch('/' + user_name + '/add/todo', {
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

document.getElementById('incomplete').onclick= function(){
    listIncomplete();
}

document.getElementById('complete').onclick = function(){
    listComplete();
}

function listAll() {
    fetch('/todos/displayall')
    .then(response => response.json())
    .then(todos => {
        console.log(todos);
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = jsonResponse['description']
            document.getElementById("alltasks").appendChild(li)
        })
    })
}

function listIncomplete() {
    todosElement.innerHTML = '';
    fetch('/todos/displayincomplete')
    .then(response => response.json())
    .then(todos => {
        console.log(todos);
        todos.forEach(todo => {
            // const div = document.createElement('div');
            // const name = document.createElement('h3');
            // header.textContent = todo.description;
            
            // div.appendChild(name);

            // todosElement.appendChild(div);
            const li = document.createElement('li');
            li.innerHTML = jsonResponse['description']
            document.getElementById("alltasks").appendChild(li)
        })
    })
}

function listComplete() {
    todosElement.innerHTML = '';
    fetch('/todos/displaycomplete')
    .then(response => response.json())
    .then(todos => {
        console.log(todos);
        todos.forEach(todo => {
            // const div = document.createElement('div');
            // const name = document.createElement('h3');
            // header.textContent = todo.description;

            // div.appendChild(name);

            // todosElement.appendChild(div);
            const li = document.createElement('li');
            li.innerHTML = jsonResponse['description']
            document.getElementById("alltasks").appendChild(li)
        })
    })
}
