import React, { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import AsyncSelect from 'react-select/async';
import api from '../services/api';
import Layout from '../components/Layout';

const ReportePorContratista = () => {
  // Estados para filtros
  const [selectedContractor, setSelectedContractor] = useState(null);

  // Estados para resultados
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref para el debounce
  const contractorDebounceRef = useRef(null);

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

  // Manejar búsqueda
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!selectedContractor) {
      toast.error('Debe seleccionar un contratista');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/contractors/${selectedContractor.value}/reporte-cartas/`);
      setResults(response.data);

      if (response.data.count === 0) {
        toast.info('No se encontraron cartas fianza para este contratista');
      } else {
        toast.success(`Se encontraron ${response.data.count} carta(s) fianza`);
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
    setSelectedContractor(null);
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
        <title>Reporte de Cartas Fianza por Contratista</title>
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
            border-bottom: 2px solid #ea580c;
          }
          .header h1 {
            font-size: 18px;
            color: #ea580c;
            margin-bottom: 5px;
            font-weight: 700;
          }
          .header p {
            font-size: 11px;
            color: #5d6d7e;
          }
          .contractor-info {
            background: #fff7ed;
            padding: 12px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 11px;
            border: 1px solid #fed7aa;
          }
          .contractor-info h3 {
            color: #c2410c;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .contractor-info p {
            color: #374151;
            line-height: 1.4;
          }
          .filters-info {
            background: #f0fdf4;
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 10px;
            border: 1px solid #bbf7d0;
          }
          .filters-info strong {
            color: #166534;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 9px;
          }
          th {
            background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
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
            background-color: #fff7ed;
          }
          tr:hover {
            background-color: #ffedd5;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .amount {
            font-weight: 600;
            color: #ea580c;
          }
          .status-active {
            color: #16a34a;
            font-weight: 600;
          }
          .status-inactive {
            color: #dc2626;
            font-weight: 600;
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
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>👷 REPORTE DE CARTAS FIANZA POR CONTRATISTA</h1>
          <p>Universidad Nacional de Frontera - Sistema de Gestión de Cartas Fianza</p>
        </div>
        
        <div class="contractor-info">
          <h3>Contratista</h3>
          <p><strong>ID:</strong> ${results.contractor_id}</p>
          <p><strong>RUC:</strong> ${results.contractor_ruc}</p>
          <p><strong>Razón Social:</strong> ${results.contractor_business_name}</p>
        </div>
        
        <div class="filters-info">
          <strong>Total de cartas fianza:</strong> ${results.count}
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 4%;">#</th>
              <th style="width: 12%;">Número de Carta</th>
              <th style="width: 10%;">Tipo</th>
              <th style="width: 8%;">Fecha Emisión</th>
              <th style="width: 14%;">Vigencia</th>
              <th style="width: 12%;">Entidad Financiera</th>
              <th style="width: 23%;">Objeto de Garantía</th>
              <th style="width: 8%;">Estado</th>
              <th style="width: 9%;" class="text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${results.results.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${item.letter_number || '-'}</td>
                <td>${item.letter_types_description || '-'}</td>
                <td class="text-center">${formatDateForPrint(item.issue_date)}</td>
                <td class="text-center">${formatDateForPrint(item.validity_start)} - ${formatDateForPrint(item.validity_end)}</td>
                <td>${item.financial_entities_description || '-'}</td>
                <td>${(item.warranty_objects_description || '-').substring(0, 60)}${(item.warranty_objects_description || '').length > 60 ? '...' : ''}</td>
                <td class="${isActiveStatus(item.warranty_statuses_last_description) ? 'status-active' : 'status-inactive'}">${item.warranty_statuses_last_description || '-'}</td>
                <td class="text-right amount">${item.symbol || 'S/.'} ${parseFloat(item.amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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

  // Función auxiliar para formatear fecha en impresión
  const formatDateForPrint = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Función para determinar si es estado activo
  const isActiveStatus = (status) => {
    const activeStatuses = ['Emisión', 'Emision', 'Renovación', 'Renovacion', 'Ampliación', 'Ampliacion', 'Reducción', 'Reduccion'];
    return activeStatuses.some(s => status?.toLowerCase().includes(s.toLowerCase()));
  };

  // Estilos para react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: '2px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#f97316',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#ea580c' : state.isFocused ? '#ffedd5' : 'white',
      color: state.isSelected ? 'white' : '#374151',
    }),
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reporte de Cartas Fianza por Contratista
            </h1>
            <p className="text-gray-600 mt-1">
              Consulta todas las cartas fianza asociadas a un contratista específico
            </p>
          </div>
        </div>

        {/* Formulario de filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch}>
            {/* Contratista */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contratista <span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                isClearable
                cacheOptions
                loadOptions={loadContractorOptions}
                defaultOptions={false}
                value={selectedContractor}
                onChange={(selected) => setSelectedContractor(selected)}
                placeholder="Buscar por RUC o razón social..."
                noOptionsMessage={({ inputValue }) =>
                  !inputValue || inputValue.length < 2
                    ? 'Ingrese al menos 2 caracteres para buscar'
                    : 'No se encontraron contratistas'
                }
                loadingMessage={() => 'Buscando...'}
                styles={selectStyles}
                className="max-w-2xl"
              />
              <p className="mt-1 text-xs text-gray-500">
                Busque y seleccione el contratista del cual desea ver las cartas fianza
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || !selectedContractor}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Información del contratista seleccionado */}
        {results && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-orange-800 mb-2">
              Contratista Seleccionado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">ID:</span>
                <span className="ml-2 font-medium text-gray-900">{results.contractor_id}</span>
              </div>
              <div>
                <span className="text-gray-500">RUC:</span>
                <span className="ml-2 font-medium text-gray-900">{results.contractor_ruc}</span>
              </div>
              <div className="md:col-span-3">
                <span className="text-gray-500">Razón Social:</span>
                <span className="ml-2 font-medium text-gray-900">{results.contractor_business_name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header de resultados */}
            <div className="px-6 py-4 border-b border-gray-200 bg-orange-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Cartas Fianza
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({results.count} {results.count === 1 ? 'registro' : 'registros'})
                  </span>
                </h2>
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
                  No se encontraron cartas fianza
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Este contratista no tiene cartas fianza asociadas
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50">
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
                        Fecha Emisión
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vigencia
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Entidad Financiera
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-xs"
                      >
                        Objeto de Garantía
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
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
                      <tr key={item.warranty_histories_id} className="hover:bg-orange-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.letter_number || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.letter_types_description || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(item.issue_date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          <span className="block">{formatDate(item.validity_start)}</span>
                          <span className="block text-orange-600 font-medium">
                            {formatDate(item.validity_end)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {item.financial_entities_description || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                          <div className="truncate" title={item.warranty_objects_description}>
                            {item.cui && (
                              <span className="text-xs text-gray-400 block">
                                CUI: {item.cui}
                              </span>
                            )}
                            {item.warranty_objects_description || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isActiveStatus(item.warranty_statuses_last_description)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.warranty_statuses_last_description || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-orange-600">
                          {item.symbol || 'S/.'}{' '}
                          {parseFloat(item.amount || 0).toLocaleString('es-PE', {
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

export default ReportePorContratista;

