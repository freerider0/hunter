import {pool} from "../../postgres.js";





export async function insertAds(propertyId, adsArray) {
    let queryText = 'INSERT INTO ads(property_id, agencyOfficialName, enteredMarket, grossArea, link, live, numberOfRooms, platform_hash, price, terrainArea, usefulArea) VALUES ';

    // Preparar los valores y los placeholders para la consulta, incluyendo el property_id
    const values = [];
    const placeholders = adsArray.map((ad, index) => {
        const startIndex = index * 11 + 1; // Ajustar según el número de columnas + property_id
        values.push(propertyId, ad.agencyOfficialName, ad.enteredMarket, ad.grossArea, ad.link, ad.live, ad.numberOfRooms, ad.platform_hash, ad.price, ad.terrainArea, ad.usefulArea);
        return `($${startIndex}, $${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3}, $${startIndex + 4}, $${startIndex + 5}, $${startIndex + 6}, $${startIndex + 7}, $${startIndex + 8}, $${startIndex + 9}, $${startIndex + 10})`;
    }).join(', ');

    queryText += placeholders + ' RETURNING id;';

    try {
        const res = await pool.query(queryText, values);
        console.log('Inserted ads with IDs:', res.rows.map(row => row.id));
    } catch (err) {
        console.error('Error inserting ads:', err.message);
    }
}

export async function insertImages(propertyPlatformHash, imageSource, imageArray) {
    let queryText = 'INSERT INTO images(property_platform_hash, image_source, image_reference) VALUES ';

    // Preparar los valores y los placeholders para la consulta, incluyendo el property_platform_hash y image_source
    const values = [];
    const placeholders = imageArray.map((imageReference, index) => {
        const startIndex = index * 3 + 1; // Ajustar el índice para los placeholders
        values.push(propertyPlatformHash, imageSource, imageReference); // Agregar el property_platform_hash y image_source para cada referencia
        return `($${startIndex}, $${startIndex + 1}, $${startIndex + 2})`;
    }).join(', ');

    queryText += placeholders + ' RETURNING id;';

    try {
        const res = await pool.query(queryText, values);
        console.log('Inserted image references with IDs:', res.rows.map(row => row.id));
    } catch (err) {
        console.error('Error inserting image references:', err.message);
    }
}


export async function insertSimilarProperties(propertyId, similarPropertiesArray) {
    let queryText = 'INSERT INTO similar_property(property_id, live, numberOfRooms, daysOnMarket, grossArea, usefulArea, terrainArea, price, pricePerSq, latitude, longitude, distance, ad3, platform_hash, link) VALUES ';

    // Preparar los valores y los placeholders para la consulta
    const values = [];
    const placeholders = similarPropertiesArray.map((property, index) => {
        const startIndex = index * 15 + 1; // Ajustar el índice para los placeholders
        values.push(
            propertyId,
            property.live,
            property.numberOfRooms,
            property.daysOnMarket,
            property.grossArea,
            property.usefulArea,
            property.terrainArea,
            property.price,
            property.pricePerSq,
            property.latitude,
            property.longitude,
            property.distance,
            property.ad3,
            property.platform_hash,
            property.link
        );
        return `($${startIndex}, $${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3}, $${startIndex + 4}, $${startIndex + 5}, $${startIndex + 6}, $${startIndex + 7}, $${startIndex + 8}, $${startIndex + 9}, $${startIndex + 10}, $${startIndex + 11}, $${startIndex + 12}, $${startIndex + 13}, $${startIndex + 14})`;
    }).join(', ');

    queryText += placeholders + ' RETURNING id;';

    try {
        const res = await pool.query(queryText, values);
        console.log('Inserted similar properties with IDs:', res.rows.map(row => row.id));
    } catch (err) {
        console.error('Error inserting similar properties:', err.message);
    }
}