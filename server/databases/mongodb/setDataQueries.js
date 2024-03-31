import {getMongoDatabase} from "./client.js";
import {ObjectId} from "mongodb";

export async function setPropertiesReadyForSearchForContactDetails(hashes) {
    try {
        console.log(hashes)
        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');



        const updates = hashes.map(hash => {
            const id = new ObjectId(hash);

            return coleccion.updateOne(
                { '_id': id },
                { $set: { needLookForContactDetails: true } }
            );
        });

        await Promise.all(updates);

        return 'ok';
    } catch (error) {
        console.error('Error updating contact details:', error);
        return { status: 500, message: 'Internal server error' }
    }
}


export async function setNameAndPhone({ name, phone, id }) {
    try {
        console.log({ name, phone, id });
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        // Asegurarse de que 'id' es un ObjectId válido
        const objectId = new ObjectId(id);

        // Realizar la actualización
        const result = await collection.updateOne(
            { '_id': objectId },
            { $set: { name: name, phone: phone } }
        );

        console.log(result); // Opcional: Para depuración, muestra el resultado de la operación

        return result.matchedCount > 0 ? 'ok' : 'No se encontró el registro con el id proporcionado';
    } catch (error) {
        console.error('Error updating contact details:', error);
        return { status: 500, message: 'Internal server error' };
    }
}

export async function setNameAndPhoneByUrl(data) {
    try {
        console.log('data');

        console.log(data);
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        // Asegurarse de que 'id' es un ObjectId válido

        // Realizar la actualización
        const result = await collection.updateOne(
            { 'listing.link': data.url },
            { $set: { name: data.nombre.trim(),  phone: data.telefono.trim() } }
        );

        console.log(result); // Opcional: Para depuración, muestra el resultado de la operación

        return result.matchedCount > 0 ? 'ok' : 'No se encontró el registro con el id proporcionado';
    } catch (error) {
        console.error('Error updating contact details:', error);
        return { status: 500, message: 'Internal server error' };
    }
}