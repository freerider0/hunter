async function doTheJob() {
    await sleep(6000);
        // Llena los campos del formulario
        simulateInput(document.querySelector('#leadDetailsUpperForm_name'), 'Marc');
        await sleep(3000)
        simulateInput(document.querySelector('#leadDetailsUpperForm_email'), 'jordi.woio45@gmail.com');
        await sleep(3000)
        simulateInput(document.querySelector('#leadDetailsUpperForm_phoneNumber'), '656435632');
        await sleep(3000)
        // Click en boton enviar
        const botonEnviar = document.querySelector('#app > div.details-container > section:nth-child(3) > aside > div > form > div.content-button > button');
        botonEnviar.click()
        await sleep(3000)
        //Cerar el modal
        const modal = document.querySelector('body > div.ReactModalPortal > div > div > div.titleStyled.title-modal > div.icon-close.link');
        modal.click()
        await sleep(3000)
        //Darle a ver el telefono
        const verTelefono = document.querySelector('    #app > div.details-container > section:nth-child(3) > aside > div > div.agency-info.flex.flex-nowrap.mb-sm > div.view-phone.flex > div > span\n');
        verTelefono.click()
        await sleep(3000)
        //Click en volver a contactar
        const volverAcontactar = document.querySelector('    #app > div.details-container > section:nth-child(3) > aside > div > form > div.content-button > button\n');
        volverAcontactar.click()
        await sleep(3000)
        //Copiar el telefono
        const telfonoElement = document.querySelector('#content-modal > div > div:nth-child(1) > div > div > span');
        const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
        console.log('telefono', telefono)
}

doTheJob().then();