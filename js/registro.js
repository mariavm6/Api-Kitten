var urlUser = 'http://localhost:3000/users';
var xmlData;

window.onload = function(){
    getNameJSON();
}


async function getNameJSON(){
    xmlData = await cargarJSON(urlUser);
}

function cargarJSON(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
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

    var form = document.forms["formulario"];

    form["nombre"].addEventListener("keyup", function(){
        var expReg = /[A-Za-z]{2,15}/g;
        if(!expReg.test(form["nombre"].value) || form["nombre"].value == ""){
            form["nombre"].setCustomValidity("Introduzca un nombre que contenga entre 2 y 15 caracteres");
        }
        else{
            form["nombre"].setCustomValidity("");
        }
    });

    form["apellidos"].addEventListener("keyup", function(){
        var expReg = /[A-Za-z]{2,15}/g;
        if(!expReg.test(form["apellidos"].value) || form["apellidos"].value == ""){
            form["apellidos"].setCustomValidity("Introduzca un apellido que contenga entre 2 y 15 caracteres");
        }
        else{
            form["apellidos"].setCustomValidity("");
        }
    });

    form["email"].addEventListener("keyup", function(){
        var expReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:[a-zA-Z0-9-]+)*(\.{1})([a-z]){2,3}$/g;
        if(!expReg.test(form["email"].value) || form["email"].value == ""){
            form["email"].setCustomValidity("La dirección de email debe tener el patron example@ejemplo.com");
        }
        else{
            form["email"].setCustomValidity("");
        }
    });

    form["password"].addEventListener("keyup", function(){
        var expReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,15}$/g;
        var bool = ((!expReg.test(form["password"].value) || form["password"].value == ""));
        if(bool){
            form["password"].setCustomValidity("La contraseña debe incluir una minúscula, una mayúscula, un número, un carácter especial y no tener espacios en blanco");
        }
        else{
            form["password"].setCustomValidity("");
        }
    });

    form["passwordAgain"].addEventListener("keyup", function(){

        if(form["password"].value !== form["passwordAgain"].value){
            form["passwordAgain"].setCustomValidity("La contraseñas deben coincidir");
        }
        else{
            form["passwordAgain"].setCustomValidity("");
        }
    });


function agregarUsuario(name, pass){
    
    var xhr = new XMLHttpRequest();
    xhr.open("post", urlUser, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ name: name, password: pass }));
}

form["registro"].addEventListener("click", function(e) {
    
    var form = document.forms["formulario"];
    var name = form['nombre'].value;
    var pass = form['password'].value;
    var passA = form['passwordAgain'].value;
    var flag = true;
    
    for(var i = 0; i < xmlData.length; i++){

        if(xmlData[i].name == name && name != "" && pass != "" && pass == passA){
            e.preventDefault();
            flag = false;
            alert('Usuario ya registrado');
        } 
    }

    if(name != "" && pass != "" && pass == passA && flag){
        
        agregarUsuario(name, pass);
        
        alert("Registro correcto.");

        window.location.href = "../html/login.html";
    }
});