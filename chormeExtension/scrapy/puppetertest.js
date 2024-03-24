const puppeteer = require('puppeteer');

async function simulateInput(page, selector, value) {
    await page.evaluate((selector, value) => {
        const element = document.querySelector(selector);
        let lastValue = element.value;
        element.value = value;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = element._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
    }, selector, value);
}

async function doTheJob(page) {
    await page.waitForTimeout(6000); // Sleep
    const isLoggedIn = await page.evaluate(() => {
        const logedInElement = document.querySelector('.re-SharedTopbar-loginButton-wrapper');
        const texto = logedInElement.textContent || logedInElement.innerText;
        return texto !== 'Acceder';
    });

    if (!isLoggedIn) {
        // Fill form fields
        await simulateInput(page, '.re-Form-input[data-e2e="field-name"]', 'jordi');
        await simulateInput(page, '.re-Form-input[data-e2e="field-mail"]', 'jordi.wow@gmail.com');
        await simulateInput(page, '.re-Form-input[data-e2e="field-phone"]', '698758745');
        await page.select('.sui-FormSelect.re-Form-select', '2'); // Assuming '2' is the value of the option
        await page.waitForTimeout(3000); // Sleep
        await page.click('#idFormContactDetail-aside');
        await page.waitForTimeout(3000); // Sleep
        await page.click('#App > div.re-Page > main > div.re-LayoutContainer.re-LayoutContainer--large > div.re-ContentDetail-topContainer > section > div > div.re-ContactDetailFormContainer > div:nth-child(2) > div > form > div:nth-child(7) > button');
        await page.waitForTimeout(6000); // Sleep
        await page.click('#modal-react-portal > div > div > div.sui-MoleculeModal-no-header > button');
        await page.waitForTimeout(3000); // Sleep
    } else {
        console.log('Going to click the button to show the phone');
        await page.click('.re-ContactDetail-showPhone .sui-AtomButton-text');
        await page.waitForTimeout(3000); // Sleep
    }

    // Fetch and log phone number
    const telefono = await page.evaluate(() => {
        const telfonoElement = document.querySelector('.re-ContactDetail-phone');
        return telfonoElement.textContent || telfonoElement.innerText;
    });
    console.log('Phone number:', telefono);
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('YOUR_TARGET_URL'); // Replace YOUR_TARGET_URL with the actual URL
    await doTheJob(page);
    // await browser.close(); Uncomment to close the browser when done
})();