
async function doTheJob() {
    await sleep(6000);
    const logedInElement = document.querySelector('.nologin-user-login');
    const secondHeader = document.querySelector('#js-head-second')
    const captcha = document.querySelector('#CaptchaImage')

    simulateInput(document.querySelector('#Nombre'), 'jordi');
    simulateInput(document.querySelector('#Telefono'), '698758745');

    await sleep(3000)


    if(captcha){
        const canvas = document.createElement('canvas');
        const imgn = document.createElement('img')
        const ctx = canvas.getContext('2d');
        canvas.classList.add("get-capcha")
        canvas.width = document.documentElement.clientWidth
        canvas.height = 800
        document.body.appendChild(canvas)

        window.scrollTo({
            top: captcha.getBoundingClientRect().top + window.scrollY,
            behavior: 'smooth' // Esto hace que el scroll sea suave.
        });

        await sleep(3000);
        // Simula clic en el checkbox de términos y condiciones
        const checkbox = document.querySelector('#idCheckLegalContactar');
        // Verifica si el checkbox existe y no está marcado antes de hacer clic
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }
        secondHeader.remove()
        const captchaCoords = captcha.getBoundingClientRect()
        await sleep(2000);

        chrome.runtime.sendMessage({action: "captureThisTab"}, function(base64String) {
            console.log('caixa', captchaCoords)
            const sx = captchaCoords.left*1.5; // Origen X en la imagen de origen para el recorte
            const sy = captchaCoords.top*1.5; // Origen Y en la imagen de origen para el recorte
            const sWidth = captchaCoords.width*1.5; // Ancho del recorte
            const sHeight = captchaCoords.height*1.5; // Alto del recorte

            console.log('capturando');
            const img = new Image();
            img.src = base64String.result;

            img.onload = () => {
                // Ajusta el tamaño del canvas a las dimensiones del recorte si deseas
                canvas.width = sWidth/1.5;
                canvas.height = sHeight/1.5;

                // Dibuja el recorte en el canvas
                // Los últimos cuatro argumentos determinan dónde y qué tan grande se dibujará el recorte en el canvas
                // En este caso, se dibuja en todo el canvas, manteniendo las proporciones originales
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            };

            img.onerror = function(e) {
                console.error('Error al cargar la imagen.');
                console.log(e);
            };
        });
    }





/*
    if (!logedInElement) {
        // Llena los campos del formulario

        simulateInput(document.querySelector('#Email'), '');



        await sleep(3000)
        //Boton enviar
        document.querySelector('#submitSolicitudes').click()

        await sleep(3000)



    } else {
        console.log('voay a pillar el boton para enseñar el telefono')
        const botonTelef = document.querySelector('.re-ContactDetail-showPhone .sui-AtomButton-text')
        console.log(botonTelef)
        botonTelef.click()
        await sleep(3000)
    }


    const telfonoElement = document.querySelector('.contactotelf');
    const nombreElement = document.querySelector('.re-ContactDetail-particularName')
    await sleep(3000)
    const telefono = telfonoElement.textContent || telfonoElement.innerText; // Obtenemos el contenido del elemento
    const textoCompleto = nombreElement.textContent || nombreElement.innerText; // Obtenemos el contenido del elemento
    const nombre = textoCompleto.replace('particular: ', '').trim();


    console.log({nombre: nombre, telefono: telefono})

 */
}

doTheJob().then();