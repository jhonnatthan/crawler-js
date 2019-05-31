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
    cineSystem: [],
    all: [],
    complete: false
};

window.onload = function () {
    document.querySelector('.loader').style.display = 'none';
    startApp();
}

async function startApp() {
    await Promise.all([
        getCineMark(),
        getCineRoxy(),
        getCineSystem()
    ]);
    getAll();
}

async function getCineMark() {
    let url = 'https://www.cinemark.com.br';

    let dom = await startRequest(url + '/santos/filmes/em-cartaz', 'html');

    let cartazes = dom.querySelectorAll('.movie-container');

    cartazes.forEach(cartaz => {
        let titleEl = cartaz.querySelector('.movie-title a');

        let hasChild = titleEl.querySelector('span') != null;

        let title = hasChild ? titleEl.querySelector('span').innerText : titleEl.innerText;
        title = title.trim().replace(/(\r\n|\n|\r)/gm, "");

        let image = url + cartaz.querySelector('source').getAttribute('srcset');
        let sortedTitle = trataTitulo(title);

        films.cineMark.push({ title, image, sortedTitle });
    });
}

async function getCineRoxy() {
    let url = 'http://www.cineroxy.com.br';

    let dom = await startRequest(url, 'html');

    let cartazes = dom.querySelectorAll('div[id^="cphConteudo_Cartaz_rptFilmes_ctl00_"]');

    cartazes.forEach(cartaz => {
        let title = cartaz.querySelector('h2').innerText;
        title = title.trim().replace(/(\r\n|\n|\r)/gm, "");

        let image = cartaz.querySelector('img').getAttribute('src');
        let sortedTitle = trataTitulo(title);

        films.cineRoxy.push({ title, image, sortedTitle });
    });
}

async function getCineSystem() {
    let url = 'https://www.cinesystem.com.br';

    let dom = await startRequest(url + '/filmes/em-cartaz/_em_cartaz.php?d=31', 'html');

    let cartazes = dom.querySelectorAll('.bloco-posters');

    cartazes.forEach(cartaz => {
        let title = cartaz.querySelector('h3').innerText;
        title = title.trim().replace(/(\r\n|\n|\r)/gm, "");

        let image = url + cartaz.querySelector('img').getAttribute('src');
        let sortedTitle = trataTitulo(title);

        films.cineSystem.push({ title, image, sortedTitle });
    });
}


function getAll() {
    films.all = Object.assign([], films.cineMark);

    let cineRoxyExclusives = [];
    films.cineRoxy.forEach(filmA => {
        let diff = false;
        films.all.forEach(filmB => {
            if (filmB.sortedTitle != filmA.sortedTitle) {
                console.log('diff', filmA, filmB);
                diff = true;
            };
        });

        if (diff) {
            cineRoxyExclusives.push(filmA);
        }
    });

    let cineSystemExclusives = [];
    films.cineSystem.forEach(filmA => {
        let diff = false;
        films.all.forEach(filmB => {
            if (filmB.sortedTitle != filmA.sortedTitle) {
                diff = true;
            };
        });

        if (diff) {
            cineSystemExclusives.push(filmA);
        }
    });

    console.log(films.all, cineRoxyExclusives, cineSystemExclusives);
}

async function startRequest(url, type) {
    let myHeaders = new Headers();
    let myOpt = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };

    let content = await fetch("https://cors-anywhere.herokuapp.com/" + url, myOpt);

    let data = await content.text();

    switch (type) {
        case 'html':
            return parseDOM(data);
        case 'json':
            return JSON.parse(data);
        default:
            return data;
    }
}

function parseDOM(text) {
    let parser = new DOMParser();
    return parser.parseFromString(text, "text/html");
}

function trataTitulo(text) {
    const a = 'àáäâãèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ'
    const b = 'aaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh'
    const p = new RegExp(a.split('').join('|'), 'g')

    text = text.replace(':', '');
    text = text.replace('–', '');
    text = text.replace(/\s/g, '');
    text = text.replace(p, c => b.charAt(a.indexOf(c)));
    text = text.replace(/&/g, '-and-');
    text = text.replace(/[\s\W-]+/g, '-');

    text = text.toLowerCase();
    text = text.split("")
    text = text.sort((a, b) => {
        if (a > b) { return 1; }
        if (a < b) { return -1; }
        return 0;
    });
    text = text.join("");

    return text;
}