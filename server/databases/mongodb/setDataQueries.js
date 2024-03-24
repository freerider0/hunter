import {getMongoDatabase} from "./client.js";

export async function setPropertiesReadyForSearchForContactDetails(hashes) {
    try {

        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');



        const updates = hashes.map(hash => {
            return coleccion.updateOne(
                { 'listing.platform_hash': hash },
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
