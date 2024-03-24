import {getMongoDatabase} from "../../databases/mongodb/client.js";
import Bottleneck from 'bottleneck';
import { scrapePropertyPage } from './scrapePropertyPage.js';

const limiter = new Bottleneck({
    maxConcurrent: 8, // Controla la concurrencia de operaciones de scraping
});

async function fetchUnscrapedProperties(maxProperties) {
    const db = await getMongoDatabase('propdata');
    const collection = db.collection('property');
    let processed = 0;

    console.time("fetchUnscrapedProperties");

    try {
        while (processed < maxProperties) {
            const limit = Math.min(1000, maxProperties - processed);
            const documents = await collection.find({ scraped: false }).limit(limit).toArray();

            if (documents.length === 0) {
                console.log("No hay más propiedades sin procesar.");
                break;
            }

            // Programa todas las tareas sin esperar por cada una individualmente
            const scrapeTasks = documents.map(doc => limiter.schedule(() => scrapePropertyPage(doc)));
            await Promise.all(scrapeTasks);


            processed += documents.length;
            console.log(`Procesadas ${processed} propiedades de ${maxProperties}`);
            if (processed >= maxProperties) break;
        }
        console.log("Proceso completado. Propiedades procesadas:", processed);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.timeEnd("fetchUnscrapedProperties");
    }
}


fetchUnscrapedProperties(15000).then(() => console.log('Scraping terminado'));