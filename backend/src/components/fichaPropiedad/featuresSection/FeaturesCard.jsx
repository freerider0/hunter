import './featuresCard.css'

const featureColors = {
    "Condición": "feature-color-condition",
    "Eficiencia Energética": "feature-color-efficiency",
    "En el mercado desde": "feature-color-market",
    "Área útil (m²)": "feature-color-area",
    "Área bruta (m²)": "feature-color-area",
    "Ubicación": "feature-color-location",
    "Año de construcción": "feature-color-building",
    "Baños": "feature-color-bathroom",
    "Piso": "feature-color-floor",
    "Habitaciones": "feature-color-rooms",
    "Calidad Exterior": "feature-color-quality",
    "Calidad Interior": "feature-color-quality",
    "Calidad Cocina": "feature-color-kitchen",
    "Calidad Baños": "feature-color-wc",
};
const PropertyFeature = ({ label, value }) => {
    const colorClass = featureColors[label] || "default-feature-color"; // Fallback a una clase por defecto

    if (!value && value !== 0) return null; // También permite mostrar valores que sean 0
    return (
        <div className={`feature-card ${colorClass}`}>
            <span className="feature-label">{label}</span>
            <span className="feature-value">{typeof value === 'object' ? value.toLocaleDateString() : value}</span>
        </div>
    );
};

const FeaturesCard = ({ link, condition, energyEfficiency, enteredMarket, usefulArea, terrainArea, grossArea, latitude, longitude, buildingYear, numberOfWcs, floorNumber, numberOfRooms, qualityExterior, qualityInterior, qualityKitchen, qualityWc }) => (
    <div className="property-card-features">

            <PropertyFeature label="Condición" value={condition} />
            <PropertyFeature label="Eficiencia Energética" value={energyEfficiency} />
            <PropertyFeature label="En el mercado desde" value={enteredMarket ? new Date(enteredMarket) : null} />
            <PropertyFeature label="Área útil (m²)" value={usefulArea} />
            <PropertyFeature label="Área bruta (m²)" value={grossArea} />
            <PropertyFeature label="Ubicación" value={latitude && longitude ? `${latitude}, ${longitude}` : null} />
            <PropertyFeature label="Año de construcción" value={buildingYear} />
            <PropertyFeature label="Baños" value={numberOfWcs} />
            <PropertyFeature label="Piso" value={floorNumber} />
            <PropertyFeature label="Habitaciones" value={numberOfRooms} />
            <PropertyFeature label="Calidad Exterior" value={qualityExterior ? `${qualityExterior}/5` : null} />
            <PropertyFeature label="Calidad Interior" value={qualityInterior ? `${qualityInterior}/5` : null} />
            <PropertyFeature label="Calidad Cocina" value={qualityKitchen ? `${qualityKitchen}/5` : null} />
            <PropertyFeature label="Calidad Baños" value={qualityWc ? `${qualityWc}/5` : null} />

    </div>
);

export default FeaturesCard;
