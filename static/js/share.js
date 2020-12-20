document.getElementById('form_share').onsubmit = function(e) {
  e.preventDefault();  
  fetch('/table/share', {
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