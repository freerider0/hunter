const sendNameAndPhone = async (data) => {
    try {
        const url = 'http://127.0.0.1:3000/api/property/set-name-and-phone-by-url';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Asume que el servidor espera un objeto con una clave "platform_hashes"
        };
        const propertyDataResponse = await fetch(url, options);
        if (!propertyDataResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const propertyData = await propertyDataResponse.json();
        return propertyData;
    } catch (error) {
        console.error('Error sending name and phone:', error);
        throw error;
    }
}
let datos = {nombre: null, telefono:null, url:window.location.href}

async function doTheJob() {
    await sleep(6000);
    // Llena los campos del formulario
    // Click en boton enviar
    const botonContactar = document.querySelector('#contact-phones-container > a.see-phones-btn.icon-phone.hidden-contact-phones_link > span.hidden-contact-phones_text');
    botonContactar.click()
    await sleep(3000)
    const telfonoElement = document.querySelector('#contact-phones-container > a.icon-phone.hidden-contact-phones_formatted-phone._mobilePhone');
    const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
    console.log('telefono', telefono)

    const nombreElement = document.querySelector('#module-contact-container > section > div > div.ide-box-contact.module-contact-gray.contact-data-container > div.professional-name > span');
    const nombre = nombreElement.textContent || nombreElement.innerText; // Obtenemos el contenido del elemento
    datos.nombre = nombre
    datos.telefono = telefono
    console.log(datos)
    await sendNameAndPhone(datos)
    ;

}

doTheJob().then(()=>{chrome.runtime.sendMessage({closeTab: true})});