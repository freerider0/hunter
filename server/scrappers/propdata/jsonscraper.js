import fetch from 'node-fetch';
import {insertProperty, insertFeatures, insertImages} from "../../databaseScarper.js";
import {getMongoDatabase} from "../../databases/mongodb/client.js";
import Bottleneck from 'bottleneck';

// Crea una instancia de Bottleneck
const limiter = new Bottleneck({
    maxConcurrent: 15, // Número máximo de trabajos concurrentes (opcional)
    minTime: 1000 // Espera al menos 1000 ms entre cada tarea
});

// Envuelve tu función fetch con el limitador
const limitedFetch = limiter.wrap(fetch);



async function scrapeResultsPage(step){
    const url = 'https://v2.sys.alfredo.pt/prospect/search';
    const method = 'POST';
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'es-ES,es;q=0.9',
        'Authorization': 'Bearer TMgarhDOOVlZTdlw9CDZgj2ZgZSWVquvmlaEUtM3ZQyK1dbVV0W1WadSTt7cUKs7',
        'Content-Type': 'application/json',

        'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    };

    const body = JSON.stringify({
        "filters": {

            "addType": ["sell"],

        },
        "origin": "es",
        "step": step,
        "orderBy": "date"
    });
    try{
        const paginationResponse = await limiter.schedule(() => fetch(url, { method, headers, body }));
        const paginationResponseJson = await paginationResponse.json()
        console.log(paginationResponseJson)
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');
        for (const item of paginationResponseJson.data) {
            // Asumiendo que necesitas extraer el hash de cada 'item' en tu array 'paginationResponseJson'
            const hash = item.platform_hash; // Ajusta esto según la estructura de tu objeto 'item'
            const documento = { listing:{platform_hash: hash }, scraped: false, scrapingDate: new Date()};
            try {
               // await collection.insertOne(documento);
            } catch (error) {
                console.error('Error al insertar hash:', error);
            }
        }
    }
    catch(e){
        console.error('Error:', e)
    }
}

//Aquesta url te un bug y no analitza el 'Authorization': 'Bearer XmoBRdC8PnEW1cAyNAX+yFlOPJrSa5c6pkpfwD99rnXyrhB82DgxOD+z087sWLss',
async function scrapePropertyPage(doc){
    const platformHash = doc//.listing.platform_hash
    const urlProperty = 'https://v2.sys.alfredo.pt/prospect/'+platformHash;
    const urlPropertyMarket = 'https://v2.sys.alfredo.pt/prospect/'+platformHash+'/market_data';
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'es-ES,es;q=0.9',
            'Origin': 'https://dashboard.propdata.es',
            'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
    };
    try{
        const propertyRequest = await limiter.schedule(() => fetch(urlProperty, options));
        const propertyMarketRequest = await limiter.schedule(() => fetch(urlPropertyMarket, options));

        const propertyJson = await propertyRequest.json()
        const propertyMarket = await propertyMarketRequest.json()

        const fullProperty = {...propertyJson, ...propertyMarket}
        //console.log(fullProperty)
        /*
              const responseJsonClone = structuredClone(responseJson)
              delete responseJsonClone.listing.zonesIDs
              delete responseJsonClone.listing.images
              delete responseJsonClone.listing.originalImages
              delete responseJsonClone.listing.subFeatures
              delete responseJsonClone.listing.collection
              delete responseJsonClone.listing.prospectLead
              const propertyHash = await insertProperty(responseJsonClone.listing)
              await insertFeatures(propertyHash, responseJson.listing.subFeatures)
              await insertImages(propertyHash, 'self-hosted', responseJson.listing.images)
              await insertImages(propertyHash, 'original-source', responseJson.listing.originalImages)
        */
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');
        //await collection.insertOne(fullProperty);
        //console.log("Documento insertado en miBaseDeDatos.miColeccion");


        // Actualiza el documento basándote en 'listing.platform_hash'
       await collection.updateOne(
            { "listing.platform_hash": doc.listing.platform_hash },
            { $set: { comunidadAutonoma: 'cat', scraped: true, scrapingDate: new Date(), ...fullProperty } }
        );

    }
    catch(error){
        console.error('Error:', error)
    }

}

async function fetchUnscrapedProperties(maxProperties) {
    const db = await getMongoDatabase('propdata');
    const collection = db.collection('property');

    let processed = 0; // Contador de propiedades procesadas.

    try {
        while (processed < maxProperties) {
            // Calcula cuántos documentos buscar en esta iteración.
            const limit = Math.min(20, maxProperties - processed);
            const documents = await collection.find({ scraped: false }).limit(limit).toArray();

            // Si no hay documentos no procesados, sal del bucle.
            if (documents.length === 0) {
                console.log("No hay más propiedades sin procesar.");
                break;
            }

            for (const doc of documents) {
                console.log('properties processed: '+processed)
                await scrapePropertyPage(doc); // Asume que esta función procesa cada propiedad individualmente.
                processed++;

                // Salir del bucle for si se alcanza el máximo especificado mientras se procesan los documentos.
                if (processed >= maxProperties) {
                    console.log("Se alcanzó el máximo de propiedades especificado para procesar.");
                    break;
                }
            }
        }
        console.log("Proceso completado. Propiedades procesadas:", processed);
    } catch (error) {
        console.error('Error:', error);
    }
}



async function scrapeAllResultsPages() {
    for (let i = 0; i < 598; i++) {
        await scrapeResultsPage(i);
        console.log('scraped step: '+i)
    }
}

//fetchUnscrapedProperties(100).then(()=>console.log('scraped done'))
//scrapeAllResultsPages().then(() => console.log('Scraping done'));

scrapePropertyPage('MzMyMTcyMzI6cHQtaWRlYQ==').then()
//scrapeResultsPage(1).then()