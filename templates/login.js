function validEmail(element) {
	var text = document.getElementById(element.id).value;
	var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

	if (!regex.test(text)) {
		document.getElementById("bademail").className = "error uk-animation-shake";
	}
	else{
	  document.getElementById("bademail").className = "hidden";
	}
};


document.getElementById('login').onsubmit = function(e){
  e.preventDefault();

  fetch('XXXXXX',{
	  method: 'POST',
	  // Capturamos la data del form
	  body: JSON.stringify({
		  // Este es el javascript object
		  'user': document.getElementById('user').value,
		  'password': document.getElementById('password').value
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

/*
  try:
	  user = db_session.query(entities.User
		  ).filter(entities.User.username == username
		  ).filter(entities.User.password == password
		  ).one()
	  return Response(json.dumps(user,cls=connector.AlchemyEncoder), status=200, mimetype='application/json')
  except Exception:
	  message = {'message': 'Unauthorized'}
	  return Response(message, status=401, mimetype='application/json')
*/
/*const form = new FormData(form)
const user = {
    user,
    password
};

document.getElementById('login').onsubmit = function(e){
    e.preventDefault();

    fetch('/user/login',{
			method: 'POST',

			body: JSON.stringify({
			'user': document.getElementById('user').value,
			'password': document.getElementById('password').value
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

document.getElementById('createuser').onsubmit = function(e){
	e.preventDefault();

	fetch('/user/create',{
		method: 'POST',
		body: JSON.stringify({
			'username': document.getElementById('username').value,
			'email': document.getElementById('email').value,
			'password': document.getElementById('password').value
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
}*/
