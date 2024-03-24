async function doTheJob() {
    await sleep(6000);

    //Darle a ver el telefono
    const verTelefono = document.querySelector('#phone_info > input');
    verTelefono.click()
    await sleep(3000)
    const telfonoElement = document.querySelector('#phone_info > h5:nth-child(1) > a');
    const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
    const nombreElement = document.querySelector('#informacion-anunciante-widget > div > h5');
    const nombre = nombreElement.textContent || nombreElement.innerText; // Obtenemos el contenido del elemento
    console.log({nombre: nombre, telefono: telefono})
}

doTheJob().then();