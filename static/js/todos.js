const form = document.getElementById('ftodo');
const errormsg = document.getElementById('error');
const todosElement = document.getElementById('todosli');

errormsg.style.display = 'none';

listAll();
listIncomplete();
listComplete();

document.getElementById('ftodo').onsubmit = function(e){
    e.preventDefault();
    const formData = new FormData(form);
    const description = formData.get('description')
    const todo = {
        description
    };
    console.log(todo);
    fetch('todos/add', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(createdTODO => {
        form.reset();
        listAll();
        errormsg.style.display = 'none';
    })
    .catch(function(error) {
        errormsg.style.display = '';
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