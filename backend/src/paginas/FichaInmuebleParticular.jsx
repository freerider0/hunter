import React, {useEffect, useState} from 'react';
import {useQuery} from "@tanstack/react-query";
import {Precio} from '../components/Precio.jsx'
import {PrecioVendidosM2} from "../components/PrecioVendidosM2.jsx";
import {TimeLine} from "../components/fichaPropiedad/TimeLine.jsx"
//import AreaDetails from './AreaDetails'; // Asumiendo que tienes este componente
//import PropertyDetails from './PropertyDetails'; // Asumiendo que tienes este componente
import {getPropertyData} from "../apiClient/properties.js";
import {json, useParams} from "react-router-dom";
import './fichaInmueble.css'
import { FaBed, FaRulerCombined, FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';
import AgentBenefits from "../world/blocks/AgentBenefits.jsx";
import AutoCompleteSelect from "../components/AutoCompleteSelect.jsx";
import {useTranslation} from "react-i18next";
import {Duplicate} from "../components/fichaPropiedad/duplicates/Duplicate.jsx";
import {Precios} from "../components/fichaPropiedad/precios/Precios.jsx";
import FeaturesCard from "../components/fichaPropiedad/featuresSection/FeaturesCard.jsx"; // Asegúrate de instalar react-icons si aún no lo has hecho
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import SimilarPropertiesTable from "../components/tablas/SimilarPropertiesTable.jsx";

// Función para formatear fechas
const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};
// Datos simulados para la demostración
const areaData = {
    // Asumiendo que tienes datos de la zona aquí
};

const propertyData = {
    // Asumiendo que tienes datos de una propiedad específica aquí
};


export const FichaInmuebleParticular = options => {
    const [location, setLocation] = useState()
    const {platformHash} = useParams()
    const [t, i18n] = useTranslation()

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['propertyData', platformHash],
        queryFn: () => getPropertyData(platformHash),
    });



    if (isLoading) {

        return <span>Loading... {platformHash}</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }


    return (
        <div class={'pagina'}>
            <input type={'button'} title={'Obtener teléfono'} value={'Obtener teléfono'}/>
            {(data.listing.ad1 || data.listing.ad2 || data.listing.ad3) && <p>{`${data.listing.ad1 || ''}, ${data.listing.ad2 || ''}, ${data.listing.ad3 || ''}`.trim()}</p>}
            {data.listing.assetType && <span>{t(data.listing.assetType)}</span>} en {data.listing.addType && <span>{t(data.listing.addType)}</span>}, {data.listing.title && <span>{data.listing.title}</span>}
            {data.listing.addText && <p>{data.listing.addText}</p>}
            {data.listing.usefulArea && <p><strong>Área útil:</strong> {data.listing.usefulArea} m<sup>2</sup></p>}


            <Precios data={data}></Precios>

            <h3>Features</h3>
            <hr/>
            <div className={'features-container'}>
                <FeaturesCard
                    link={data.listing.link}
                    condition={data.listing.condition}
                    energyEfficiency={data.listing.energyEfficiency}
                    enteredMarket={data.listing.enteredMarket}
                    usefulArea={data.listing.usefulArea}
                    terrainArea={data.listing.terrainArea}
                    grossArea={data.listing.grossArea}
                    latitude={data.listing.latitude}
                    longitude={data.listing.longitude}
                    buildingYear={data.listing.buildingYear}
                    numberOfWcs={data.listing.numberOfWcs}
                    floorNumber={data.listing.floorNumber}
                    numberOfRooms={data.listing.numberOfRooms}
                    qualityExterior={data.listing.qualityExterior}
                    qualityInterior={data.listing.qualityInterior}
                    qualityKitchen={data.listing.qualityKitchen}
                    qualityWc={data.listing.qualityWc}
                />
            </div>


            <h3>SubFeatures</h3>
            <hr/>
            {data.listing.subFeatures && (

                   <div className={'features-container'}>
                       {data.listing.subFeatures.map((subfeature, index) => (
                           <div className={'feature'}>{t(subfeature)}</div>
                       ))}
                   </div>

            )}

            <h3>Imagenes</h3>
            <hr/>
            {data.listing.images && data.listing.images.length > 0 && (

                    data.listing.images.map((img, index) => (
                        <img key={index} src={data.listing.originalImages[index]} alt="Imagen de propiedad" width="200" />
                    ))

            )}

            <h3>Ubicación</h3>
            <hr/>

            <div className={'mapa'}>


                <iframe
                    width="100%"
                    height="450"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBWkS-CCpdOjcIqg_t_zO0JfF0CkG3Krg0&q=${data.listing.latitude},${data.listing.longitude}`} >
                </iframe>
                <a href={`https://www.google.com/maps/search/?api=1&query=${data.listing.latitude},${data.listing.longitude}`} target="_blank">Ver ubicación en Google Maps</a>

            </div>
                <h3>Propiedades Similares Activas</h3>
            <hr/>

                <SimilarPropertiesTable data={data.similarProperties}></SimilarPropertiesTable>





            <h3>Propiedades Similares Vendidas</h3>
            <hr/>
            {data.similarOfflineProperties.length > 0 ? (
                <SimilarPropertiesTable data={data.similarOfflineProperties}></SimilarPropertiesTable>

            ) : (
                <p>No hay propiedades similares disponibles.</p>
            )}

            <h3>{t("timeLine")}</h3>
            <hr/>
            {data.timeline && <TimeLine timeline={data.timeline}></TimeLine>}



            {data.duplicates && data.duplicates.length > 0 && (
                <>
                    <h3>Propiedades Duplicadas</h3>
                    <ul>
                        {data.duplicates.map((dup, index) => (
                            <Duplicate duplicate={dup}></Duplicate>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

