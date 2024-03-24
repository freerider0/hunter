import fetch from 'node-fetch';
import cheerio from 'cheerio';

const URL = 'https://www.fotocasa.es/indice-precio-vivienda/barcelona-capital/todas-las-zonas';

// Simula las cabeceras de un navegador
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
};

async function fetchData(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });
    const body = await response.text();
    return body;
}

function logError(section, error) {
    console.error(`Error extrayendo ${section}:`, error.message);
}

function safeText($, element) {
    return element ? $(element).text().trim() : '';
}

function extractDetails($, container) {
    const details = [];
    container.find('.b-detail').each((i, elem) => {
        try {
            const tipo = $(elem).find('.b-detail_text').text().trim();
            const valor = $(elem).find('.b-detail_title').text().trim();
            details.push({ tipo, valor });
        } catch (error) {
            logError('detalles', error);
        }
    });
    return details;
}

function extractPrecioM2PorNumeroDeHabitaciones($, container) {
    const data = [];
    container.find('.description-wrap').first().find('.description-item').each((i, elem) => {
        try {
            const precio = $(elem).find('.description-item_semibold').text().trim();
            const habitaciones = $(elem).find('.description-item_regular').text().trim();
            data.push({ habitaciones, precio });
        } catch (error) {
            logError('precio m² por número de habitaciones', error);
        }
    });
    return data;
}

function extractValorMedioDeLaViviendaPorTamaño($, container) {
    const data = [];
    const titles = container.find('h3.t-panel_subtitle').filter((i, el) => $(el).text().includes('Valor medio de la vivienda por tamaño'));
    titles.next('.description-item').each((i, elem) => {
        try {
            const precio = $(elem).find('.description-item_semibold').text().trim();
            const tamaño = $(elem).find('.description-item_regular').text().trim();
            data.push({ tamaño, precio });
        } catch (error) {
            logError('valor medio de la vivienda por tamaño', error);
        }
    });
    return data;
}

function extractPrecioM2PorCaracterísticas($, container) {
    const data = [];
    const features = container.find('h3.t-panel_subtitle').filter((i, el) => $(el).text().includes('Precio m² por características'));
    features.next('.description-wrap').find('.description-item').each((i, elem) => {
        try {
            const precio = $(elem).find('.description-item_semibold').text().trim();
            const característica = $(elem).find('.description-item_regular').text().trim();
            data.push({ característica, precio });
        } catch (error) {
            logError('precio m² por características', error);
        }
    });
    return data;
}

function extractOfertasActivasDeComprar($, container) {
    let resultado = {};
    try {
        const ofertas = container.find('h3.t-panel_subtitle:contains("Ofertas activas de comprar")').next('.description-item_regular');
        resultado = {
            inmuebles_en_venta: ofertas.text().trim(),
            enlace: ofertas.find('a').attr('href')
        };
    } catch (error) {
        logError('ofertas activas de comprar', error);
    }
    return resultado;
}

function extractCaracterísticasMásComunes($, container) {
    const características = [];
    const commonFeatures = container.find('h3.t-panel_subtitle').filter((i, el) => $(el).text().includes('Características más comunes'));
    commonFeatures.next('.description-wrap').find('.description-item').each((i, elem) => {
        try {
            const valor = $(elem).find('.description-item_semibold').text().trim();
            const característica = $(elem).find('.description-item_regular').text().trim();
            características.push({ característica, valor });
        } catch (error) {
            logError('características más comunes', error);
        }
    });
    return características;
}

async function extractPricesDataFotocasa(url) {
    try {
        const html = await fetchData(url);
        const $ = cheerio.load(html);
        const container = $('.t-panel.comprar');

        if (!container.length) {
            console.warn('No se encontró el contenedor `.t-panel.comprar`.');
            return {};
        }

        const resultado = {
            titulo: safeText($, container.find('.t-panel_title')),
            detalles: extractDetails($, container),
            precio_m2_por_numero_de_habitaciones: extractPrecioM2PorNumeroDeHabitaciones($, container),
            valor_medio_de_la_vivienda_por_tamaño: extractValorMedioDeLaViviendaPorTamaño($, container),
            precio_m2_por_características: extractPrecioM2PorCaracterísticas($, container),
            ofertas_activas_de_comprar: extractOfertasActivasDeComprar($, container),
            características_más_comunes: extractCaracterísticasMásComunes($, container)
        };

        console.log(JSON.stringify(resultado, null, 2));
    } catch (error) {
        console.error('Error al extraer los datos:', error);
    }
}

async function locationSuggestFotocasa(query) {
    try {
        const response = await fetch(`https://www.fotocasa.es/indice-precio-vivienda/ac/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // Commonly used User-Agent, but you should replace it with the one that suits your use case
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let processedResults = [];
        if (data && Array.isArray(data)) {
            data.forEach((result) => {
                processedResults.push({ value: `https://www.fotocasa.es${result.value}`, label: result.label });
            });
        } else {
            console.log("The response data is not an array.");
        }

        return processedResults;

    } catch (error) {
        console.error('Error extracting data:', error);
    }
}


export {extractPricesDataFotocasa,  locationSuggestFotocasa};
