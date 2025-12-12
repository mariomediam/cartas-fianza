import React, { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import AsyncSelect from 'react-select/async';
import api from '../services/api';
import Layout from '../components/Layout';

const ReporteCertificacion = () => {
  // Estados para filtros
  const [selectedWarrantyObject, setSelectedWarrantyObject] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState(null);

  // Estados para resultados
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Refs para el debounce
  const warrantyObjectDebounceRef = useRef(null);
  const contractorDebounceRef = useRef(null);

  // Función de búsqueda de objetos de garantía
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

  // Función de búsqueda de contratistas
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

    if (!selectedWarrantyObject) {
      toast.error('Debe seleccionar un objeto de garantía');
      return;
    }

    if (!selectedContractor) {
      toast.error('Debe seleccionar un contratista');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/warranties/certificacion/', {
        params: {
          warranty_object_id: selectedWarrantyObject.value,
          contractor_id: selectedContractor.value,
        },
      });
      setResults(response.data);

      if (response.data.count === 0) {
        toast.info('No se encontraron cartas fianza para esta combinación');
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
    setSelectedWarrantyObject(null);
    setSelectedContractor(null);
    setResults(null);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Función para determinar si es estado activo
  const isActiveStatus = (status) => {
    const activeStatuses = ['Emisión', 'Emision', 'Renovación', 'Renovacion', 'Ampliación', 'Ampliacion', 'Reducción', 'Reduccion'];
    return activeStatuses.some(s => status?.toLowerCase().includes(s.toLowerCase()));
  };

  // Manejar impresión - Formato A4 Vertical
  const handlePrint = () => {
    if (!results || results.count === 0) {
      toast.warning('No hay datos para imprimir');
      return;
    }

    const now = new Date();
    const fechaHora = now.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Crear contenido de impresión - Formato A4 Vertical
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificación de Cartas Fianza</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm 20mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12px;
            color: #000;
            background: #fff;
            padding: 0;
            line-height: 1.4;
          }
          .container {
            max-width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          .header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
          }
          .logo-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 120px;
          }
          .logo-section img {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          .logo-section .institution-name {
            font-size: 8px;
            text-align: center;
            margin-top: 5px;
            font-weight: bold;
            line-height: 1.2;
          }
          .title-section {
            flex: 1;
            text-align: center;
            padding-top: 20px;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-section {
            margin: 25px 0;
            padding: 15px 0;
            border-top: 1px solid #333;
            border-bottom: 1px solid #333;
          }
          .info-row {
            margin-bottom: 10px;
            font-size: 11px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-label {
            font-weight: bold;
            display: inline;
          }
          .info-value {
            display: inline;
          }
          .content {
            flex: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 10px;
          }
          th {
            background-color: #f0f0f0;
            border: 1px solid #333;
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
          }
          td {
            border: 1px solid #333;
            padding: 8px 6px;
            vertical-align: middle;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .status-active {
            color: #166534;
            font-weight: bold;
          }
          .status-inactive {
            color: #991b1b;
            font-weight: bold;
          }
          .certification-text {
            margin: 20px 0;
            text-align: justify;
            font-size: 11px;
            line-height: 1.6;
          }
          .footer {
            margin-top: auto;
            padding-top: 40px;
            text-align: left;
            font-size: 10px;
            color: #333;
          }
          @media print {
            body { 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .container {
              min-height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-section">
              <img src="${window.location.origin}/images/logo-unf.png" alt="Logo UNF" onerror="this.style.display='none'"/>
              <div class="institution-name">
                UNIVERSIDAD NACIONAL<br/>DE FRONTERA
              </div>
            </div>
            <div class="title-section">
              <h1 class="title">CERTIFICACIÓN DE CARTAS FIANZA</h1>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">CUI:</span>
              <span class="info-value">${results.warranty_object_cui || 'Sin CUI'} - ${results.warranty_object_description}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Contratista:</span>
              <span class="info-value">${results.contractor_ruc} - ${results.contractor_business_name}</span>
            </div>
          </div>
          
          <div class="content">
            <p class="certification-text">
              Esta Jefatura certifica la vigencia y custodia de las Carta Fianza que garantiza la obra con CUI ${results.warranty_object_cui || 'Sin CUI'} - ${results.warranty_object_description}, a cargo del contratista ${results.contractor_ruc} - ${results.contractor_business_name}, según detalle:
            </p>
            
            <table>
              <thead>
                <tr>
                  <th style="width: 20%;">Tipo de Carta</th>
                  <th style="width: 25%;">Número de Carta</th>
                  <th style="width: 20%;" class="text-right">Importe</th>
                  <th style="width: 18%;" class="text-center">Fecha de Vencimiento</th>
                  <th style="width: 17%;" class="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                ${results.results.map((item) => `
                  <tr>
                    <td>${item.letter_types_description || '-'}</td>
                    <td>${item.letter_number || '-'}</td>
                    <td class="text-right">${item.symbol || 'S/.'} ${parseFloat(item.amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td class="text-center">${formatDate(item.validity_end)}</td>
                    <td class="text-center ${isActiveStatus(item.warranty_statuses_last_description) ? 'status-active' : 'status-inactive'}">${item.warranty_statuses_last_description || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            Piura, ${fechaHora}
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Esperar a que se cargue el contenido antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Estilos para react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: '2px',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#2563eb',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#dbeafe' : 'white',
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
              Certificación de Cartas Fianza
            </h1>
            <p className="text-gray-600 mt-1">
              Genera un certificado de las cartas fianza por objeto de garantía y contratista
            </p>
          </div>
        </div>

        {/* Formulario de filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Objeto de garantía */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objeto de Garantía <span className="text-red-500">*</span>
                </label>
                <AsyncSelect
                  isClearable
                  cacheOptions
                  loadOptions={loadWarrantyObjectOptions}
                  defaultOptions={false}
                  value={selectedWarrantyObject}
                  onChange={(selected) => setSelectedWarrantyObject(selected)}
                  placeholder="Buscar por CUI o descripción..."
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? 'Ingrese al menos 2 caracteres para buscar'
                      : 'No se encontraron objetos de garantía'
                  }
                  loadingMessage={() => 'Buscando...'}
                  styles={selectStyles}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Busque por CUI o nombre del objeto de garantía
                </p>
              </div>

              {/* Contratista */}
              <div>
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
                />
                <p className="mt-1 text-xs text-gray-500">
                  Busque por RUC o razón social del contratista
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading || !selectedWarrantyObject || !selectedContractor}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Información de la selección */}
        {results && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">
              Datos de la Certificación
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="bg-white rounded p-3 border border-blue-100">
                <span className="text-gray-500 font-medium">Objeto de Garantía:</span>
                <p className="text-gray-900 mt-1">
                  <span className="font-semibold">CUI:</span> {results.warranty_object_cui || 'Sin CUI'}
                </p>
                <p className="text-gray-700 text-xs mt-1">{results.warranty_object_description}</p>
              </div>
              <div className="bg-white rounded p-3 border border-blue-100">
                <span className="text-gray-500 font-medium">Contratista:</span>
                <p className="text-gray-900 mt-1">
                  <span className="font-semibold">RUC:</span> {results.contractor_ruc}
                </p>
                <p className="text-gray-700 text-xs mt-1">{results.contractor_business_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header de resultados */}
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
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
                  No hay cartas fianza para esta combinación de objeto de garantía y contratista
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo de Carta
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Número de Carta
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Importe
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Vencimiento
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.results.map((item) => (
                      <tr key={item.warranty_histories_id} className="hover:bg-blue-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {item.letter_types_description || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.letter_number || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-blue-600">
                          {item.symbol || 'S/.'}{' '}
                          {parseFloat(item.amount || 0).toLocaleString('es-PE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600">
                          {formatDate(item.validity_end)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
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

export default ReporteCertificacion;

