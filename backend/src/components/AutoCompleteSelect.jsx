import React, { useState, useEffect } from 'react';

import './AutoCompleteSelect.css';
import {useTranslation} from "react-i18next";

function AutocompleteSelect({ options, setValue, optionFilterid, filters }) {

    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const [t, i18n] = useTranslation()

    useEffect(() => {
        setFilteredOptions(options.data);
    }, [options]);

    function handleOptionClick(option) {
        setValue(option); // Establece el valor seleccionado para ser utilizado fuera del componente
        setValue([optionFilterid], option)
        //setValue({...filters,  [optionFilterid]: option})
        setIsListVisible(false); // Oculta las opciones después de seleccionar una
    }

    function handleInputChange(event) {
        const newValue = event.target.value;
        console.log('options', options.data)
        setInputValue(newValue); // Actualiza el estado con cada cambio en el input
        const newFilteredOptions = options && options.data
            ? options.data.filter(option =>
                option.toLowerCase().includes(newValue.toLowerCase())
            )
            : [];
        console.log('filtered options:', newFilteredOptions)
        setFilteredOptions(newFilteredOptions);
        setIsListVisible(true);
    }

    useEffect(() => {
        setInputValue(filters[optionFilterid])
    }, [filters[optionFilterid]]);

    function handleFocus() {
        setIsListVisible(true);
    }

    function clearInput() {
        setValue({...filters,  [optionFilterid]: ''}); // Limpia el valor seleccionado
        setFilteredOptions(options.data); // Restaura las opciones filtradas a su estado inicial
        setIsListVisible(false); // Oculta las opciones
    }

    return (
        <div className={'autocompletar'}>
            <div className={'AutoCompleteList-input'}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={() => setTimeout(() => setIsListVisible(false), 200)} // Permite tiempo para seleccionar una opción antes de ocultar las opciones
                />
                <button onClick={clearInput} className={'AutoCompleteList-deleteOption'}>X</button>
            </div>
            {isListVisible && (
                <ul className='AutoCompleteList-visible optionsContainer'>
                    {filteredOptions.map((option, index) => (
                        <li key={`${option}-${index}`} onClick={() => handleOptionClick(option)}>
                            {t(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteSelect;