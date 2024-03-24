import React, { useEffect, useState } from 'react';
import '../css/components/table.css'
import Pagination from "./Pagination.jsx";
import AutoCompleteSelect from "./AutoCompleteSelect.jsx";
import { useNavigate  } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import {
    getHashOfFilteredProperties,
    getProperties,
    setPropertiesReadyForSearchForContactDetails
} from '../apiClient/properties.js'
import {getLocalities,
getPropertyTypes} from "../apiClient/dictionaries.js";

import { motion } from 'framer-motion';
import {useStore} from '../store/store.js'

const DataTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
   // const bears = useStore((state) => state.bears)


    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0)

    const [localidad, setLocalidad] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [portal, setPortal] = useState('');
    const [propertyType, setPropertyType] = useState('');

    const [abstenerse, setAbstenerse] = useState(false);

    const [portales, setPortales] = useState([])

    const navigate = useNavigate();

    //Load dictionaries



    const handleRowClick = (houseId) => {
        navigate(`/particular/${houseId}`);
    };


    const { status: statusLocalities, data : localities, error:errorLocalities  } = useQuery({
        queryKey: ['getLocalities'],
        queryFn: () => getLocalities(),
        keepPreviousData: true,
    });

    const { status: statusPropertyTypes, data : dataPropetyTypes, error:errorPropertyTypes  } = useQuery({
        queryKey: ['getPropertyTypes'],
        queryFn: () => getPropertyTypes(),
        keepPreviousData: true,
    });

    const { status, data, error } = useQuery({
        queryKey: ['getProperties', { currentPage, itemsPerPage, localidad, precioMin, precioMax, portal, abstenerse, propertyType }],
        queryFn: () => getProperties({ currentPage, itemsPerPage, localidad, precioMin, precioMax, portal, abstenerse, propertyType }),
        keepPreviousData: true,

    });

    useEffect(() => {
        setTotalPages(data?.totalPages);
        setTotalItems(data?.totalItems);
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
         //   const portalesResult = await fetch('http://localhost:3000/api/data/portales')
          //  const portalesList = await portalesResult.json()
         //   setPortales(portalesList.data)
            const localidadesResult = await fetch('http://localhost:3000/api/data/localidades')
            const localidadesList = await localidadesResult.json()
            setLocalidades(localidadesList.data)
        }

         fetchData();
    }, [currentPage, itemsPerPage, localidad, precioMin, precioMax, portal, abstenerse]);

    useEffect(() => {
        // Reinicia la página actual a 1 cuando localidad o portal cambien
        setCurrentPage(1);
    }, [localidad, portal]);

    const goToNextPage = () => {
        console.log('siguiente')
        setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
    };

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getRejectionChanceColor = (score)=>{
        if(score==100){
            return <div className={'abstenerse red'}></div>
        }
        if(score==50){
            return <div className={'abstenerse orange'}></div>
        }
        if(score==0){
            return <div className={'abstenerse green'}></div>
        }
    }

    //MANEJO DE LAS SLECCIOMES DE LA TABLA
    const selection = useStore(state => state.selection);
    const toggleSelection = useStore(state => ({
        addToSelection: state.addToSelection,
        removeFromSelection: state.removeFromSelection
    }));
    const handleInputTdClick = (itemHash) => {
        const isSelected = selection.includes(itemHash);

        if (isSelected) {
            toggleSelection.removeFromSelection(itemHash);
        } else {
            toggleSelection.addToSelection(itemHash);
        }
    };


    const { selectAllCurrentPage, selectAllPages, clearSelection } = useStore();

    const handleSelectAllCurrentPage = () => {
        // Suponiendo que `data.data` contiene los elementos de la página actual
        const currentPageItemsHashes = data.data.map(item => item.listing.platform_hash);
        selectAllCurrentPage(currentPageItemsHashes);
    };

    const handleSelectAllPages = async () => {
        // Aquí necesitarías una manera de obtener todos los hashes de todas las páginas
        // Esto podría implicar una llamada a la API o tener estos datos ya disponibles de alguna manera
        const allItemsHashes = await getHashOfFilteredProperties(localidad, precioMin, precioMax,portal, abstenerse);
        console.log('haseh', allItemsHashes)
        selectAllPages(allItemsHashes.data);
    };

    const handleClearSelection = () => {
        clearSelection();
    };



 const handleMarkPropertyReadyForSearchForContactDetails = async ()=>{
     await setPropertiesReadyForSearchForContactDetails(selection)
 }







    const handleNumberOfPorpertiesToDisplayChange = (event) => {
        //const setItemsPerPage = useStore((state) => state.setItesmsPerPage())

       // setItemsPerPage(event.target.value)
    };

    //Framer motion variants
    const tableVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1}
    };

    const rowVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };
    // Define cleanUrl and getDomain functions here or import them
    if (status === 'loading') {
        return <span>Loading...</span>
    }

    if (status === 'error') {
        return <span>Error: {error.message}</span>
    }

    if (!data) {
        return <div>Loading...</div>; // or any other loading state representation
    }
    return (

        <div>
            {totalItems} propiedades en {totalPages} paginas
            <input
                type="number"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                placeholder="Precio Mínimo"
            />
            <input
                type="number"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                placeholder="Precio Máximo"
            />

            <AutoCompleteSelect options={portales} setValue={setPortal} value={portal} selectedOption={''}></AutoCompleteSelect>
            <AutoCompleteSelect options={localities} setValue={setLocalidad} selectedOption={localidad}></AutoCompleteSelect>
            <AutoCompleteSelect options={dataPropetyTypes} setValue={setPropertyType} selectedOption={propertyType}> </AutoCompleteSelect>


            <select value={itemsPerPage} onChange={handleNumberOfPorpertiesToDisplayChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="1000">1000</option>

            </select>
            <button onClick={handleSelectAllCurrentPage}>Seleccionar Página Actual</button>
            <button onClick={handleSelectAllPages}>Seleccionar Todas las Páginas</button>
            <button onClick={handleClearSelection}>Limpiar Selección</button>
            <button onClick={handleMarkPropertyReadyForSearchForContactDetails}>Preparar Para Llamar</button>

            <motion.table
                initial="hidden"
                animate="visible"
                variants={tableVariant}
                className="your-table-class"
            >
                <thead>
                <tr>
                    <th></th>
                    <th>Score</th>
                    <th>Localidad</th>
                    <th>Imagen</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>m<sup>2</sup></th>
                    <th>Portal</th>
                    <th>Encontrado</th>
                    <th>Estado</th>
                    <th>Ganado</th>
                </tr>
                </thead>
                <tbody>

                {data && data.data && Array.isArray(data.data) ? (
                    data.data.map((item, index) => (
                        <tr >
                            <td onClick={() => handleInputTdClick(item.listing.platform_hash)}>
                                <input
                                    type="checkbox"
                                    readOnly
                                    checked={selection.includes(item.listing.platform_hash)}
                                    onClick={(e) => e.stopPropagation()} // Previene que el evento de clic se propague al td padre
                                />
                            </td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>{getRejectionChanceColor(item.rejectionChance)}</td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>
                                {item.listing ?
                                    `${item.listing.ad2 ? item.listing.ad2 : 'N/A'} / ${item.listing.ad3 ? item.listing.ad3 : 'N/A'}`
                                    : 'N/A'}
                            </td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>
                                {item.listing && item.listing.originalImages && item.listing.originalImages.length > 0 ?
                                    <img width={'100'} height={'50'} src={item.listing.originalImages[0]} alt="Listing" />
                                    : 'No Image'}
                            </td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>{item.listing && item.listing.assetType ? item.listing.assetType : 'N/A'}</td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>
                                {item.listing && item.listing.price ?
                                    `${item.listing.price.toLocaleString()} €` : 'N/A'}
                            </td>
                            <td onClick={()=>handleRowClick(item.listing.platform_hash)}>
                                {item.listing && item.listing.grossArea ?
                                    `${item.listing.grossArea} m²` : 'N/A'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="11">No data found</td>
                    </tr>
                )}
                </tbody>
            </motion.table>
            <Pagination goToPreviousPage={goToPreviousPage} goToNextPage={goToNextPage} changePage={changePage} currentPage={currentPage} totalPages={totalPages}></Pagination>
        </div>
    );
};

export default DataTable;