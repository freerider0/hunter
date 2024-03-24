import {useEffect, useState} from "react";

export const getCompetitorsAveragePrice = (similarProperties, listingPricePerSq) => {
    let sum = 0;
    let totalSimilarProperties = similarProperties.length;

    if (totalSimilarProperties > 0) {
        for (let property of similarProperties) {
            sum += property.pricePerSq;
        }
    }

    const averagePrice = sum / totalSimilarProperties || 0;
    const percentageDifference = totalSimilarProperties > 0 ? ((listingPricePerSq - averagePrice) / averagePrice) * 100 : 0;

    return { averagePrice, percentageDifference };
}

export const getPrecios = (data) => {
    const currentPrice = data.listing.price;
    const currentPricePerSq = data.listing.grossArea > 0 ? data.listing.price / data.listing.grossArea : 0;
    const competitorsInfo = getCompetitorsAveragePrice(data.similarProperties, data.listing.pricePerSq);
    const soldCompetitorsInfo = getCompetitorsAveragePrice(data.similarOfflineProperties, data.listing.pricePerSq);

    console.log('competitorsInfo', {
        currentPrice,
        currentPricePerSq,
        currentCompetitorsPriceM2: competitorsInfo.averagePrice,
        currentCompetitorsPercentageDifference: competitorsInfo.percentageDifference,
        // Suponiendo que necesitas calcular estos valores correctamente para competidores vendidos:
        soldCompetitorsPriceM2: competitorsInfo.averagePrice, // Esto debería ser calculado o asignado correctamente
        soldCompetitorsPercentageDifference: competitorsInfo.percentageDifference, // Esto debería ser calculado o asignado correctamente
    })
    return {
        currentPrice,
        currentPricePerSq,
        currentCompetitorsPriceM2: competitorsInfo.averagePrice,
        currentCompetitorsPercentageDifference: competitorsInfo.percentageDifference,
        // Suponiendo que necesitas calcular estos valores correctamente para competidores vendidos:
        soldCompetitorsPriceM2: soldCompetitorsInfo.averagePrice, // Esto debería ser calculado o asignado correctamente
        soldCompetitorsPercentageDifference: soldCompetitorsInfo.percentageDifference, // Esto debería ser calculado o asignado correctamente
    };
}