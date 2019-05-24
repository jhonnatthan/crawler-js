// Eventos 
let menuButton = document.querySelector('#menu__button');

menuButton.addEventListener('click', (ev) => {
    let headerMenu = document.querySelector('.header__menu');
    menuButton.classList.toggle('active');
    headerMenu.classList.toggle('active');
});

// Crawler
let films = {
    cineRoxy: [],
    cineMark: [],
    espacoFilmes: []
};

window.onload = function () {
    startApp();
}

function startApp() {
    // getCineMark();
    // getCineRoxy();
}

function getCineMark() {
    let url = 'https://www.cinemark.com.br';
    startRequest(url + '/santos/filmes/em-cartaz', {
        html: true,
        callBack: (dom) => {

            let cartazes = dom.querySelectorAll('.movie-container');

            cartazes.forEach(cartaz => {
                let titleEl = cartaz.querySelector('.movie-title a');
                let hasChild = titleEl.querySelector('span') != null;
                let title = hasChild ? titleEl.innerText : titleEl.querySelector('span').innerText;
                
                let image = url + cartaz.querySelector('source').getAttribute('srcset');
                let sortedTitle = title.replace(/\s/g, '').split("").sort((a, b) => a > b ? 1 : -1 ).join("").toLowerCase();

                films.cineMark.push({ title, image, sortedTitle });
            });

            console.log(films);
        }
    });

}

function getCineRoxy() {
    startRequest('http://www.cineroxy.com.br/', {
        html: true,
        callBack: (dom) => {
            
            let cartazes = dom.querySelectorAll('div[class^="cphConteudo_Cartaz_rptFilmes_ctl00_"]');

            console.log(cartazes);

            cartazes.forEach(cartaz => {
                console.log(cartaz);
            })
        }
    });
}

function getEspacoFilmes() {
    let cineRoxy = startRequest('https://cineroxy.com.br/');
}

function startRequest(url, opts) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (opts.html) {
                opts.callBack(parseDOM(this.responseText));
            } else {
                opts.callBack(this.responseText);
            }
        }
    };

    xhr.open("GET", "https://cors-anywhere.herokuapp.com/" + url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
}

function parseDOM(text) {
    let parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
}