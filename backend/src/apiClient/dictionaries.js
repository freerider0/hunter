export const getLocalities = async () => {
    try {
        const response = await fetch('http://164.90.182.86:3000/api/data/localidades');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Error fetching property data:', error);
        throw error;
    }
};

export const getPropertyTypes = async () => {
    try {
        const response = await fetch('http://164.90.182.86:3000/api/dictionaries/propertyTypes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Error fetching getPropertyTypes data:', error);
        throw error;
    }
};

