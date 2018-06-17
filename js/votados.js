var xmlData;
var etiquetas = ['hats', 'space', 'funny', 'sunglasses', 'boxes', 'caturday', 'ties', 'dream', 'sinks', 'clothes'];
var urlFavs = 'http://localhost:3000/favs';
var urlLikes = 'http://localhost:3000/likes';
var urlVotos = 'http://localhost:3000/votos';
var id;
var xmlDataFavs;
var xmlDataLikes;
var xmlDataVotos;
var arrayVotos = [];

window.onload = function(){
    id = getCookie('user_id');
    appKitten();
}

async function appKitten() {
    xmlDataVotos = await cargarJSON(urlVotos);
    xmlDataFavs = await cargarJSON(urlFavs);
    xmlDataLikes = await cargarJSON(urlLikes);
    imprimir();
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

async function imprimir(){
    var misFav = await cargarJSON(urlFavs + '?user_id=' + id);
    var misLikes = await cargarJSON(urlLikes + '?user_id=' + id);
    var misVotos = await cargarJSON(urlVotos + '?user_id=' + id);

    var contentVotos = document.getElementById('content-kitten');
    var tabla = document.createElement('table');
    tabla.setAttribute('id', 'tabla');
    tabla.classList.add('tabla');
    quitarRepes();
    xmlDataVotos = arrayVotos;

    for (var i = 0; i < xmlDataVotos.length; i++){ 

        var fila = document.createElement('tr');
        tabla.appendChild(fila);
        for(var j = 0; j < 4; j++){            
            var celda = document.createElement('td');
            var img = document.createElement('img');
            img.classList.add('gatos');

            var contentIcons = document.createElement('div');

            if(document.cookie){
                //-------------------FAV----------------------

                var fav = document.createElement('img');
                if(misFav == ''){
                    fav.setAttribute('src', '../img/fav.png');
                }
                for(var z = 0; z < misFav.length; z++) {
                    if(xmlDataVotos[i].url == misFav[z].url) {
                        fav.setAttribute('src', '../img/favAfter.png');
                        fav.setAttribute('id-json', misFav[z].id);
                        break;
                    } else {
                        fav.setAttribute('src', '../img/fav.png');
                    }
                }
                fav.setAttribute('id', xmlDataVotos[i].url);
                fav.classList.add('fav');
                coloresFav(fav);
                contentIcons.appendChild(fav);

                //-------------------LIKE----------------------

                var like = document.createElement('img');
                if(misLikes == ''){
                    like.setAttribute('src', '../img/like.png');
                }

                for(var z = 0; z < misLikes.length; z++) {
                    if(xmlDataVotos[i].url == misLikes[z].url) {
                        like.setAttribute('src', '../img/likeAfter.png');
                        like.setAttribute('id-json', misLikes[z].id);
                        break;
                    } else {
                        like.setAttribute('src', '../img/like.png');
                    }
                }

                like.setAttribute('id', xmlDataVotos[i].url);
                like.classList.add('like');
                coloresLike(like);
                contentIcons.appendChild(like);
            }

            var totalVotos = await cargarJSON(urlVotos + '?url=' + xmlDataVotos[i].url);

            var selectVotos = document.createElement('select');
            selectVotos.setAttribute('id', xmlDataVotos[i].url);

            var opciones = '<option value="0" selected>VOTA</option>';
            var puntuacion = 0;

            for(var z = 0; z < misVotos.length; z++) {

                if(xmlDataVotos[i].url == misVotos[z].url) {

                    puntuacion = misVotos[z].puntos;
                    break;
                }
            }

            if(document.cookie == ''){
                selectVotos.setAttribute('disabled', 'disabled');
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
            contadorVotos.setAttribute('id', xmlDataVotos[i].url);

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

            img.setAttribute('src', xmlDataVotos[i].url);
            img.setAttribute('alt', xmlDataVotos[i].url);

            celda.appendChild(img);
            celda.appendChild(contentIcons);
            fila.appendChild(celda);
            if(j != 3) {
                i++;
            }
            if(xmlDataVotos[i] == undefined) {
                break;
            }
        }  
    }

    contentVotos.appendChild(tabla);
}

function quitarRepes(){
    var url = xmlDataVotos.url;
    var index = 0;
    var hechos = [];

    arrayVotos = xmlDataVotos.filter(function(url, index) {
        if(!hechos.includes(url.url)){
            hechos.push(url.url);
            return xmlDataVotos[index];
        }
        index++;
    });
}

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

//----FUNCIONALIDADES DE FAV Y LIKE
function coloresFav(btn){
    btn.addEventListener('click', function(){
        var urlImg = this.getAttribute('id');

        if(this.getAttribute('src') == '../img/favAfter.png'){
            var idbtn = this.getAttribute('id-json');
            deleteFav(idbtn);
            this.setAttribute('src', '../img/fav.png');

        } else {
            this.setAttribute('src', '../img/favAfter.png');
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

        if(this.getAttribute('src') == '../img/likeAfter.png'){
            var idbtn = this.getAttribute('id-json');
            deleteLike(idbtn);
            this.setAttribute('src', '../img/like.png');
        } else {
            this.setAttribute('src', '../img/likeAfter.png');
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