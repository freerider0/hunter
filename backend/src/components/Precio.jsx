import {useEffect, useState} from "react";

export const Precio = ({precio, data, title}) => {
    const [thresholdPrice, setThresholdPrice] = useState({
        averagePrice: 0,
        percentageDifference: 0
    })

    useEffect(() => {
        let sum = 0;
        let totalSimilarProperties = 0;

        if (data.similarProperties.length > 0) {
            totalSimilarProperties = data.similarProperties.length;
            for (let i = 0; i < data.similarProperties.length; i++) {
                sum += data.similarProperties[i].pricePerSq;
            }
        }

        const averagePrice = sum / totalSimilarProperties;
        // Calcular el porcentaje que esta por encima o por debajo del precio medio del mercado
        const percentageDifference = ((data.listing.pricePerSq - averagePrice) / averagePrice) * 100;

        setThresholdPrice( {
            averagePrice: averagePrice,
            percentageDifference: percentageDifference
        });
    }, []);

    
    return (
        <div class={"priceCard"}>
            <h4>{title}</h4>
            <div class={'propetyPrice'}>{data.listing.pricePerSq.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</div>
            <div class={'calculations'}>
                <div>{thresholdPrice.averagePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</div>
                <div>{thresholdPrice.percentageDifference>0 ? <span>+ {thresholdPrice.percentageDifference.toLocaleString()}</span>:<span>-{thresholdPrice.percentageDifference.toLocaleString()} </span> } %</div>
            </div>

        </div>
    )
}
