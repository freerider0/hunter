import { getMongoDatabase } from "./client.js";


async function deleteIt(){
    const db = await getMongoDatabase('propdata');



    db.collection('property').deleteMany({
        "listing.ad2": { $exists: false }
    });
    console.log('Documentos');

}


deleteIt().then(() => console.log('Base de datos actualizada'));