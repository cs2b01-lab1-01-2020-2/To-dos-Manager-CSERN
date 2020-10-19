function validEmail(element) {
  var text = document.getElementById(element.id).value;
  var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  
  if (!regex.test(text)) {
    document.getElementById("bademail_register").className = "uk-animation-shake"
    document.getElementById("bademail_register").classList.add("error")
    //document.getElementById("bademail").classList.add("error")
  }
  else{
    document.getElementById("bademail_register").className = "hidden"
  }
  };

document.getElementById('login').onsubmit = function(e){
  e.preventDefault();

  fetch('/autth/login',{
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
  .then(function(jsonResponse){
		console.log(jsonResponse);
    console.log("logeadooo!")
  })
  .catch(function(error){
    document.getElementById('baduser').className = '';
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
  .then(function(jsonResponse){
    console.log(jsonResponse);
  })
  .catch(function(error){
    document.getElementById('baduser_register').className = 'error ';
  });
}
