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
    rowSelection: {1:true},
    setRowSelection: (newSelection) => set({ rowSelection: newSelection }),
    selectAllPages: (allItems) => set({ rowSelection: allItems }),
    clearSelection: () => set({ rowSelection: [] }),
}));