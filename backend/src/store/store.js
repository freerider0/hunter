import { create } from 'zustand';

export const useStore = create((set, get) => ({
    tablePropertiesListingItemsPerPage: 20, // Corregido el nombre de la propiedad para mantener la consistencia
    setTablePropertiesListingItemsPerPage: (itemsPerPage) => set({ tablePropertiesListingItemsPerPage: itemsPerPage }),
    bears: 0,
    filters: {
        localidad: '',
        precioMin: null,
        precioMax: null,
        portal: '',
        abstenerse: false,
        propertyType: ''
    },
    setFilters: (filterName, value) => set((state) => ({
        filters: {
            ...state.filters,
            [filterName]: value,
        },
    })),
    resetFilters: () => set(() => ({
        filters: {
            localidad: '',
            precioMin: null,
            precioMax: null,
            portal: '',
            abstenerse: false,
            propertyType: ''
        },
    })),

// Estado inicial para la selección de filas, equivalente a useState({})
    rowSelection: {"65f59f58a7ea7ae4e129bb15": true},
    setRowSelection: (id) => {
        set((state) => {
            const newSelection = { ...state.rowSelection };
            if (newSelection[id]) {
                // Si el id ya existe en rowSelection, borrarlo
                delete newSelection[id];
            } else {
                // Si el id no existe en rowSelection, añadirlo
                newSelection[id] = true;
            }
            return { rowSelection: newSelection };
        });
    },
    toggleFullSelection: (allItems) => {
        set((state) => {
            const currentState = state.rowSelection;
            const allSelected = allItems.length === Object.keys(currentState).length &&
                allItems.every(item => currentState[item]);
            let newSelection= {}

            if (allSelected) {
                // Si todos los items están seleccionados, limpiar la selección
                return { rowSelection: newSelection };
            } else {
                // Si no, seleccionar todos los items
                allItems.forEach(item => {
                    newSelection[item] = true;
                });

                return { rowSelection: newSelection };
            }
        });
    },
    clearSelection: () => set({ rowSelection: [] }),
}));