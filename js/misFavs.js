var urlFavs = 'http://localhost:3000/favs';
var urlLikes = 'http://localhost:3000/likes';
var urlVotos = 'http://localhost:3000/votos';
var xmlDataFavs;
var xmlDataLikes;
var xmlDataVotos;
var id;
var arrayFavs = [];
var arrayLikes = [];

window.onload = function(){
    id = getCookie('user_id');
    appKitten();
}

async function appKitten() {
    xmlDataFavs = await cargarJSON(urlFavs);
    xmlDataVotos = await cargarJSON(urlVotos);
    xmlDataLikes = await cargarJSON(urlLikes);

    cargarArrayFavs();
    cargarArrayLikes();

    imprimir();

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

function cargarArrayFavs(){
    for(var i = 0; i < xmlDataFavs.length; i++){
        if(xmlDataFavs[i].user_id == id){
            arrayFavs.push(xmlDataFavs[i].url);
        }
    }
}

function cargarArrayLikes(){
    for(var i = 0; i < xmlDataLikes.length; i++){
        if(xmlDataLikes[i].user_id == id){
            arrayLikes.push(xmlDataLikes[i].url);
        }
    }
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


async function imprimir() {

    //--------FAVS
    var contentFavs = document.getElementById('content-favs');
    var misFav = await cargarJSON(urlFavs + '?user_id=' + id);
    var misLikes = await cargarJSON(urlLikes + '?user_id=' + id);
    var misVotos = await cargarJSON(urlVotos + '?user_id=' + id);

    var tablaFavs = document.createElement('table');
    tablaFavs.classList.add('tabla');

    for(let i = 0; i < arrayFavs.length; i++){
        var filaFavs = document.createElement('tr');
        tablaFavs.appendChild(filaFavs);


        for(let j = 0; j < 4; j++){

            var celdaFavs = document.createElement('td');

            var imgFav = document.createElement('img');
            imgFav.classList.add('gatos');
            var contentIconsFav = document.createElement('div');


            var img = document.createElement('img');

            if(misFav == ''){
                img.setAttribute('src', '../img/fav.png');
            }
            for(var z = 0; z < misFav.length; z++) {
                if(arrayFavs[i] == misFav[z].url) {
                    img.setAttribute('src', '../img/favAfter.png');
                    img.setAttribute('id-json', misFav[z].id);
                    break;
                } else {
                    img.setAttribute('src', '../img/fav.png');
                }
            }

            img.setAttribute('id', arrayFavs[i]);
            img.classList.add('fav');
            coloresFav(img);
            contentIconsFav.appendChild(img);
            //---------LIKE EN FAVORITOS
            var likeFav = document.createElement('img');
            if(misLikes == ''){
                likeFav.setAttribute('src', '../img/like.png');
            }
            for(var z = 0; z < misLikes.length; z++) {
                if(arrayFavs[i] == misLikes[z].url) {
                    likeFav.setAttribute('src', '../img/likeAfter.png');
                    likeFav.setAttribute('id-json', misLikes[z].id);
                    break;
                } else {
                    likeFav.setAttribute('src', '../img/like.png');
                }
            }
            likeFav.setAttribute('id', arrayFavs[i]);
            likeFav.classList.add('like');
            coloresLike(likeFav);
            contentIconsFav.appendChild(likeFav);

            //---------VOTOS EN FAVORITOS

            var totalVotosFav = await cargarJSON(urlVotos + '?url=' + arrayFavs[i]);

            var selectVotosFav = document.createElement('select');
            selectVotosFav.setAttribute('id', arrayFavs[i]);

            var opcionesFav = '<option value="0" selected>VOTA</option>';
            var puntuacionFav = 0;

            for(var z = 0; z < misVotos.length; z++) {

                if(arrayFavs[i] == misVotos[z].url) {

                    puntuacionFav = misVotos[z].puntos;
                    break;
                }
            }

            for(var c = 1; c <= 10; c++){
                var selected = '';
                if(puntuacionFav == c) {

                    selectVotosFav.setAttribute('disabled', 'disabled');
                    selected = ' selected';
                }
                opcionesFav += '<option value="' + c +'"' + selected + '>' + c + '</option>';
            }
            selectVotosFav.innerHTML = opcionesFav;

            var contadorVotosFav = document.createElement('div');
            contadorVotosFav.classList.add('contadorVotosFav');
            contadorVotosFav.setAttribute('id', arrayFavs[i]);

            var numtotalVotosFav = 0;

            for(var z = 0; z < totalVotosFav.length; z++) {
                numtotalVotosFav += totalVotosFav[z].puntos;
            }
            if((totalVotosFav.length) == 1){
                numtotalVotosFav = numtotalVotosFav;
            } else {
                numtotalVotosFav = Math.round(numtotalVotosFav/(totalVotosFav.length+1));
            }
            contadorVotosFav.innerHTML = 'Puntuación media: ' + numtotalVotosFav;

            selectVotosFav.addEventListener('change', function() {
                var votosFav = parseInt(this.options[this.selectedIndex].value);
                var votosTotalObjFav = this.parentNode.querySelector('.contadorVotosFav');
                var votosTotalFav = parseInt(votosTotalObjFav.innerHTML.replace('Puntuación media: ', ''));

                var contadorFav = Math.round((votosTotalFav + votosFav)/(totalVotosFav.length+1));
                votosTotalObjFav.innerHTML = 'Puntuación media: ' + contadorFav;
                this.setAttribute('disabled', 'disabled');

                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', function() {
                    if(this.readyState == 4 && this.status == 201) {
                    }
                });
                xhr.open("post", urlVotos, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({url: votosTotalObjFav.id, user_id: id, puntos: votosFav}));
            });

            contentIconsFav.appendChild(selectVotosFav);
            contentIconsFav.appendChild(contadorVotosFav);

            imgFav.setAttribute('src', arrayFavs[i]);
            imgFav.setAttribute('alt', arrayFavs[i]);


            celdaFavs.appendChild(imgFav);
            celdaFavs.appendChild(contentIconsFav);
            filaFavs.appendChild(celdaFavs);
            if(j != 3) {
                i++;
            }
            if(arrayFavs[i] == undefined) {
                break;
            }

        }


        contentFavs.appendChild(tablaFavs);
    }


    //-------LIKES

    var contentLikes = document.getElementById('content-likes');

    var tablaLikes = document.createElement('table');
    tablaLikes.classList.add('tabla');

    for(let i = 0; i < arrayLikes.length; i++){
        var filaLikes = document.createElement('tr');
        tablaLikes.appendChild(filaLikes);


        for(let j = 0; j < 4; j++){

            var celdaLikes = document.createElement('td');

            var imgLike = document.createElement('img');
            imgLike.classList.add('gatos');
            var contentIconsLike = document.createElement('div');


            var img = document.createElement('img');

            if(misLikes == ''){
                img.setAttribute('src', '../img/like.png');
            }
            for(var z = 0; z < misLikes.length; z++) {
                if(arrayLikes[i] == misLikes[z].url) {
                    img.setAttribute('src', '../img/likeAfter.png');
                    img.setAttribute('id-json', misLikes[z].id);
                    break;
                } else {
                    img.setAttribute('src', '../img/like.png');
                }
            }

            img.setAttribute('id', arrayLikes[i]);
            img.classList.add('fav');
            coloresFav(img);
            contentIconsLike.appendChild(img);
            //-------FAV EN LIKES
            var favLike = document.createElement('img');
            if(misFav == ''){
                favLike.setAttribute('src', '../img/fav.png');
            }
            for(var z = 0; z < misFav.length; z++) {
                if(arrayLikes[i] == misFav[z].url) {
                    favLike.setAttribute('src', '../img/favAfter.png');
                    favLike.setAttribute('id-json', misFav[z].id);
                    break;
                } else {
                    favLike.setAttribute('src', '../img/fav.png');
                }
            }
            favLike.setAttribute('id', arrayLikes[i]);
            favLike.classList.add('fav');
            coloresFav(favLike);
            contentIconsLike.appendChild(favLike);

            //----VOTOS EN LIKES

            var totalVotosLike = await cargarJSON(urlVotos + '?url=' + arrayLikes[i]);

            var selectVotosLike = document.createElement('select');
            selectVotosLike.setAttribute('id', xmlDataVotos[i].url);

            var opcionesLike = '<option value="0" selected>VOTA</option>';
            var puntuacionLike = 0;

            for(var z = 0; z < misVotos.length; z++) {

                if(arrayLikes[i] == misVotos[z].url) {

                    puntuacionLike = misVotos[z].puntos;
                    break;
                }
            }
            for(var c = 1; c <= 10; c++){
                var selected = '';
                if(puntuacionLike == c) {

                    selectVotosLike.setAttribute('disabled', 'disabled');
                    selected = ' selected';
                }
                opcionesLike += '<option value="' + c +'"' + selected + '>' + c + '</option>';
            }
            selectVotosLike.innerHTML = opcionesLike;

            var contadorVotosLike = document.createElement('div');
            contadorVotosLike.classList.add('contadorVotosLike');
            contadorVotosLike.setAttribute('id', arrayLikes[i]);

            var numtotalVotosLike = 0;

            for(var z = 0; z < totalVotosLike.length; z++) {
                numtotalVotosLike += totalVotosLike[z].puntos;
            }
            if((totalVotosLike.length) == 1){
                numtotalVotosLike = numtotalVotosLike;
            } else {
                numtotalVotosLike = Math.round(numtotalVotosLike/(totalVotosLike.length+1));
            }
            contadorVotosLike.innerHTML = 'Puntuación media: ' + numtotalVotosLike;

            selectVotosLike.addEventListener('change', function() {
                var votosLike = parseInt(this.options[this.selectedIndex].value);
                var votosTotalObjLike = this.parentNode.querySelector('.contadorVotosLike');
                var votosTotalLike = parseInt(votosTotalObjLike.innerHTML.replace('Puntuación media: ', ''));

                var contadorLike = Math.round((votosTotalLike + votosLike)/(totalVotosLike.length+1));
                votosTotalObjLike.innerHTML = 'Puntuación media: ' + contadorLike;
                this.setAttribute('disabled', 'disabled');

                var xhr = new XMLHttpRequest();
                xhr.addEventListener('readystatechange', function() {
                    if(this.readyState == 4 && this.status == 201) {
                    }
                });
                xhr.open("post", urlVotos, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify({url: votosTotalObjLike.id, user_id: id, puntos: votosLike}));
            });

            contentIconsLike.appendChild(selectVotosLike);
            contentIconsLike.appendChild(contadorVotosLike);

            imgLike.setAttribute('src', arrayLikes[i]);
            imgLike.setAttribute('alt', arrayLikes[i]);

            celdaLikes.appendChild(imgLike);
            celdaLikes.appendChild(contentIconsLike);
            filaLikes.appendChild(celdaLikes);
            if(j != 3) {
                i++;
            }
            if(arrayLikes[i] == undefined) {
                break;
            }

        }
    }

    contentLikes.appendChild(tablaLikes);
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