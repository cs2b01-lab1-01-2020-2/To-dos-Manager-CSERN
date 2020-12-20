let table_name = document.getElementById('table').value
let owner_name = document.getElementById('table').dataset.id_user
let table_remove = document.getElementsByClassName('table_remove')
let localhost = 'http://127.0.0.1:5001/'

document.getElementById('form_table').onsubmit = function(e) {
  e.preventDefault();  
  fetch('/table/create', {
    method: 'POST',
    body: JSON.stringify({
      'name': document.getElementById('table').value,
      'owner': owner_name,
      'admin': true
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function(response){
    return response.json();
  })
  .then(function(jsonResponse) {
    window.location.reload();
  })
  .catch(function(error){
    UIkit.notification({
			message: 'Table was not created',
			status: 'danger',
			timeout: 3000
		});
  });
}

for (let i = 0; i < table_remove.length; i++) {
  table_remove[i].addEventListener('click',  function tableRemove() {
    console.log("asd asdasdy owner", owner_name)
    console.log("asd asdasdy tablero", table_remove[i].dataset.id_tablename)
    fetch('/' + user_name + '/' + tablero_name + '/tablero/delete/',{
      method: 'POST',
      body: JSON.stringify({
        'owner_name': owner_name,
        'tablero_name': tablero_name
      }),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(res => {
      UIkit.notification({
        message: 'Table deleted!',
        status: 'success',
        timeout: 3000
      });
      window.location.assign(localhost + owner_name + "/default/todos/");
    })
  });
}