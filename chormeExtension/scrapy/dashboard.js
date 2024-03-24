// dashboard.js

// Función para actualizar la interfaz con información de las pestañas
function updateTabsInfo(tabsInfo) {
    const container = document.getElementById('tabsInfo');
    container.innerHTML = ''; // Limpia el contenedor
    tabsInfo.forEach(info => {
        const elem = document.createElement('div');
        elem.textContent = `Tab ID: ${info.tabId}, URL: ${info.url}`;
        container.appendChild(elem);
    });
}

