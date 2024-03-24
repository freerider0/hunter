import { MongoClient } from 'mongodb';

// URI de conexión a MongoDB
const uri = "mongodb://rumech:1234@127.0.0.1:27017";
// Cliente MongoDB global
let _client;

async function connectToDatabase() {
    if (!_client) {
        _client = new MongoClient(uri);
        await _client.connect();
    }
    return _client;
}

async function getMongoDatabase(dbName) {
    const client = await connectToDatabase();
    return client.db(dbName);
}

// Exportar la función que necesitas para obtener la base de datos
export { getMongoDatabase };