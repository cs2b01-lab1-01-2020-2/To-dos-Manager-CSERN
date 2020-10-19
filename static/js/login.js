
   function myFunc(vars) {
	return vars
}


function validEmail(element) {
	var text = document.getElementById(element.id).value;
	var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
	
	if (!regex.test(text)) {
	  document.getElementById("bademail").className = "uk-animation-shake"
	  document.getElementById("bademail").classList.add("error")
	}
	else{
	  document.getElementById("bademail").className = "hidden";
	}
  };


document.getElementById('login').onsubmit = function(e){
  e.preventDefault();

  fetch('/user/create',{
	  method: 'POST',
	  // Capturamos la data del form
	  body: JSON.stringify({
		  // Este es el javascript object
		  'user': document.getElementById('username_reg').value,
		  'email': document.getElementById('email').value,
		  'password': document.getElementById('password_reg').value
	  }),
	  headers: {
		  'content-type': 'application/json'
	  }
  })
	  .then(function(response){
		  return response.json();
	  })
	  .then(function(jsonResponse){
		  const user_ = document.getElementById('user');
		  
		  if( user_ in jsonResponse['username_name']){
			  document.getElementById('baduser').className = 'hidden';
		  }
		  else{
			  document.getElementById('baduser').className = 'error';
		  }

		  if( user_ in jsonResponse['password']){
			  document.getElementById('baduser').className = 'hidden';
		  }
		  else{
			  document.getElementById('baduser').className = 'error';
		  }
	  })
	  .catch(function(error){
		  document.getElementById('baduser').className = '';
	  });
}

document.getElementById('createuser').onsubmit = function(e){
    e.preventDefault();
	
	fetch('/user/create',{
		method: 'POST',
		body: JSON.stringify({
			'username': document.getElementById('username_reg').value,
			'email': document.getElementById('email').value,
			'password': document.getElementById('password_reg').value
		}),
		headers: {
			'content-type': 'application/json'
		}
	})
	.then(function(response){
		return response.json();
	})
	.then(function(jsonResponse){
		console.log(jsonResponse);
	})
	.catch(function(error){
		document.getElementById('baduser').className = '';
	});
}
