export const getPropertyData = async (platformHash) => {
    try {
        console.log('url', 'http://164.90.182.86:3000/api/property/' + platformHash)
        const propertyDataResponse = await fetch('http://164.90.182.86:3000/api/property/' + platformHash);
        if (!propertyDataResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const propertyData = await propertyDataResponse.json();
        console.log(propertyData)
        return propertyData;
    } catch (error) {
        console.error('Error fetching property data:', error);
        throw error;
    }
};

export const getProperties = async ({pagination, sorting, filters}) => {

    let currentPageUrlParam = 0
    let itemsPerPageUrlParam = 20
    if(pagination?.pageIndex){
        currentPageUrlParam = pagination.pageIndex
    }
    if(pagination?.pageSize){
        itemsPerPageUrlParam = pagination.pageSize
    }

    // Base URL
    let url = `http://164.90.182.86:3000/api/property/listing?limit=${itemsPerPageUrlParam}&page=${currentPageUrlParam}`;

    // Añadir parámetros de filtro si existen

    if(sorting){
        // Convertir el objeto JSON en una cadena
        const sortingJSON = JSON.stringify(sorting);

        // Codificar la cadena en Base64 usando Buffer
        const sortingBase64 = btoa(encodeURIComponent(sortingJSON));
        url += `&sorting=${encodeURIComponent(sortingBase64)}`;
    }
    if(filters){
        // Convertir el objeto JSON en una cadena
        const sortingJSON = JSON.stringify(filters);

        // Codificar la cadena en Base64 usando Buffer
        const sortingBase64 = btoa(encodeURIComponent(sortingJSON));
        url += `&filters=${encodeURIComponent(sortingBase64)}`;
    }

    console.log('url del fetch', url)
    try {
        const response = await fetch(url);
        console.log(response)
        if (response) {
            const data =  await response.json();
            console.log('datos', data);
            return data
            // Aquí manejarías la respuesta, por ejemplo, actualizando el estado de tu aplicación con los datos recibidos
        } else {
            // Manejo de respuestas de error HTTP (por ejemplo, 404, 500)
            console.error("HTTP-Error: " + response.status);
        }
    } catch (error) {
        // Manejo de errores de red / problemas para completar la solicitud fetch
        console.error("Fetch error: " + error.message);
    }


};

export const getHashOfFilteredProperties = async ({ localidad, precioMin, precioMax, portal, abstenerse }) => {
    // Base URL
    let baseUrl = `http://164.90.182.86:3000/api/property/get-hash-of-filtered-properties`;

    // Inicializar un array para almacenar partes de la cadena de consulta
    let queryParams = [];

    // Añadir parámetros de filtro si existen
    if (localidad) queryParams.push(`localidad=${encodeURIComponent(localidad)}`);
    if (precioMin) queryParams.push(`precioMin=${encodeURIComponent(precioMin)}`);
    if (precioMax) queryParams.push(`precioMax=${encodeURIComponent(precioMax)}`);
    if (portal) queryParams.push(`portal=${encodeURIComponent(portal)}`);
    if (abstenerse !== undefined) queryParams.push(`abstenerse=${abstenerse ? 'true' : 'false'}`);

    // Construir la URL completa uniendo los parámetros con '&'
    // Solo añadir el '?' seguido de los parámetros si hay al menos un parámetro
    let url = queryParams.length > 0 ? `${baseUrl}?${queryParams.join('&')}` : baseUrl;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Manejo de respuestas de error HTTP (por ejemplo, 404, 500)
            throw new Error("HTTP-Error: " + response.status);
        }
        const data = await response.json();
        console.log('datos', data);
        return data;
        // Aquí manejarías la respuesta, por ejemplo, actualizando el estado de tu aplicación con los datos recibidos
    } catch (error) {
        // Manejo de errores de red / problemas para completar la solicitud fetch
        console.error("Fetch error: " + error.message);
    }
};

export const setPropertiesReadyForSearchForContactDetails = async (propertyHashesArray) => {
    console.log('sending...', propertyHashesArray)
    try {
        const url = 'http://164.90.182.86:3000/api/property/set-properties-ready-for-search-for-contact-details';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({platform_hashes: propertyHashesArray}), // Asume que el servidor espera un objeto con una clave "platform_hashes"
        };
        const propertyDataResponse = await fetch(url, options);
        if (!propertyDataResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const propertyData = await propertyDataResponse.json();
        return propertyData;
    } catch (error) {
        console.error('Error fetching property data:', error);
        throw error;
    }
}



