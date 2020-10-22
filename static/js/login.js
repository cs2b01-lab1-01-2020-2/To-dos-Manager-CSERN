function validEmail(element) {
  var text = document.getElementById(element.id).value;
  var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  
  if (!regex.test(text)) {
    document.getElementById("bademail_register").className = "uk-animation-shake"
    document.getElementById("bademail_register").classList.add("error")
  }
  else{
		document.getElementById("bademail_register").className = "hidden"
  }
};

document.getElementById('login').onsubmit = function(e){
  e.preventDefault();
  document.getElementById("baduser_login").className = "hidden";
  document.getElementById("badpass_login").className = "hidden";
  fetch('/auth/login',{
    method: 'POST',
    body: JSON.stringify({
      'username': document.getElementById('username_login').value,
      'password': document.getElementById('password_login').value
    }),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then(function(response){
		return response.json();
  })
  .then(function(res){
		if (res['response'] == 'true') {
			location.replace(window.location.href + res['user'] + "/todos")
    }
    else if(res['response'] == 'false') {
      document.getElementById("badpass_login").className = "uk-animation-shake";
      document.getElementById("badpass_login").classList.add('error');
    }
  })
  .catch(function(error){
    document.getElementById("baduser_login").className = "uk-animation-shake";
    document.getElementById("baduser_login").classList.add('error');
		UIkit.notification({
			message: 'User not logged in',
			status: 'danger',
			timeout: 3000
		});
    document.getElementById('baduser_login').className = 'error';
  });
}

document.getElementById('createuser').onsubmit = function(e){
  e.preventDefault();

  fetch('/auth/signup',{
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
  .then(function(res){
		UIkit.notification({
			message: 'User created!',
			status: 'success',
			timeout: 3000
		});
    document.getElementById('sucesscreate').className = '';
    document.getElementById('baduser_register').className = 'hidden';
    document.getElementById('username_reg').value = '';
    document.getElementById('password_reg').value = '';
    document.getElementById('email').value = '';
  })
  .catch(function(error){
		UIkit.notification({
			message: 'User could not be created!',
			status: 'danger',
			timeout: 3000
		});
    document.getElementById('baduser_register').className = 'error';
    document.getElementById('sucesscreate').className = 'hidden';
  });
}
