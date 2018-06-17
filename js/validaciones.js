/*--------- VALIDACIONES ------------*/
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
        return false;
    }
    else{
        form["passwordAgain"].setCustomValidity("");
        return true;
    }
});