async function doTheJob() {
    await sleep(6000);
    // Llena los campos del formulario
    // Click en boton enviar
    const botonContactar = document.querySelector('#\\33 8399215593\\.109800 > div.details__col-right > div.details__block.details-featured > div > div.details-featured__action-btns > div > button');
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
    console.log({nombre: nombre, telefono: telefono})
}

doTheJob().then();