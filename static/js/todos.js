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
      document.getElementById("description").value = ""
			console.log("TODO creado!!!")
		}
  })
  .catch(function(error) {
    //errormsg.style.display = '';
    console.log("Error: " + error.message)
  });
}

document.getElementById('all').onclick = function(e){
  e.preventDefault();
	let user_name = document.getElementById('description').dataset.id_user;
  fetch('/'+ user_name + '/todos/displayall')
    .then(response => response.json())
    .then(todos => {
        document.getElementById("alltasks").innerHTML = ""
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = todo['description']
            document.getElementById("alltasks").appendChild(li)
        })
    })
}

document.getElementById('incomplete').onclick= function(e){
  e.preventDefault();
	let user_name = document.getElementById('description').dataset.id_user;
  fetch('/'+ user_name + '/todos/displayincompleted')
    .then(response => response.json())
    .then(todos => {
        document.getElementById("incompletedtasks").innerHTML = ""
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = todo['description']
            document.getElementById("incompletedtasks").appendChild(li)
        })
    })
}

document.getElementById('complete').onclick = function(e){
  e.preventDefault();
	let user_name = document.getElementById('description').dataset.id_user;
  fetch('/'+ user_name + '/todos/displaycompleted')
    .then(response => response.json())
    .then(todos => {
        document.getElementById("completedtasks").innerHTML = ""
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.innerHTML = todo['description']
            document.getElementById("completedtasks").appendChild(li)
        })
    })
}

/*function listAll() {
    fetch('<user_name>/todos/displayall')
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
            const check = document.createElement('buttom')
            li.innerHTML = jsonResponse['description']
            document.getElementById("alltasks").appendChild(li)
            document.getElementById("alltasks").appendChild(check)
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
*/