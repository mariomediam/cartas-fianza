import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../services/api';
import Layout from '../components/Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    vencidas: 0,
    porVencer: 0,
    vigentes: 0,
  });
  const [vencidasList, setVencidasList] = useState([]);
  const [porVencerList, setPorVencerList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener datos de los 3 endpoints en paralelo
      const [vencidasRes, porVencerRes, vigentesRes] = await Promise.all([
        api.get('/warranties/vencidas/'),
        api.get('/warranties/por-vencer/'),
        api.get('/warranties/vigentes/')
      ]);

      setStats({
        vencidas: vencidasRes.data.count,
        porVencer: porVencerRes.data.count,
        vigentes: vigentesRes.data.count,
      });

      setVencidasList(vencidasRes.data.results || []);
      setPorVencerList(porVencerRes.data.results || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Combinar las listas de vencidas y por vencer
  const criticalWarranties = [
    ...vencidasList.map(w => ({ ...w, tipo: 'vencida' })),
    ...porVencerList.map(w => ({ ...w, tipo: 'por-vencer' }))
  ].sort((a, b) => new Date(a.validity_end) - new Date(b.validity_end));

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        </div>
      ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
              {/* Vencidas */}
              <div className="bg-white rounded-lg shadow-sm border-l-8 border-red-500 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <span className="text-xl">📄</span>
                      Vencidas
                    </p>
                  </div>
                  <div className="bg-red-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.vencidas}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-red-600 font-medium">
                    {stats.vencidas > 0 ? 'Requieren gestión urgente' : 'Sin cartas vencidas'}
                  </p>
                </div>
              </div>

              {/* Por vencer (1-15 días) */}
              <div className="bg-white rounded-lg shadow-sm border-l-8 border-yellow-500 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <span className="text-xl">⏰</span>
                      Por vencer
                    </p>
                    <p className="text-xs text-gray-500 mt-1">1 a 15 días</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.porVencer}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-yellow-600 font-medium">
                    {stats.porVencer > 0 ? 'Requieren atención próximamente' : 'Sin cartas próximas a vencer'}
                  </p>
                </div>
              </div>

              {/* Vigentes (>15 días) */}
              <div className="bg-white rounded-lg shadow-sm border-l-8 border-green-500 p-6 hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      Por vencer
                    </p>
                    <p className="text-xs text-gray-500 mt-1">&gt; 15 días</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.vigentes}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-green-600 font-medium">
                    Vigentes
                  </p>
                </div>
              </div>
            </div>

          {/* Tabla de cartas vencidas o próximas a vencer */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Cartas fianzas vencidas o próximas a vencer
              </h2>
            </div>

            {criticalWarranties.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Todo en orden!
                </h3>
                <p className="text-gray-600">
                  No hay cartas vencidas ni próximas a vencer en los próximos 15 días.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objeto de la carta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimiento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criticalWarranties.map((warranty, index) => (
                      <tr key={`${warranty.tipo}-${warranty.warranty_id}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {warranty.warranty_object_description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {warranty.letter_type_description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {warranty.letter_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(warranty.validity_end)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {warranty.tipo === 'vencida' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {warranty.time_expired} vencida
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {warranty.time_remaining} para el vencimiento
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
