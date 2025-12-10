import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import AsyncSelect from 'react-select/async';
import api from '../services/api';
import Layout from '../components/Layout';

const ReporteEjecutadas = () => {
  // Estados para catálogos
  const [letterTypes, setLetterTypes] = useState([]);
  const [financialEntities, setFinancialEntities] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  // Calcular fecha inicial (primer día del mes actual) y fecha final (hoy)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Estados para filtros
  const [filters, setFilters] = useState({
    fecha_desde: firstDayOfMonth.toISOString().split('T')[0],
    fecha_hasta: today.toISOString().split('T')[0],
    letter_type_id: '',
    financial_entity_id: '',
    contractor: null,
    warranty_object: null,
  });

  // Estados para resultados
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs para el debounce
  const contractorDebounceRef = useRef(null);
  const warrantyObjectDebounceRef = useRef(null);

  // Ref para la vista de impresión
  const printRef = useRef(null);

  // Cargar catálogos al montar el componente
  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const [letterTypesRes, financialEntitiesRes] = await Promise.all([
        api.get('/letter-types/?page_size=1000'),
        api.get('/financial-entities/?page_size=1000'),
      ]);

      setLetterTypes(letterTypesRes.data.results || letterTypesRes.data || []);
      setFinancialEntities(financialEntitiesRes.data.results || financialEntitiesRes.data || []);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      toast.error('Error al cargar los catálogos');
    } finally {
      setLoadingCatalogs(false);
    }
  };

  // Función de búsqueda real de contratistas
  const searchContractors = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) {
      return [];
    }

    try {
      const response = await api.get('/contractors/', {
        params: {
          search: inputValue.trim(),
          page_size: 20,
        },
      });

      const contractors = response.data.results || response.data || [];
      return contractors.map((contractor) => ({
        value: contractor.id,
        label: `${contractor.ruc} - ${contractor.business_name}`,
        data: contractor,
      }));
    } catch (error) {
      console.error('Error al buscar contratistas:', error);
      return [];
    }
  };

  // Función para buscar contratistas con debounce de 1 segundo
  const loadContractorOptions = useCallback((inputValue) => {
    return new Promise((resolve) => {
      if (contractorDebounceRef.current) {
        clearTimeout(contractorDebounceRef.current);
      }

      contractorDebounceRef.current = setTimeout(async () => {
        const results = await searchContractors(inputValue);
        resolve(results);
      }, 1000);
    });
  }, []);

  // Función de búsqueda real de objetos de garantía
  const searchWarrantyObjects = async (inputValue) => {
    if (!inputValue || inputValue.trim().length < 2) {
      return [];
    }

    try {
      const response = await api.get('/warranty-objects/', {
        params: {
          search: inputValue.trim(),
          page_size: 20,
        },
      });

      const warrantyObjects = response.data.results || response.data || [];
      return warrantyObjects.map((wo) => ({
        value: wo.id,
        label: wo.cui ? `${wo.cui} - ${wo.description}` : wo.description,
        data: wo,
      }));
    } catch (error) {
      console.error('Error al buscar objetos de garantía:', error);
      return [];
    }
  };

  // Función para buscar objetos de garantía con debounce de 1 segundo
  const loadWarrantyObjectOptions = useCallback((inputValue) => {
    return new Promise((resolve) => {
      if (warrantyObjectDebounceRef.current) {
        clearTimeout(warrantyObjectDebounceRef.current);
      }

      warrantyObjectDebounceRef.current = setTimeout(async () => {
        const results = await searchWarrantyObjects(inputValue);
        resolve(results);
      }, 1000);
    });
  }, []);

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar búsqueda
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!filters.fecha_desde) {
      toast.error('La fecha desde es obligatoria');
      return;
    }

    if (!filters.fecha_hasta) {
      toast.error('La fecha hasta es obligatoria');
      return;
    }

    if (filters.fecha_desde > filters.fecha_hasta) {
      toast.error('La fecha desde no puede ser mayor que la fecha hasta');
      return;
    }

    setLoading(true);
    try {
      const params = {
        fecha_desde: filters.fecha_desde,
        fecha_hasta: filters.fecha_hasta,
      };

      if (filters.letter_type_id) {
        params.letter_type_id = filters.letter_type_id;
      }
      if (filters.financial_entity_id) {
        params.financial_entity_id = filters.financial_entity_id;
      }
      if (filters.contractor) {
        params.contractor_id = filters.contractor.value;
      }
      if (filters.warranty_object) {
        params.warranty_object_id = filters.warranty_object.value;
      }

      const response = await api.get('/warranties/ejecutadas-por-periodo/', { params });
      setResults(response.data);

      if (response.data.count === 0) {
        toast.info('No se encontraron cartas ejecutadas en el período seleccionado');
      } else {
        toast.success(`Se encontraron ${response.data.count} carta(s) ejecutada(s)`);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      toast.error(error.response?.data?.error || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    setFilters({
      fecha_desde: firstDayOfMonth.toISOString().split('T')[0],
      fecha_hasta: today.toISOString().split('T')[0],
      letter_type_id: '',
      financial_entity_id: '',
      contractor: null,
      warranty_object: null,
    });
    setResults(null);
  };

  // Manejar impresión
  const handlePrint = () => {
    if (!results || results.count === 0) {
      toast.warning('No hay datos para imprimir');
      return;
    }

    // Crear contenido de impresión
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Cartas Fianza Ejecutadas</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 10px;
            color: #1a1a2e;
            background: #fff;
            padding: 15px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #dc2626;
          }
          .header h1 {
            font-size: 18px;
            color: #dc2626;
            margin-bottom: 5px;
            font-weight: 700;
          }
          .header p {
            font-size: 11px;
            color: #5d6d7e;
          }
          .filters-info {
            background: #fef2f2;
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 10px;
            border: 1px solid #fecaca;
          }
          .filters-info strong {
            color: #b91c1c;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 9px;
          }
          th {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
            color: white;
            padding: 8px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 6px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #fef2f2;
          }
          tr:hover {
            background-color: #fee2e2;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .amount {
            font-weight: 600;
            color: #dc2626;
          }
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e9ecef;
            font-size: 9px;
            color: #7f8c8d;
            display: flex;
            justify-content: space-between;
          }
          .total-row {
            background: #fee2e2 !important;
            font-weight: 600;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚠️ REPORTE DE CARTAS FIANZA EJECUTADAS</h1>
          <p>Universidad Nacional de Frontera - Sistema de Gestión de Cartas Fianza</p>
        </div>
        
        <div class="filters-info">
          <strong>Período:</strong> ${formatDate(filters.fecha_desde)} al ${formatDate(filters.fecha_hasta)} &nbsp;&nbsp;|&nbsp;&nbsp;
          <strong>Total de registros:</strong> ${results.count}
          ${filters.letter_type_id ? ` &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Tipo de Carta:</strong> ${letterTypes.find(l => l.id === parseInt(filters.letter_type_id))?.description || '-'}` : ''}
          ${filters.financial_entity_id ? ` &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Entidad Financiera:</strong> ${financialEntities.find(f => f.id === parseInt(filters.financial_entity_id))?.description || '-'}` : ''}
          ${filters.contractor ? ` &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Contratista:</strong> ${filters.contractor.data?.business_name || '-'}` : ''}
          ${filters.warranty_object ? ` &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Objeto de Garantía:</strong> ${filters.warranty_object.data?.description?.substring(0, 50) || '-'}...` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">#</th>
              <th style="width: 12%;">Número de Carta</th>
              <th style="width: 10%;">Tipo</th>
              <th style="width: 8%;">Fecha Ejecución</th>
              <th style="width: 14%;">Vigencia Original</th>
              <th style="width: 12%;">Entidad Financiera</th>
              <th style="width: 15%;">Contratista</th>
              <th style="width: 15%;">Objeto de Garantía</th>
              <th style="width: 10%;" class="text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${results.results.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${item.letter_number_orig || '-'}</td>
                <td>${item.letter_type_description || '-'}</td>
                <td class="text-center">${formatDate(item.issue_date) || '-'}</td>
                <td class="text-center">${formatDate(item.validity_start_orig) || '-'} - ${formatDate(item.validity_end_orig) || '-'}</td>
                <td>${item.financial_entity_description_orig || '-'}</td>
                <td>${item.contractor_ruc || '-'} - ${item.contractor_business_name || '-'}</td>
                <td>${(item.warranty_object_description || '-').substring(0, 60)}${(item.warranty_object_description || '').length > 60 ? '...' : ''}</td>
                <td class="text-right amount">${item.symbol_orig || 'S/.'} ${parseFloat(item.amount_orig || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <span>Generado el: ${new Date().toLocaleString('es-PE')}</span>
          <span>Sistema de Gestión de Cartas Fianza - UNF</span>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Esperar a que se cargue el contenido antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Estilos para react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: '2px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#d1d5db',
      },
    }),
  };

  if (loadingCatalogs) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reporte de Cartas Fianza Ejecutadas
            </h1>
            <p className="text-gray-600 mt-1">
              Consulta las cartas fianza ejecutadas en un período específico
            </p>
          </div>
        </div>

        {/* Formulario de filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch}>
            {/* Primera fila: Fecha desde, Fecha hasta, Tipo de carta, Entidad financiera */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Fecha desde */}
              <div>
                <label
                  htmlFor="fecha_desde"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha desde <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_desde"
                  name="fecha_desde"
                  value={filters.fecha_desde}
                  onChange={handleFilterChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label
                  htmlFor="fecha_hasta"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fecha hasta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_hasta"
                  name="fecha_hasta"
                  value={filters.fecha_hasta}
                  onChange={handleFilterChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              {/* Tipo de carta */}
              <div>
                <label
                  htmlFor="letter_type_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tipo de carta
                </label>
                <select
                  id="letter_type_id"
                  name="letter_type_id"
                  value={filters.letter_type_id}
                  onChange={handleFilterChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Todos</option>
                  {letterTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entidad financiera */}
              <div>
                <label
                  htmlFor="financial_entity_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Entidad financiera
                </label>
                <select
                  id="financial_entity_id"
                  name="financial_entity_id"
                  value={filters.financial_entity_id}
                  onChange={handleFilterChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-red-500 focus:ring-red-500"
                >
                  <option value="">Todas</option>
                  {financialEntities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Segunda fila: Contratista, Objeto de garantía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Contratista */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contratista
                </label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  loadOptions={loadContractorOptions}
                  defaultOptions={false}
                  value={filters.contractor}
                  onChange={(selected) =>
                    setFilters((prev) => ({ ...prev, contractor: selected }))
                  }
                  placeholder="Buscar por RUC o nombre..."
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? 'Ingrese al menos 2 caracteres para buscar'
                      : 'No se encontraron contratistas'
                  }
                  loadingMessage={() => 'Buscando...'}
                  styles={selectStyles}
                />
              </div>

              {/* Objeto de garantía */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objeto de garantía
                </label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  loadOptions={loadWarrantyObjectOptions}
                  defaultOptions={false}
                  value={filters.warranty_object}
                  onChange={(selected) =>
                    setFilters((prev) => ({ ...prev, warranty_object: selected }))
                  }
                  placeholder="Buscar por nombre o CUI..."
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? 'Ingrese al menos 2 caracteres para buscar'
                      : 'No se encontraron objetos de garantía'
                  }
                  loadingMessage={() => 'Buscando...'}
                  styles={selectStyles}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Buscar
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Limpiar filtros
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={loading || !results || results.count === 0}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Imprimir
              </button>
            </div>
          </form>
        </div>

        {/* Resultados */}
        {results && (
          <div id="print-content" ref={printRef} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header de resultados */}
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resultados
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({results.count} {results.count === 1 ? 'registro' : 'registros'})
                  </span>
                </h2>
                <span className="text-sm text-gray-600">
                  Período: {formatDate(filters.fecha_desde)} al {formatDate(filters.fecha_hasta)}
                </span>
              </div>
            </div>

            {results.count === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No se encontraron resultados
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intente con otros criterios de búsqueda
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Número de Carta
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha Ejecución
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vigencia Original
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Entidad Financiera
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Contratista
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs"
                      >
                        Objeto de Garantía
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.results.map((item, index) => (
                      <tr key={item.id} className="hover:bg-red-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.letter_number_orig || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.letter_type_description || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                          {formatDate(item.issue_date) || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span className="block">{formatDate(item.validity_start_orig) || '-'}</span>
                          <span className="block text-gray-500">
                            {formatDate(item.validity_end_orig) || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.financial_entity_description_orig || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <span className="block font-medium">{item.contractor_ruc || '-'}</span>
                          <span className="block text-gray-500 text-xs">
                            {item.contractor_business_name || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                          <div className="truncate" title={item.warranty_object_description}>
                            {item.warranty_object_cui && (
                              <span className="text-xs text-gray-400 block">
                                CUI: {item.warranty_object_cui}
                              </span>
                            )}
                            {item.warranty_object_description || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-red-600">
                          {item.symbol_orig || 'S/.'}{' '}
                          {parseFloat(item.amount_orig || 0).toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReporteEjecutadas;

