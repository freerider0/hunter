import {getMongoDatabase} from "../../databases/mongodb/client.js";

const db = await getMongoDatabase('propdata'); // Asume que esta función te conecta correctamente a tu base de datos
const collection = db.collection('property');

try {
    // Actualiza todos los documentos donde scraped es true, estableciendo scraped a false
    const updateResult = await collection.updateMany(
        { scraped: true }, // Filtro: selecciona documentos con scraped igual a true
        { $set: { scraped: false } } // Acción: establece scraped a false
    );

    console.log(`${updateResult.matchedCount} documentos encontrados.`);
    console.log(`${updateResult.modifiedCount} documentos actualizados.`);
} catch (error) {
    console.error('Error al actualizar documentos:', error);
}
