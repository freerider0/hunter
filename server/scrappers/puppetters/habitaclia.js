import puppeteer from 'puppeteer-extra'
// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time)
    });
}
const getHabitacliaPropertyData = async (url) => {
    const data = {}
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch(
        {
            headless: false, // A veces, el modo sin cabeza es más detectable
            args: ['--disable-blink-features=AutomationControlled']
        }
    );
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});



    // Navigate the page to a URL
    await page.goto('https://www.fotocasa.es/es/comprar/terreno/sabadell/can-rull/178033369/d');
        /* const contactButtonSelector = '#js-cont-superior';
         await delay(10000)
         await page.waitForSelector(contactButtonSelector);
        await page.click(contactButtonSelector);
         const inputNameSelector = 'input[name="nombre"]'
         const inputPhoneSelector = 'input[name="telefono_usuario"]'
         const inputEmailSelector = 'input[name="email"]'
         await delay(1000)
         await page.type(inputNameSelector, 'Jordi');
         await delay(1000)
         await page.type(inputPhoneSelector, '687987459');
         await delay(1000)
         await page.type(inputEmailSelector, 'jordi.elerl@gmail.com');
         await delay(1000)
         await page.click('#idLabelLegalContactar > span')
         await delay(1000)
         await page.click('#submitSolicitudes')

         // Set screen size

         /* Type into search box
         await page.type('.devsite-search-field', 'automate beyond recorder');

         // Wait and click on first result
         const contactButtonSelector = '#js-cont-superior-2';
         await page.waitForSelector(searchResultSelector);
         await page.click(searchResultSelector);

         // Locate the full title with a unique string
         const textSelector = await page.waitForSelector(
             'text/Customize and automate'
         );
         const fullTitle = await textSelector?.evaluate(el => el.textContent);

         // Print the full title
         console.log('The title of this blog post is "%s".', fullTitle);


     s
          */
    //await browser.close();
    return data
};

export default getHabitacliaPropertyData