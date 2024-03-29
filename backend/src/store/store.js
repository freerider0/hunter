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
    rowSelection: {},
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
        console.log('el id es:', allItems)
        set((state) => {
            const oldSelection = { ...state.rowSelection };
            if (oldSelection.length > 0) {
                // Si el id ya existe en rowSelection, borrarlo
                return { rowSelection: {} }
            } else {
                let newSelection =  {}
                allItems.forEach(item =>{
                    newSelection[item] = true
                })
                // Si el id no existe en rowSelection, añadirlo
                return { rowSelection: newSelection };
            }
        });
    },
    clearSelection: () => set({ rowSelection: [] }),
}));