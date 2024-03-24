import pg from "pg";

// Correctly initialize the pool with configuration parameters
console.log(process.env.PG_PASSWORD,)
const pool = new pg.Pool({
    user: "rumech",
    host: "127.0.0.1",
    database: "captador",
    password: '1234',
    port: '5432',
});


export async function insertProperty(property) {
    console.log(property)
    // Construct the INSERT query dynamically based on the property object
    const fields = Object.keys(property).join(', ');
    const values = Object.values(property);
    const valuePlaceholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
    INSERT INTO property (${fields})
    VALUES (${valuePlaceholders})
    RETURNING platform_hash;`;

    try {
        const res = await pool.query(query, values);
        console.log('Inserted property with ID:', res.rows[0].platform_hash);
        return res.rows[0].platform_hash
    } catch (err) {
        console.error('Error inserting property:', err.message);
    }
}


export async function insertFeatures(propertyHash, featuresArray) {
    // Preparar el array de objetos con 'property_platform_hash' y 'feature' para cada característica
    const preparedFeatures = featuresArray.map(feature => ({
        property_platform_hash: propertyHash,
        feature: feature
    }));

    // Convertir el array preparado en una cadena JSON
    const featuresJson = JSON.stringify(preparedFeatures);

    // Asegúrate de que el cliente o pool de PostgreSQL esté definido y disponible en este contexto
    // Por ejemplo, const { Pool } = require('pg');
    // const pool = new Pool(configuraciónDeConexión);

    // Consulta SQL utilizando jsonb_array_elements y pasando la cadena JSON directamente
    const query = `
WITH data(json_data) AS (
    VALUES 
    ($1::jsonb)
)
INSERT INTO features (property_platform_hash, feature)
SELECT 
    (p->>'property_platform_hash') as property_platform_hash, 
    (p->>'feature') as feature
FROM data, jsonb_array_elements(json_data) as p;
`;

    // Ejecutar la consulta con el array de características como parámetro
    try {
        const res = await pool.query(query, [featuresJson]);
        console.log('Inserted features:', res.rowCount);
    } catch (err) {
        console.error('Error inserting features:', err.message);
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
