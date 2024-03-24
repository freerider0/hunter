import React from "react";


export const PriceCard = ({ title, bigNumber, textDownLeft, textDownRight }) => {
    // Aseguramos que los valores mostrados sean strings y no undefined, null, etc.
    // Esto es útil si esperas que cualquier prop pueda ser indefinida o nula en algún momento.
    // También puedes hacer más lógica aquí si necesitas procesar los valores de alguna manera.
    const safeTitle = title || 'Título no disponible';
    const safeBigNumber = bigNumber || '0';
    const safeTextDownLeft = textDownLeft || '';
    const safeTextDownRight = textDownRight || '';

    return (
        <div className={"priceCard"}> {/* Usamos className en lugar de class para JSX */}
            <h4>{safeTitle}</h4>
            <div className={'propertyPrice'}>{safeBigNumber}</div> {/* Corrección en el nombre de la clase */}
            <div className={'calculations'}>
                <div>{safeTextDownLeft}</div>
                <div>{safeTextDownRight}</div>
            </div>
        </div>
    );
};

