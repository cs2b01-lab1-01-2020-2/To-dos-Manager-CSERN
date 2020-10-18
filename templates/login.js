const form = new FormData(form)
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
