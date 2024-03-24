

function simulateInput(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event('input', { bubbles: true });
    // Hack React15
    event.simulated = true;
    // Hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
}

// Llena los campos del formulario
simulateInput(document.querySelector('.re-Form-input[data-e2e="field-name"]'), 'jordi');
simulateInput(document.querySelector('.re-Form-input[data-e2e="field-mail"]'), 'jordi.wow@gmail.com');
simulateInput(document.querySelector('.re-Form-input[data-e2e="field-phone"]'), '698758745');

// Cambia el select manualmente y después prueba cambiar otros valores con simulateInput para ver si se preservan
function simulateSelect(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true })); // Disparar evento change
    element.dispatchEvent(new Event('input', { bubbles: true })); // Por si acaso el framework escucha eventos input en select
}

// Función para simular clic en un checkbox
function simulateClick(element) {
    element.click(); // Esto debería ser suficiente para la mayoría de los checkboxes, pero verifica si necesitas eventos adicionales
}

// Función para simular clic en un checkbox después de esperar un tiempo
function simulateClickAfterDelay(element, delay) {
    setTimeout(() => {
        element.click(); // Realiza el clic después del retraso especificado
    }, delay);
}

// Selecciona el motivo de contacto y dispara los eventos necesarios para que el framework lo reconozca
simulateSelect(document.querySelector('.sui-FormSelect.re-Form-select'), '2');

// Simula clic en el checkbox de términos y condiciones
simulateClickAfterDelay(document.querySelector('#idFormContactDetail-aside'), 2000);

//simulateClickAfterDelay(document.querySelector('.re-FormContact-submit'), 4000);


const phoneElement = document.querySelector('.re-ContactDetail-phone');