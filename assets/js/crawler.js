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
    startApp();
}

async function startApp() {
    await getCineMark();
    // await getCineRoxy();
    // await getCineSystem();
    // getAll();
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



async function startRequest(url, type) {
    
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