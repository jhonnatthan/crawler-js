let films = {
    cineRoxy: [],
    cineMark: [],
    espacoFilmes: []
};

window.onload = function () {
    startApp();
}

function startApp() {
    getCineMark();
}

function getCineMark() {
    let url = 'https://www.cinemark.com.br';
    startRequest(url + '/santos/filmes/em-cartaz', {
        html: true,
        callBack: (dom) => {

            let cartazes = dom.querySelectorAll('.movie-container');

            cartazes.forEach(cartaz => {
                let title = cartaz.querySelector('.movie-title a').innerText.trim();
                let image = url + cartaz.querySelector('source').getAttribute('srcset');

                films.cineMark.push({ title, image });
            });

            console.log(films);
        }
    });

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