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
    const botonContactar = document.querySelector('div.details__col-right > div.details__block.details-featured > div > div.details-featured__action-btns > div > button');
    botonContactar.click()
    await sleep(3000)
    //Darle a ver el telefono
    const verTelefono = document.querySelector('body > div.js-contact.modal__wrapper > div > div > div > div.contact__info > div.contact__advertiser-phone.u-hide.u-show--s1024 > span');
    verTelefono.click()
    await sleep(3000)
    const telfonoElement = document.querySelector('body > div.js-contact.modal__wrapper > div > div > div > div.contact__info > div.contact__advertiser-phone.u-hide.u-show--s1024');
    const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
    console.log('telefono', telefono)

    const nombreElement = document.querySelector('body > div.js-contact.modal__wrapper > div > div > div > div.contact__info > div.contact__advertiser > div.contact__advertiser-name.u-hide.u-show--s1024');
    const nombre = nombreElement.textContent || nombreElement.innerText; // Obtenemos el contenido del elemento
    datos.nombre = nombre
    datos.telefono = telefono
    console.log(datos)
    await sendNameAndPhone(datos)
}

doTheJob().then(()=>console.log('enviado'));