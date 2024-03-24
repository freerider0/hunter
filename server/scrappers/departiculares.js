import cheerio from 'cheerio';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {pool} from '../postgres.js'
import util from 'util';


// Función para cargar el HTML desde una URL
async function fetchHTML(url) {
    const { data } = await axios.get(url);
    return data;
}

// Función para limpiar las URLs de fotocasa y habitaclia
function cleanUrl(url) {
    if (url.includes('fotocasa.es') || url.includes('habitaclia.com')) {
        return url.split('?')[0]; // Elimina todo después del signo '?'
    }
    return url; // Devuelve la URL sin cambios si no es de fotocasa o habitaclia
}

// Función para extraer el dominio principal de una URL
function getDomain(url) {
    const matches = url.match(/^https?:\/\/([^\/]+)/);
    if (matches && matches.length > 1) {
        return matches[1]; // Devuelve el dominio principal
    }
    return null; // Devuelve null si no se puede extraer el dominio
}


async function scrapeaComunidades() {
    const html = await fetchHTML('https://www.departiculares.com/venta');
    const $ = cheerio.load(html);
    let linksAComunidades = [];
    let nombresComunidades = [];
    const comunidades = $('.app-locations'); // Assuming each comunidad is an <a> within .app-locations

    comunidades.each(function() {
        const link = $(this).attr('href'); // Extract the href attribute
        const name = $(this).text(); // Get the text content
        const cleanedName = name.replace('Venta en ', '').trim(); // Remove "Venta en " and trim
        nombresComunidades.push(cleanedName);
        linksAComunidades.push(link);
    });

    return { links: linksAComunidades, nombres: nombresComunidades };
}

function checkIfHaveNextPage(url){
    
}

async function escrapeaComunidad(comunidad){
    const html = await fetchHTML('https://www.departiculares.com/venta');
    const $ = cheerio.load(html);
}


async function insertProperty(localidad, url, imagen, short_description, long_description, precio, surface, portal, numberOfRooms, foundon) {
    const id = uuidv4();
    const query = `
        INSERT INTO property (id, localidad, url, imagen, short_description, long_description, precio, surface, portal, numberOfRooms, foundon)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    console.log('query created')
    const values = [id, localidad, url, imagen, short_description, long_description, precio, surface, portal, numberOfRooms, foundon];
    console.log(values)
    try {
        const result = await pool.query(query, values);
        console.log('Property inserted successfully');
    } catch (err) {
        console.log(values)
        console.error(util.inspect(err)); // Using util.inspect to handle circular references
    }
};

// Función principal para extraer los datos
async function extractData(html) {
    try {
        const $ = cheerio.load(html);
        const dataItems = [];
        const failedItems = []; // Para almacenar los elementos que fallaron

        $('.list-result-item.app-marker.app-links').each(async (index, element) => {
            try {
                const scriptContent = $(element).find('script[type="application/ld+json"]').html().trim();
                if (scriptContent) { // Asegura que el contenido del script no esté vacío
                    const jsonData = JSON.parse(scriptContent);
                    // Extrae el precio y el nombre de la localidad
                    const priceText = $(element).find('.details-price').contents().first().text().trim();
                    const localityName = $(element).find('.list-result-locality-name').text().trim();
                    // Opcional: procesar priceText para extraer solo el número
                    const price = priceText.replace(/[^\d]/g, ''); // Elimina todos los caracteres no numéricos
                    const data = {
                        name: jsonData.name,
                        description: jsonData.description,
                        floorSize: jsonData.floorSize.value,
                        url: cleanUrl(jsonData.url),
                        site: getDomain(jsonData.url),
                        photoUrl: jsonData.photo.url,
                        geo: {
                            latitude: jsonData.geo.latitude,
                            longitude: jsonData.geo.longitude
                        },
                        price: price,
                        localityName: localityName,
                        numberOfRooms: jsonData.numberOfRooms

                    };
                    const foundOn = new Date(); // This will use the current date and time
                        //dataItems.push(data)
                     console.log('inserting', data.name)
                     await insertProperty(data.localityName, data.url, data.photoUrl, data.name, data.description, data.price, data.floorSize, data.site, data.numberOfRooms, foundOn)
                }
            } catch (error) {
                //console.error(`Error parsing JSON for element at index ${index}:`, error);
                // Opcional: agregar una referencia al elemento que causó el error
                failedItems.push({index, error: error.toString(), html: $(element).html().substring(0, 200)}); // Almacenar una porción del HTML para revisión
            }
        });

        if (failedItems.length > 0) {
            //console.log('Failed items:', failedItems); // Muestra información sobre los elementos fallidos
        }
        return dataItems
    } catch (error) {
        console.error('Error extracting data:', error);
    }
}

// Get next link
function getNextPageUrl(html) {
    const $ = cheerio.load(html);
    const nextPageLink = $('ul.pager li a').last();

    if (nextPageLink.text() === '>') {
        return nextPageLink.attr('href');
    } else {
        return null;
    }
}

// Función de retraso
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Función recursiva para recorrer todas las páginas
async function scrapeAllPages(startUrl) {
    let url = 'https://www.departiculares.com/venta/barcelona?order=inserted';

    while (url) {
        console.log(`Fetching page: ${url}`);
        const response = await fetch(url);

        const html = await response.text();

        console.log(html)

        if (html) {
            // Aquí puedes procesar el contenido de la página como necesites
            // Por ejemplo, extraer ciertos datos de la página
            await extractData(html)

            // Busca la URL de la próxima página
            const nextPageUrl = getNextPageUrl(html);
            url = nextPageUrl;
            const randomDelay = Math.random() * (5000 - 1000) + 1000; // Genera un número aleatorio entre 1000 ms (1 segundo) y 5000 ms (5 segundos)
            await delay(randomDelay);
        } else {
            // Si no se puede obtener el HTML, rompe el bucle
            break;
        }
    }

    console.log('Finished scraping all pages.');
}

// Exportar la función para su uso en otro lugar
export { extractData, scrapeaComunidades, scrapeAllPages };
