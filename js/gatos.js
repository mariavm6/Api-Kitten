var xmlData;
var etiquetas = ['hats', 'space', 'funny', 'sunglasses', 'boxes', 'caturday', 'ties', 'dream', 'sinks', 'clothes'];
var urlFavs = 'http://localhost:3000/favs';
var urlLikes = 'http://localhost:3000/likes';
var urlVotos = 'http://localhost:3000/votos';
var urlTag = urlKitten;
var id;
var numFotosTotal = 100;
var numAlet = Math.round(Math.random() * (100 - 20) + 20);
console.log(numAlet);
var urlKitten = "http://thecatapi.com/api/images/get?format=xml&size=small&results_per_page=" + numAlet;
var numElementos = 20;
var pagActual = 20;
var xmlDataFavs;
var xmlDataLikes;
var arrayFotos = [];

window.onload = function(){
    id = getCookie('user_id');
    appKitten(urlKitten);
}

async function appKitten(url) {
    xmlData = await obtenerXML(url);
    xmlDataFavs = await cargarJSON(urlFavs);
    xmlDataLikes = await cargarJSON(urlLikes);
    cargarArrayfotos(xmlData);
    imprimirBotones();
    printTags();
    imprimir(pagActual);
}

function obtenerXML(url){
    return new Promise(resolve => {
        var  xhttp = new XMLHttpRequest();
        xhttp.addEventListener('readystatechange', function() {
            if(this.readyState == 4 && this.status == 200) {
                resolve(this.responseXML);
            }
        });
        xhttp.open("GET", url, true);
        xhttp.send();
    });
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

function printTags(){

    var option = '<input type="button" value="Todas las categorías"/>';

    for(var i = 0; i < etiquetas.length; i++){
        option += '<input type="button" value="' + etiquetas[i] + '"/>';
    }

    var lista = document.getElementById('etiquetas');
    lista.innerHTML = option;

    var arrayInputs = document.querySelectorAll('#etiquetas input');

    for(var i = 0, c = arrayInputs.length; i < c; i++) {
        arrayInputs[i].addEventListener('click', function() {
            var opciones = this.value;
            if(opciones == "Todas las categorías") {
                urlTag = urlKitten;
            } else{
                urlTag = urlKitten + '&category=' + opciones;
            }


            pagActual = 20;
            document.getElementById('tituloCategoria').innerHTML = opciones;
            actualizarImgs(urlTag, pagActual);
        });
    }
}

function cargarArrayfotos(xml){
    var img = xml.getElementsByTagName('image');

    for(var i = 0; i <img.length; i++){
        var url = (img[i].getElementsByTagName('url')[0].textContent);
        arrayFotos.push(url);
    }
}


function imprimirBotones(){

    let k = 1;
    let f = 20;
    var boton = '<input id="' + k + '" type="button" value="' + (f) + '"/>';

    for(k; k < 5; k++){
        f += 20;
        boton += '<input id="' + (k + 1) + '" type="button" value="' + (f) + '"/>';
    }

    var botones = document.getElementById('content-botones');
    botones.innerHTML = boton;

    var arrayBotones = document.querySelectorAll('#content-botones input');

    for(let i = 0; i < arrayBotones.length; i++){
        arrayBotones[i].addEventListener('click', function() {
            pagActual = this.getAttribute('value');
            var contentKitten = document.getElementById('content-kitten');
            contentKitten.innerHTML = '';
            imprimir(pagActual);
        });
    }
}

async function imprimir(pagActual){

    var misFav = await cargarJSON(urlFavs + '?user_id=' + id);
    var misLikes = await cargarJSON(urlLikes + '?user_id=' + id);
    var misVotos = await cargarJSON(urlVotos + '?user_id=' + id);

    if(pagActual > numAlet){
        pagActual = numAlet;
    }

    var contentKitten = document.getElementById('content-kitten');

    var tabla = document.createElement('table');
    tabla.classList.add('tabla');

    var numFotos = 4;

    for(var i = 0; i < pagActual; i++){

        var fila = document.createElement('tr');
        tabla.appendChild(fila);

        for(var j =0; j < numFotos; j++){
            var celda = document.createElement('td');

            var img = document.createElement('img');
            img.classList.add('gatos');

            var contentIcons = document.createElement('div');
            contentIcons.setAttribute('style', 'display:none');

            if(document.cookie != ''){

                //---------ENLACES FAVORITOS Y LOGOUT

                var aFavs = document.getElementById('aFavs');
                aFavs.setAttribute('style', 'display:block');
                aFavs.setAttribute('style', 'cursor:pointer');

                var logoutB = document.getElementById('logout');
                logoutB.setAttribute('style', 'display:block');
                logoutB.setAttribute('style', 'cursor:pointer');
                logoutB.innerHTML = getCookie('nombre') + ' LOGOUT';
                logoutB.addEventListener('click', function() {

                    logout('nombre');
                    logout('user_id');
                    logoutB.setAttribute('style', 'display:none');
                    aFavs.setAttribute('style', 'display:none');
                    contentKitten = document.getElementById('content-kitten')
                    contentKitten.innerHTML = '';
                    pagActual = 20;
                    imprimir(pagActual);
                });

                contentIcons.setAttribute('style', 'display:block');

                //-------------------FAV----------------------

                var fav = document.createElement('img');
                if(misFav == ''){
                    fav.setAttribute('src', 'img/fav.png');
                }
                for(var z = 0; z < misFav.length; z++) {
                    if(arrayFotos[i] == misFav[z].url) {
                        fav.setAttribute('src', 'img/favAfter.png');
                        fav.setAttribute('id-json', misFav[z].id);
                        break;
                    } else {
                        fav.setAttribute('src', 'img/fav.png');
                    }
                }
                fav.setAttribute('id', arrayFotos[i]);
                fav.classList.add('fav');
                coloresFav(fav);
                contentIcons.appendChild(fav);

                //-------------------LIKE----------------------

                var like = document.createElement('img');
                if(misLikes == ''){
                    like.setAttribute('src', 'img/like.png');
                }


                for(var z = 0; z < misLikes.length; z++) {
                    if(arrayFotos[i] == misLikes[z].url) {
                        like.setAttribute('src', 'img/likeAfter.png');
                        like.setAttribute('id-json', misLikes[z].id);
                        break;
                    } else {
                        like.setAttribute('src', 'img/like.png');
                    }
                }
                like.setAttribute('id', arrayFotos[i]);
                like.classList.add('like');
                coloresLike(like);
                contentIcons.appendChild(like);

                //--------VOTOS
                var totalVotos = await cargarJSON(urlVotos + '?url=' + arrayFotos[i]);

                var selectVotos = document.createElement('select');
                selectVotos.setAttribute('id', arrayFotos[i]);


                var opciones = '<option value="0" selected>VOTA</option>';
                var puntuacion = 0;

                for(var z = 0; z < misVotos.length; z++) {

                    if(arrayFotos[i] == misVotos[z].url) {
                        puntuacion = misVotos[z].puntos;
                        break;
                    }
                }

                for(var c = 1; c <= 10; c++){
                    var selected = '';
                    if(puntuacion == c) {
                        selectVotos.setAttribute('disabled', 'disabled');
                        selected = ' selected';
                    }
                    opciones += '<option value="' + c +'"' + selected + '>' + c + '</option>';
                }

                selectVotos.innerHTML = opciones;

                var contadorVotos = document.createElement('div');
                contadorVotos.classList.add('contadorVotos');
                contadorVotos.setAttribute('id', arrayFotos[i]);

                var numtotalVotos = 0;

                for(var z = 0; z < totalVotos.length; z++) {
                    numtotalVotos += totalVotos[z].puntos;
                }
                if((totalVotos.length) == 1){
                    numtotalVotos = numtotalVotos;
                } else {
                    numtotalVotos = Math.round(numtotalVotos/(totalVotos.length+1));
                }

                contadorVotos.innerHTML = 'Puntuación media: ' + numtotalVotos;

                selectVotos.addEventListener('change', function() {
                    var votos = parseInt(this.options[this.selectedIndex].value);
                    var votosTotalObj = this.parentNode.querySelector('.contadorVotos');
                    var votosTotal = parseInt(votosTotalObj.innerHTML.replace('Puntuación media: ', ''));

                    var contador = Math.round((votosTotal + votos)/(totalVotos.length+1));
                    votosTotalObj.innerHTML = 'Puntuación media: ' + contador;
                    this.setAttribute('disabled', 'disabled');

                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener('readystatechange', function() {
                        if(this.readyState == 4 && this.status == 201) {
                        }
                    });
                    xhr.open("post", urlVotos, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify({url: votosTotalObj.id, user_id: id, puntos: votos}));
                });

                contentIcons.appendChild(selectVotos);
                contentIcons.appendChild(contadorVotos);
            }

            img.setAttribute('src', arrayFotos[i]);
            img.setAttribute('alt', arrayFotos[i]);

            celda.appendChild(img);
            celda.appendChild(contentIcons);

            fila.appendChild(celda);

            if(j != numFotos-1){
                i++;
            }
            if(arrayFotos[i] == undefined) {
                break;
            }
        }
    }
    contentKitten.appendChild(tabla);
}

//------ACTUALIZA AL CAMBIAR DE ETIQUETA

async function actualizarImgs(url, pagActual) {
    if(pagActual > numAlet){
        pagActual = numAlet;
    }
    var contentKitten = document.getElementById('content-kitten');
    contentKitten.innerHTML = '';
    arrayFotos = [];
    xmlData = await obtenerXML(url);
    cargarArrayfotos(xmlData);   
    imprimir(pagActual);
}


//----FUNCIONALIDADES DE FAV Y LIKE
function coloresFav(btn){

    btn.addEventListener('click', function(){
        var urlImg = this.getAttribute('id');

        if(this.getAttribute('src') == 'img/favAfter.png'){
            var idbtn = this.getAttribute('id-json');
            deleteFav(idbtn);
            this.setAttribute('src', 'img/fav.png');

        } else {
            this.setAttribute('src', 'img/favAfter.png');
            agregarFav(urlImg, btn);
        }
    });
}

function agregarFav(url, btn){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function() {
        if(this.readyState == 4 && this.status == 201) {
            var json_back = JSON.parse(this.response);
            if(btn.getAttribute('id-son') == undefined){
                btn.setAttribute('id-json', json_back.id);
            }
        }
    });
    xhr.open("post", urlFavs, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({url: url, user_id: id}));
}
function deleteFav(id){
    var xhr = new XMLHttpRequest();
    xhr.open("delete", urlFavs + '/' + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}


function coloresLike(btn){

    btn.addEventListener('click', function(){
        var urlImg = this.getAttribute('id');

        if(this.getAttribute('src') == 'img/likeAfter.png'){
            var idbtn = this.getAttribute('id-json');
            deleteLike(idbtn);
            this.setAttribute('src', 'img/like.png');

        } else {
            this.setAttribute('src', 'img/likeAfter.png');
            agregarLike(urlImg, btn);
        }
    });
}

function agregarLike(url, btn){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function() {
        if(this.readyState == 4 && this.status == 201) {
            var json_back = JSON.parse(this.response);
            if(btn.getAttribute('id-son') == undefined){
                btn.setAttribute('id-json', json_back.id);
            }
        }
    });
    xhr.open("post", urlLikes, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({url: url, user_id: id}));
}
function deleteLike(id){
    var xhr = new XMLHttpRequest();
    xhr.open("delete", urlLikes + '/' + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

//---------COOKIES

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}  

function logout(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}