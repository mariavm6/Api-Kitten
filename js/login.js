var urlUser = 'http://localhost:3000/users';

function cargarUsersJSON() {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", urlUser, true);
        xhr.responseType = "json";
        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response);
            } else {
                reject(status);
                alert("Algo fue mal.");
            }
        }
        xhr.send();
    });
}

async function comprobarUsuario(name, pass) {
    var arrayUsers = await cargarUsersJSON();
    var flag = false;
    for (var i = 0; i < arrayUsers.length; i++){
        if(arrayUsers[i].name == name && arrayUsers[i].password == pass) {
            setCookie(arrayUsers[i].id);
            setCookieNombre(arrayUsers[i].name);
            flag = true;
            
        }
    }
    if(flag) {
        
        window.location.href = "../index.html";
        
    } else {
        alert('Credenciales incorrectas, inténtalo de nuevo.');
    }
}

function getId(name, pass){
    var arrayUsers = cargarUsersJSON();
    for (var i = 0; i < arrayUsers.length; i++){
        if(arrayUsers[i].name == name && arrayUsers[i].password == pass) {
           var id = arrayUsers[i].id;
        }  
    }
    return id;
}


document.getElementById("boton-login").addEventListener("click", function() {
    var name = document.getElementById("input-name").value;
    var pass = document.getElementById("input-pass").value;
    comprobarUsuario(name, pass);
});


function setCookie(id){
    document.cookie = "user_id=" + id + "; max-age=3600; path=/";
}

function setCookieNombre(name){
    document.cookie = "nombre=" + name + "; max-age=3600; path=/";
}




