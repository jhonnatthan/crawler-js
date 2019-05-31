// Eventos 
/* let menuButton = document.querySelector('#menu__button');

menuButton.addEventListener('click', (ev) => {
    let headerMenu = document.querySelector('.header__menu');
    menuButton.classList.toggle('active');
    headerMenu.classList.toggle('active');
}); */

// Crawler
let films = {
    cineRoxy: [],
    cineMark: [],
    cineSystem: [],
    complete: false
};

window.onload = function () {
    startApp();
}

async function startApp() {
    await Promise.all([
        getCineMark(),
        getCineRoxy(),
        getCineSystem()
    ]);
    
    document.querySelector('.loader').style.display = 'none';
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
    geraHTML('Cine Roxy', films.cineRoxy, 'https://cineroxy.com.br/');
    geraHTML('Cine Mark', films.cineMark, 'https://www.cinemark.com.br/');
    geraHTML('Cine System', films.cineSystem, 'https://www.cinesystem.com.br/filmes/em-cartaz/');
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

function geraHTML(cinema, filmes, url) {
    let main = document.querySelector('main');

    let section = document.createElement('section');
    section.classList.add('content__films');

    let h1 = document.createElement('h1');
    h1.innerText = cinema;
    section.appendChild(h1);
    
    let ul = document.createElement('ul');
    ul.classList.add('content__films-list');

    filmes.forEach(filme => {

        let h2 = document.createElement('h2');
        h2.innerText = filme.title;

        let a = document.createElement('a');
        a.href = url;
        a.target = 'blank';
        a.innerText = "Ir para cinema";

        let divDetail = document.createElement('div');
        divDetail.classList.add('film__detail');
        divDetail.appendChild(a);

        let img = document.createElement('img');
        img.src = filme.image;
        img.setAttribute('alt', filme.title);

        let div = document.createElement('div');
        div.classList.add('film__box');
        div.appendChild(img);
        div.appendChild(divDetail);

        let li = document.createElement('li');
        li.classList.add('content__film');
        li.appendChild(div);
        li.appendChild(h2);

        ul.appendChild(li);
    });

    section.appendChild(ul);
    
    main.appendChild(section);
}