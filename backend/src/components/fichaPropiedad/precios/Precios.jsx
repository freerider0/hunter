import {getPrecios} from "./hepler.js";
import {PriceCard} from "./PriceCard.jsx";
import {useEffect, useState} from "react";

export const Precios = ({ data }) => {
    const [prices, setPrices] = useState({ currentPrice: 'Cargando...', curentPricePerSq: 'Cargando...' });

    useEffect(() => {
        // Aquí asumimos que `getPrecios` manejará correctamente un `data` nulo o indefinido.
        setPrices(getPrecios(data));
    }, [data]); // Añade `data` como dependencia para recalcular si cambia.

    return (
        <div className={'bloque-precios'}>
            <PriceCard
                title={'Precio actual'}
                bigNumber={prices.currentPrice?.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                })}
                textDownLeft={'precio m2'}
                textDownRight={prices.currentPricePerSq?.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR'
                })}
            />
            <PriceCard
                title={'Precio competencia'}
                bigNumber={prices.currentCompetitorsPriceM2?.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                })}
                textDownLeft={'Porcentaje de diferencia'}
                textDownRight={`${prices.currentCompetitorsPercentageDifference?.toFixed(2)} %`}
            />
            <PriceCard
                title={'Precio vendidos m2'}
                bigNumber={prices.soldCompetitorsPriceM2?.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0
                })}
                textDownLeft={'Porcentaje de diferencia'}
                textDownRight={`${prices.soldCompetitorsPercentageDifference?.toFixed(2)} %`}
            />
        </div>
    );
};





