document.getElementById('form_table').onsubmit = function(e) {
  e.preventDefault();  
  fetch('/table/create', {
    method: 'POST',
    body: JSON.stringify({
      'name': document.getElementById('table').value,
      'owner': document.getElementById('table').dataset.id_user,
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
    console.log(jsonResponse);
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