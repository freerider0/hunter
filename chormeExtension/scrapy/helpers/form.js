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


function simulateSelect(element, value) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true })); // Disparar evento change
    element.dispatchEvent(new Event('input', { bubbles: true })); // Por si acaso el framework escucha eventos input en select
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function simulateMouseEvent(element, eventName) {
    if (element) {
        const mouseEvent = new MouseEvent(eventName, {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(mouseEvent);
    }
}

function simulateClick(element) {
    simulateMouseEvent(element, 'mouseover'); // El cursor "entra" al elemento
    simulateMouseEvent(element, 'mousedown'); // Presión del botón del mouse
    simulateMouseEvent(element, 'mouseup'); // Liberación del botón del mouse
    simulateMouseEvent(element, 'click'); // Un clic completo
}
