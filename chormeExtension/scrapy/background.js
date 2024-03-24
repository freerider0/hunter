importScripts('./helpers/domain.js')




//Esuchar los mensajes de los otros scripts
chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
    console.log('oido cocina', request)

    if (request.action === "captureThisTab") {
        // Usar sender.tab.id para identificar el tab desde el cual se envió el mensaje
        chrome.tabs.captureVisibleTab(sender.tab.windowId, {format: 'png', quality: 100}, function(dataUrl) {
            // Hacer algo con dataUrl, como enviarlo de vuelta al solicitante
            sendResponse({result: dataUrl});
        });
        return true; // Indica que la respuesta será asincrónica
    }

    if (request.action === "borrarCookies2") {
        console.log('borrando cookes de ', request.dominio)
        //borrarCookiesDeDominio(request.dominio);
    }
});
async function fetchAndOpenTab() {
    try {
        const response = await fetch('http://localhost:3000/next');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Opening URL in a new tab:', data.url);

        // Abre la URL en una nueva pestaña
        chrome.tabs.create({ url: data.url });
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

console.log('abkg background')
// Ejemplo de cómo llamar a fetchAndOpenTab, podría ser en respuesta a un evento de la extensión
fetchAndOpenTab();


// Aquí, debes llamar a sendTabsInfo() en los momentos apropiados, como cuando se abre una nueva pestaña, se cierra una pestaña, etc.
// Esto dependerá de la lógica específica de tu extensión y de lo que quieras monitorizar.
