import { create } from 'zustand';

/**
 * Store para mantener los filtros de búsqueda de cartas fianza
 * Esto permite que cuando regresemos de la página de agregar/editar,
 * mantengamos los filtros que el usuario había aplicado
 */
const useWarrantyFiltersStore = create((set) => ({
  // Estado inicial
  filterType: 'letter_number',
  filterValue: '',
  searchResults: null,
  
  // Acciones
  setFilterType: (filterType) => set({ filterType }),
  setFilterValue: (filterValue) => set({ filterValue }),
  setSearchResults: (searchResults) => set({ searchResults }),
  
  // Limpiar todos los filtros
  clearFilters: () => set({
    filterType: 'letter_number',
    filterValue: '',
    searchResults: null,
  }),
}));

export default useWarrantyFiltersStore;

