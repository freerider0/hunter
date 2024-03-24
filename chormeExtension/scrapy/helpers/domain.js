function getDomain(url) {
    // Extraer solo el dominio completo (con subdominios) de la URL
    const dominioCompleto = new URL(url).hostname;

    // Dividir el dominio en partes (subdominios + dominio principal + extensión)
    const partes = dominioCompleto.split('.');

    // Asumir que el dominio principal y la extensión son las últimas dos partes
    // Esto funciona para la mayoría de los casos, como ".com", ".org", etc.
    // pero puede necesitar ajustes para dominios de nivel superior geográficos (ccTLDs) como ".co.uk"
    const dominioPrincipalYExtension = partes.slice(-2).join('.');

    return dominioPrincipalYExtension;
}

function borrarCookiesDeDominio(url) {
    const domain = getDomain(url)
    chrome.cookies.getAll({domain: domain}, function(cookies) {
        for (let i = 0; i < cookies.length; i++) {
            var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path;
            chrome.cookies.remove({"url": url, "name": cookies[i].name});
        }
    });
    chrome.cookies.getAll({domain: '.'+domain}, function(cookies) {
        for (let i = 0; i < cookies.length; i++) {
            var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path;
            chrome.cookies.remove({"url": url, "name": cookies[i].name});
        }
    });
}