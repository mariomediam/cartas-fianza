import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WarrantyObjects from './pages/WarrantyObjects';
import FinancialEntities from './pages/FinancialEntities';
import Contractors from './pages/Contractors';

function App() {
  return (
    <Router>
      {/* Toaster de Sonner para notificaciones globales */}
      <Toaster 
        position="top-right" 
        expand={false}
        richColors
        closeButton
        duration={4000}
      />

      <Routes>
        {/* Ruta raíz redirige al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Ruta de login (pública) */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Catálogos */}
        <Route 
          path="/catalogos/objetos-garantia" 
          element={
            <PrivateRoute>
              <WarrantyObjects />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/catalogos/entidades-financieras" 
          element={
            <PrivateRoute>
              <FinancialEntities />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/catalogos/contratistas" 
          element={
            <PrivateRoute>
              <Contractors />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta 404 - redirige al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
