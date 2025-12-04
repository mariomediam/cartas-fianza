import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WarrantyObjects from './pages/WarrantyObjects';
import FinancialEntities from './pages/FinancialEntities';
import Contractors from './pages/Contractors';
import CurrencyTypes from './pages/CurrencyTypes';
import LetterTypes from './pages/LetterTypes';
import CartasFianza from './pages/CartasFianza';
import AddWarranty from './pages/AddWarranty';
import ViewWarranty from './pages/ViewWarranty';
import ViewDevolution from './pages/ViewDevolution';
import ViewExecution from './pages/ViewExecution';
import RenewWarranty from './pages/RenewWarranty';
import ReturnWarranty from './pages/ReturnWarranty';
import ExecuteWarranty from './pages/ExecuteWarranty';
import EditEmision from './pages/EditEmision';

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
        <Route 
          path="/catalogos/tipos-moneda" 
          element={
            <PrivateRoute>
              <CurrencyTypes />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/catalogos/tipos-carta" 
          element={
            <PrivateRoute>
              <LetterTypes />
            </PrivateRoute>
          } 
        />
        
        {/* Cartas Fianza */}
        <Route 
          path="/cartas-fianza" 
          element={
            <PrivateRoute>
              <CartasFianza />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/agregar/:warrantyObjectId" 
          element={
            <PrivateRoute>
              <AddWarranty />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/detalle/:warrantyHistoryId" 
          element={
            <PrivateRoute>
              <ViewWarranty />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/detalle-devolucion/:warrantyHistoryId" 
          element={
            <PrivateRoute>
              <ViewDevolution />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/detalle-ejecucion/:warrantyHistoryId" 
          element={
            <PrivateRoute>
              <ViewExecution />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/renovar/:warrantyId" 
          element={
            <PrivateRoute>
              <RenewWarranty />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/devolver/:warrantyId" 
          element={
            <PrivateRoute>
              <ReturnWarranty />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/ejecutar/:warrantyId" 
          element={
            <PrivateRoute>
              <ExecuteWarranty />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cartas-fianza/editar-emision/:warrantyHistoryId" 
          element={
            <PrivateRoute>
              <EditEmision />
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
