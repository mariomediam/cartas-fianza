import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '../services/api';
import Layout from '../components/Layout';

const LetterTypes = () => {
  const [letterTypes, setLetterTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingLetterType, setEditingLetterType] = useState(null);
  const [deletingLetterType, setDeletingLetterType] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [formData, setFormData] = useState({
    description: '',
  });

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const url = searchTerm.trim()
        ? `/letter-types/?search=${encodeURIComponent(searchTerm.trim())}`
        : '/letter-types/?page_size=1000';
      
      const response = await api.get(url);
      const data = response.data.results || response.data;
      setLetterTypes(data);
    } catch (error) {
      console.error('Error al buscar tipos de carta:', error);
      toast.error('Error al buscar los tipos de carta');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleOpenModal = (letterType = null) => {
    if (letterType) {
      setEditingLetterType(letterType);
      setFormData({
        description: letterType.description,
      });
    } else {
      setEditingLetterType(null);
      setFormData({
        description: '',
      });
    }
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLetterType(null);
    setFormData({
      description: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error('La descripción es obligatoria');
      return;
    }

    try {
      const dataToSend = {
        description: formData.description.trim(),
      };

      if (editingLetterType) {
        await api.put(`/letter-types/${editingLetterType.id}/`, dataToSend);
        toast.success('Tipo de carta actualizado correctamente');
      } else {
        await api.post('/letter-types/', dataToSend);
        toast.success('Tipo de carta creado correctamente');
      }

      handleCloseModal();
      if (hasSearched) {
        handleSearch();
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errors[key].forEach(msg => toast.error(`${key}: ${msg}`));
          } else {
            toast.error(`${key}: ${errors[key]}`);
          }
        });
      } else {
        toast.error('Error al guardar el tipo de carta');
      }
    }
  };

  const handleDelete = (letterType) => {
    setDeletingLetterType(letterType);
    setShowDeleteConfirm(true);
    setOpenMenuId(null);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/letter-types/${deletingLetterType.id}/`);
      toast.success('Tipo de carta eliminado correctamente');
      setShowDeleteConfirm(false);
      setDeletingLetterType(null);
      if (hasSearched) {
        handleSearch();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      if (error.response?.status === 400 || error.response?.status === 409) {
        toast.error('No se puede eliminar porque está siendo utilizado en cartas fianza');
      } else {
        toast.error('Error al eliminar el tipo de carta');
      }
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Tipos de Carta
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Tipo de Carta
        </button>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Busca por descripción"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Buscando...</p>
          </div>
        </div>
      ) : !hasSearched ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Realiza una búsqueda</h3>
          <p className="mt-2 text-sm text-gray-500">
            Ingresa un término de búsqueda o deja el campo vacío para ver todos los registros.
          </p>
        </div>
      ) : letterTypes.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? `No hay tipos de carta que coincidan con "${searchTerm}".` : 'No hay tipos de carta registrados.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {letterTypes.map((letterType) => (
            <div
              key={letterType.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {letterType.description}
                  </h3>
                </div>
                
                {/* Menú de 3 puntos */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === letterType.id ? null : letterType.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  {openMenuId === letterType.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={() => handleOpenModal(letterType)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(letterType)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Agregar/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingLetterType ? 'Editar Tipo de Carta' : 'Agregar Tipo de Carta'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                    placeholder="Ej: Adelanto de materiales"
                    maxLength={50}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Ejemplos: Adelanto de materiales, Adelanto directo, Fiel cumplimiento
                  </p>
                </div>
              </div>

              {/* Botones del modal */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  {editingLetterType ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              ¿Eliminar tipo de carta?
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              ¿Estás seguro de que deseas eliminar "{deletingLetterType?.description}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingLetterType(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LetterTypes;

