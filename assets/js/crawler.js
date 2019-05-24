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