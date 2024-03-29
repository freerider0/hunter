import {getMongoDatabase} from "./client.js";
import fs from 'fs'

export async function getTotalPriceOfAllProperties() {
    try {
        // Conectando al servidor de MongoDB
        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');

        coleccion.aggregate([
            {
                $group: {
                    _id: null, // Agrupa todos los documentos sin importar su _id
                    total: { $sum: "$listing.price" } // Suma los valores de price
                }
            }
        ])
    } catch (err) {
        console.error('Ocurrió un error al obtener las zonas distintas:', err);
    } finally {
        // Cerrando la conexión con el servidor de MongoDB
    }
}

export async function obtenerPlataformasDistintas() {
    try {
        // Conectando al servidor de MongoDB
        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');

        // Obteniendo las zonas distintas
        const plataformasDistintas = await coleccion.distinct('listing.ad3');
        console.log('Zonas distintas:', zonasDistintas);
        return(zonasDistintas)
    } catch (err) {
        console.error('Ocurrió un error al obtener las zonas distintas:', err);
    } finally {
        // Cerrando la conexión con el servidor de MongoDB
    }
}
export async function obtenerZonasDistintas() {
    try {
        // Conectando al servidor de MongoDB
        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');

        // Obteniendo las zonas distintas
        const zonasDistintas = await coleccion.distinct('listing.ad3');
        return({data: zonasDistintas})
    } catch (err) {
        console.error('Ocurrió un error al obtener las zonas distintas:', err);
    } finally {
        // Cerrando la conexión con el servidor de MongoDB
    }
}

export async function getPropertyTypes() {
    try {
        // Conectando al servidor de MongoDB
        const db = await  getMongoDatabase('propdata');

        const coleccion = db.collection('property');

        // Obteniendo las zonas distintas
        const propertyTypes = await coleccion.distinct('listing.assetType');
        return({data: propertyTypes})
    } catch (err) {
        console.error('Ocurrió un error al obtener las zonas distintas:', err);
    } finally {
        // Cerrando la conexión con el servidor de MongoDB
    }
}



export async function getProperties({page, limit, filters, sorting}) {

    limit = parseInt(limit, 10) || 100; // Default to 100 items per page
     page = parseInt(page, 10) || 0; // Default to page 1
    limit = limit > 100 ? 100 : limit; // Limit max items per page to 100
    const offset = (page) * limit;

    try {
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        // Building the query dynamically
        let query = {};
        if(filters){
            const filtersBase64 = filters;

            // Decodificar de Base64 a una cadena UTF-8
            const filtersJSON = Buffer.from(filtersBase64, 'base64').toString('utf-8');

            // Decodificar la percent-encoding de URI
            const decodedFiltersJSON = decodeURIComponent(filtersJSON);

            // Convertir la cadena JSON decodificada en un objeto JavaScript
            const filtersObj = JSON.parse(decodedFiltersJSON);


            if (filtersObj.localidad) {
                query['listing.ad3'] = filtersObj.localidad;
            }

            if (filtersObj.precioMin) {
                query['price'] = { $gte: parseInt(filtersObj.precioMin, 10) };
            }

            if (filtersObj.precioMax) {
                query['price'] = { ...query['price'], $lte: parseInt(filtersObj.precioMax, 10) };
            }

            if (filtersObj.portal) {
                // Assuming 'portal' is a field or you have a way to filter by portal
                query['portal'] = filtersObj.portal; // Replace 'portalField' with the actual field name
            }

            if (filtersObj.abstenerse) {
                // Assuming 'abstenerse' is a field or you have a way to filter by it
                query['abstenerse'] = filtersObj.abstenerse; // Replace 'abstenerseField' with the actual field name
            }
            if (filtersObj.propertyType) {
                query['listing.assetType'] = filtersObj.propertyType;
            }
        }


        let sortingQuery = null
        if(sorting){
            sortingQuery = {}
            // Ejemplo de cómo obtener la cadena Base64 desde una URL o parámetro de consulta
            // Supongamos que sortingBase64 es la cadena que recibes
            const sortingBase64 = sorting;

            // Decodificar de Base64 a una cadena UTF-8
            const sortingJSON = Buffer.from(sortingBase64, 'base64').toString('utf-8');

            // Decodificar la percent-encoding de URI
            const decodedSortingJSON = decodeURIComponent(sortingJSON);

            // Convertir la cadena JSON decodificada en un objeto JavaScript
            const sortingObj = JSON.parse(decodedSortingJSON);
            sortingObj.forEach(sort => {
                console.log(sortingObj)
                if(sort.id === "listing_price"){
                    // Asegúrate de que esta es la sintaxis correcta para tu esquema de base de datos
                    sortingQuery['listing.price'] = (sort.desc === false  ? 1:-1); // Ejemplo de asignación para orden ascendente
                }
                if(sort.id==='listing_grossArea'){
                    sortingQuery['listing.grossArea'] = (sort.desc === false  ? 1:-1); // Ejemplo de asignación para orden ascendente

                }
                if(sort.id==='localidad'){
                    sortingQuery['listing.ad3'] = (sort.desc === false  ? 1:-1); // Ejemplo de asignación para orden ascendente
                }
                if(sort.id==='listing_enteredMarket'){
                    sortingQuery['listing.enteredMarket'] = (sort.desc === false  ? 1:-1); // Ejemplo de asignación para orden ascendente

                }
            });
        }

        // Count total documents for pagination
        const total = await collection.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        let properties = null
        // Fetching properties with filters and pagination
        if(sortingQuery !== null){
             properties = await collection.find(query)
                 .sort( sortingQuery)
                .skip(offset)
                .limit(limit)
                .toArray();
        }
        else{
             properties = await collection.find(query)
                .skip(offset)
                .limit(limit)
                .toArray();
        }

        return ({
            data: properties,
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
        })

    } catch (err) {
        console.error('An error occurred:', err.message);
    } finally {
    }
}

export async function getHashOfFilteredProperties({filters}) {
    console.log(filters)
    try {
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        // Construyendo la consulta dinámicamente
        let query = {};

        if(filters){
            const filtersBase64 = filters;

            // Decodificar de Base64 a una cadena UTF-8
            const filtersJSON = Buffer.from(filtersBase64, 'base64').toString('utf-8');

            // Decodificar la percent-encoding de URI
            const decodedFiltersJSON = decodeURIComponent(filtersJSON);

            // Convertir la cadena JSON decodificada en un objeto JavaScript
            const filtersObj = JSON.parse(decodedFiltersJSON);


            if (filtersObj.localidad) {
                query['listing.ad3'] = filtersObj.localidad;
            }

            if (filtersObj.precioMin) {
                query['price'] = { $gte: parseInt(filtersObj.precioMin, 10) };
            }

            if (filtersObj.precioMax) {
                query['price'] = { ...query['price'], $lte: parseInt(filtersObj.precioMax, 10) };
            }

            if (filtersObj.portal) {
                // Assuming 'portal' is a field or you have a way to filter by portal
                query['portal'] = filtersObj.portal; // Replace 'portalField' with the actual field name
            }

            if (filtersObj.abstenerse) {
                // Assuming 'abstenerse' is a field or you have a way to filter by it
                query['abstenerse'] = filtersObj.abstenerse; // Replace 'abstenerseField' with the actual field name
            }
            if (filtersObj.propertyType) {
                query['listing.assetType'] = filtersObj.propertyType;
            }
        }

        console.log(query)

        // Realizando la consulta sin limitar los resultados y seleccionando solo el campo necesario
        const properties = await collection.find(query, { projection: { 'listing.platform_hash': 1, _id: 0 } }).toArray();


        return ({
            data: properties.map(p => p), // Transformando los resultados para devolver solo los hashes
        });

    } catch (err) {
        console.error('An error occurred:', err.message);
        throw err; // Es importante propagar el error para manejarlo en las capas superiores
    }
}


export async function getPropertyById(platformHash) {
    try {
        // Conectando al servidor de MongoDB
        const db = await  getMongoDatabase('propdata');

        const collection = db.collection('property');
        console.log(platformHash)
        const property = await collection.findOne({ "listing.platform_hash": platformHash });
        console.log(property)
        return property;


    } catch (err) {
        console.error('Ocurrió un error al obtener las propiedad:', err);
    } finally {
        // Cerrando la conexión con el servidor de MongoDB
    }
}


async function updateProperties() {
    try {
        // Conecta a la base de datos MongoDB
        const db = await getMongoDatabase('propdata');
        const collection = db.collection('property');

        // Consulta todas las propiedades
        const properties = await collection.find().toArray();

        // Palabra que quieres verificar/agregar
        const wordList=[];

        // Itera sobre todas las propiedades
        for (const property of properties) {
            console.log('analizando la propiedad', property.listing.platform_hash)
            // Verifica si la palabra ya está presente en el array
            if (property.listing.subFeatures) {
                for(let i=0; i<property.listing.subFeatures.length; i++){
                    if (wordList.includes(property.listing.subFeatures[i])) {
                        console.log("La palabra 'banana' está presente en el array.");
                    } else {
                        wordList.push(property.listing.subFeatures[i]);
                    }
                }

            } else {
            }
        }
        fs.writeFileSync('./subFeatures.json', wordList.toString());


        console.log('Todas las propiedades han sido actualizadas.');
    } catch (err) {
        console.error('Ocurrió un error al actualizar las propiedades:', err);
    }
}
