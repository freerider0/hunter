const sendNameAndPhone = async (data) => {
    try {
        const url = 'http://127.0.0.1:3000/api/property/set-name-and-phone-by-url';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Asume que el servidor espera un objeto con una clave "platform_hashes"
        };
        const propertyDataResponse = await fetch(url, options);
        if (!propertyDataResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const propertyData = await propertyDataResponse.json();
        return propertyData;
    } catch (error) {
        console.error('Error sending name and phone:', error);
        throw error;
    }
}