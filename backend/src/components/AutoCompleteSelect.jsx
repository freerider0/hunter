import React, { useState, useEffect } from 'react';

import './AutoCompleteSelect.css';
import {useTranslation} from "react-i18next";

function AutocompleteSelect({ options, setValue, optionFilterid, filters }) {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { t } = useTranslation(); // Destructured directly if `i18n` is not used

    useEffect(() => {
        // Check if options and options.data are defined before setting filtered options
        if (options && options.data && Array.isArray(options.data)) {
            setFilteredOptions(options.data);
        } else {
            // Optionally, set filteredOptions to an empty array or a default state
            setFilteredOptions([]);
        }
    }, [options]);

    // Consider memoizing this handler if the component becomes complex.
    const handleOptionClick = (option) => {
        console.log('option clicked', option)
        //setInputValue(option); // Establece el valor seleccionado para ser utilizado fuera del componente
        setValue([optionFilterid], option)
        //setValue({...filters,  [optionFilterid]: option})
        //setIsListVisible(false); // Oculta las opciones después de seleccionar una
    };

    const handleInputChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);

        // Using a more concise approach for filtering
        const newFilteredOptions = options.data.filter(option =>
            option.toLowerCase().includes(newValue.toLowerCase())
        );

        setFilteredOptions(newFilteredOptions);
        setIsListVisible(true);
    };

    // Effect to sync `inputValue` with external `filters` changes
    useEffect(() => {
        setInputValue(filters[optionFilterid] || '');
    }, [filters, optionFilterid]);

    const handleFocus = () => {
        setIsListVisible(true);
    };

    const clearInput = (e) => {
        console.log('blaring')
        setValue([optionFilterid], '')

      //  setValue([optionFilterid], '')

        //setFilteredOptions(options.data);
    };

    return (
        <div className="autocompletar">
            <div className="AutoCompleteList-input">
                <input
                    type="text"
                    value={t(inputValue)}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={() => setTimeout(() => setIsListVisible(false), 200)}
                    aria-haspopup="listbox" // Improves accessibility
                    aria-expanded={isListVisible} // Improves accessibility
                />
                <button onClick={clearInput} className="AutoCompleteList-deleteOption" aria-label="Clear input">X</button>
            </div>
            {isListVisible && (
                <ul className="AutoCompleteList-visible optionsContainer" role="listbox">
                    {filteredOptions.map((option, index) => (
                        <li key={`${option}-${index}`} onClick={() => handleOptionClick(option)} role="option">
                            {t(option)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AutocompleteSelect;