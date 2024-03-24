


async function doTheJob() {
    await sleep(6000);
    const logedInElement = document.querySelector('.re-SharedTopbar-loginButton-wrapper');
    const texto = logedInElement.textContent || logedInElement.innerText; // Obtenemos el contenido del elemento
    const isLogedIn = ( texto === 'Acceder'? false : true )


    if(!isLogedIn){
        // Llena los campos del formulario
        simulateInput(document.querySelector('.re-Form-input[data-e2e="field-name"]'), 'jordi');
        simulateInput(document.querySelector('.re-Form-input[data-e2e="field-mail"]'), 'jordi.woio@gmail.com');
        simulateInput(document.querySelector('.re-Form-input[data-e2e="field-phone"]'), '698758745');
        simulateSelect(document.querySelector('.sui-FormSelect.re-Form-select'), '2');
        await sleep(3000)
        // Simula clic en el checkbox de términos y condiciones
        const checkbox = document.querySelector('#idFormContactDetail-aside');
        // Verifica si el checkbox existe y no está marcado antes de hacer clic
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }

        await sleep(3000)
        document.querySelector('#App > div.re-Page > main > div.re-LayoutContainer.re-LayoutContainer--large > div.re-ContentDetail-topContainer > section > div > div.re-ContactDetailFormContainer > div:nth-child(2) > div > form > div:nth-child(7) > button').click()
        await sleep(6000)
        document.querySelector('#modal-react-portal > div > div > div.sui-MoleculeModal-no-header > button').click()
        await sleep(3000)
    }
    else{
        console.log('voay a pillar el boton para enseñar el telefono')
        const botonTelef = document.querySelector('.re-ContactDetail-showPhone .sui-AtomButton-text')
        console.log(botonTelef)
        botonTelef.click()
        await sleep(3000)
    }


    const telfonoElement = document.querySelector('.re-ContactDetail-phone');
    const nombreElement = document.querySelector('.re-ContactDetail-particularName')
    await sleep(3000)
    const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
    const textoCompleto = nombreElement.textContent || nombreElement.innerText; // Obtenemos el contenido del elemento
    const nombre = textoCompleto.replace('particular: ', '').trim();


    console.log({nombre:nombre, telefono:telefono})
}

doTheJob().then();

