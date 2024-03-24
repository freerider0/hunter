import './duplicates.css'

import React, { useState } from 'react';

export const Duplicate = ({ duplicate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div className={'duplicate-first-row'} onClick={toggleExpansion}>
                <div>
                    <a href={duplicate.link}>
                        {duplicate.agencyOfficialName === null ? 'Particular' : duplicate.agencyOfficialName}
                    </a>
                </div>
                <div>
                    {duplicate.enteredMarket ? new Date(duplicate.enteredMarket).toLocaleDateString() : 'Fecha no disponible'}                </div>
                <div>
                    {duplicate.live ? 'Listado' : 'Retirada'}
                </div>
            </div>

            {isExpanded && (
                <>
                    <div className={'duplicate-data'}>
                        Precio: {duplicate.price}
                    </div>
                    <div className={'duplicate-data'}>
                        Supericie construida: {duplicate.grossArea}
                    </div>
                    <div className={'duplicate-data'}>
                        Superficie útil: {duplicate.usefulArea}
                    </div>
                    <div className={'duplicate-data'}>
                        Superficie Terreno: {duplicate.terrainArea}
                    </div>
                    <div className={'duplicate-data'}>
                        Habitaciones: {duplicate.numberOfRooms}
                    </div>
                </>
            )}
        </>
    );
};