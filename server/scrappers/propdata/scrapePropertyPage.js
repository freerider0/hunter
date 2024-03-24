// Importa fetch directamente, sin necesidad de envolverlo con Bottleneck aquí.
import fetch from 'node-fetch';
import {getMongoDatabase} from "../../databases/mongodb/client.js";

async function scrapePropertyPage(doc) {
    const platformHash = doc.listing.platform_hash;
    const urlProperty = `https://v2.sys.alfredo.pt/prospect/${platformHash}`;
    const urlPropertyMarket = `https://v2.sys.alfredo.pt/prospect/${platformHash}/market_data`;
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

    try {
        const propertyRequest = await fetch(urlProperty, options);
        const propertyMarketRequest = await fetch(urlPropertyMarket, options);

        const propertyJson = await propertyRequest.json();
        const propertyMarket = await propertyMarketRequest.json();

        const fullProperty = { ...propertyJson, ...propertyMarket };

        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        await collection.updateOne(
            { "listing.platform_hash": platformHash },
            { $set: { ...fullProperty, comunidadAutonoma: 'cat', scraped: true, scrapingDate: new Date() } },
            { upsert: true }
        );

    } catch (error) {
        console.error('Error en scrapePropertyPage:', error);
    }
}

export { scrapePropertyPage };