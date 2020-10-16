const form = new FormData(form)
const user = {
    user,
    password
};

document.getElementById('login').onsubmit = function(e){
    e.preventDefault();

    fetch('todos/login',{
        method: 'POST',

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
            
        })
        .catch(function(error){
            document.getElementById('baduser').className = '';
        })
    ;
}

