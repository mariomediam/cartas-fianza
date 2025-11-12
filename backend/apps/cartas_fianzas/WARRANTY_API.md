# API de Garantías (Cartas Fianza)

## Descripción General

Esta API permite gestionar garantías (cartas fianza) con su historial y archivos adjuntos. **Al crear una garantía, automáticamente se crea el primer registro de historial**, el cual puede incluir archivos PDF opcionales. Todo esto se maneja dentro de una **transacción atómica**.

**URL Base**: `/api/warranties/`

---

## Características Principales

- ✅ **Transacciones Atómicas**: Al crear una garantía con historial y archivos, todo se guarda o se revierte completamente
- ✅ **Carga de Archivos PDF**: Soporte para subir archivos PDF (máximo 10MB por archivo)
- ✅ **Validaciones**: Fechas, montos, tipos de archivo y tamaños
- ✅ **Historial Completo**: Cada garantía incluye todo su historial de movimientos
- ✅ **Relaciones**: Incluye información de objetos de garantía, tipos de carta y contratistas

---

## Autenticación

Todos los endpoints requieren autenticación mediante Token:

```
Authorization: Token {tu_token_aquí}
```

Para obtener un token, ver `AUTH_DOCUMENTATION.md`.

---

## Estructura de Datos

### Warranty (Garantía)
- `id`: ID único
- `warranty_object`: ID del objeto de garantía (requerido)
- `letter_type`: ID del tipo de carta (requerido)
- `contractor`: ID del contratista (requerido)
- `initial_history`: Historial inicial (solo al crear, requerido)
- `history`: Array de historiales (solo lectura)
- Campos de auditoría y timestamps

### WarrantyHistory (Historial)
- `warranty_status`: ID del estado (requerido)
- `letter_number`: Número de carta fianza (requerido, max 50 caracteres)
- `financial_entity`: ID de la entidad financiera (requerido)
- `financial_entity_address`: Dirección de la entidad (requerido, max 50 caracteres)
- `issue_date`: Fecha de emisión (requerido, formato: YYYY-MM-DD)
- `validity_start`: Inicio de vigencia (requerido, formato: YYYY-MM-DD)
- `validity_end`: Fin de vigencia (requerido, formato: YYYY-MM-DD)
- `currency_type`: ID del tipo de moneda (requerido)
- `amount`: Monto (requerido, decimal, > 0)
- `reference_document`: Documento de referencia (opcional, max 50 caracteres)
- `comments`: Comentarios (opcional, max 1024 caracteres)
- `files`: Array de archivos PDF (opcional)

### WarrantyFile (Archivo)
- `file_name`: Nombre del archivo (requerido, max 128 caracteres)
- `file`: Archivo PDF (requerido, formato: PDF, máx. 10MB)

---

## Validaciones

### Validaciones de Fechas
- `validity_end` debe ser posterior a `validity_start`
- `validity_start` debe ser posterior o igual a `issue_date`

### Validaciones de Archivos
- Solo se permiten archivos **PDF**
- Tamaño máximo: **10MB** por archivo
- Se valida extensión y tipo MIME

### Validaciones de Monto
- El `amount` debe ser mayor a 0

---

## Endpoints Disponibles

### 1. Listar Garantías
**GET** `/api/warranties/`

Lista todas las garantías con su historial completo.

#### Parámetros de Query (opcionales)

- **Búsqueda** (`search`): Busca en descripción del objeto, CUI, razón social del contratista, RUC, número de carta
  - Ejemplo: `/api/warranties/?search=MANTENIMIENTO`

- **Filtrado**:
  - `warranty_object`: ID del objeto de garantía
  - `letter_type`: ID del tipo de carta
  - `contractor`: ID del contratista
  - `warranty_object__cui`: CUI del objeto
  - Ejemplo: `/api/warranties/?contractor=1`

- **Ordenamiento** (`ordering`): 
  - Campos disponibles: `id`, `created_at`, `updated_at`
  - Ejemplo: `/api/warranties/?ordering=-created_at`
  - Por defecto: `-created_at` (más recientes primero)

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranties/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta

```json
[
    {
        "id": 1,
        "warranty_object": 1,
        "warranty_object_description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
        "warranty_object_cui": "2123456",
        "letter_type": 1,
        "letter_type_description": "Fiel cumplimiento de contrato",
        "contractor": 1,
        "contractor_business_name": "CONSTRUCTORA ABC S.A.C.",
        "contractor_ruc": "20123456789",
        "history": [
            {
                "id": 1,
                "warranty_status": 1,
                "warranty_status_description": "Vigente",
                "letter_number": "010079913-000",
                "financial_entity": 1,
                "financial_entity_description": "BANCO DE CREDITO DEL PERU",
                "financial_entity_address": "Av. Principal 123, Lima",
                "issue_date": "2024-01-15",
                "validity_start": "2024-01-15",
                "validity_end": "2024-12-31",
                "currency_type": 1,
                "currency_type_code": "PEN",
                "currency_type_symbol": "S/.",
                "amount": "50000.00",
                "reference_document": "INFORME 3595-2008-DO-OI/MPP 30.09.08",
                "comments": "Garantía inicial del contrato",
                "files": [
                    {
                        "id": 1,
                        "file_name": "carta_fianza_010079913.pdf",
                        "file": "/media/warranty_files/2024/11/12/carta_fianza_010079913.pdf",
                        "created_by": 1,
                        "created_by_name": "test_user",
                        "created_at": "2024-11-12T14:30:00.123456Z"
                    }
                ],
                "created_by": 1,
                "created_by_name": "test_user",
                "created_at": "2024-11-12T14:30:00.123456Z",
                "updated_by": null,
                "updated_by_name": null,
                "updated_at": "2024-11-12T14:30:00.123456Z"
            }
        ],
        "created_by": 1,
        "created_by_name": "test_user",
        "created_at": "2024-11-12T14:30:00.123456Z",
        "updated_by": null,
        "updated_by_name": null,
        "updated_at": "2024-11-12T14:30:00.123456Z"
    }
]
```

---

### 2. Obtener Garantía Específica
**GET** `/api/warranties/{id}/`

Obtiene una garantía específica con todo su historial y archivos.

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranties/1/
Headers:
  Authorization: Token {tu_token}
```

---

### 3. Crear Garantía con Historial y Archivos

**POST** `/api/warranties/`

Crea una nueva garantía con su primer historial. Opcionalmente puede incluir archivos PDF.

**IMPORTANTE**: 
- Esta operación se realiza dentro de una **transacción atómica**. Si algo falla, nada se guarda.
- Debes usar `Content-Type: multipart/form-data` para enviar los datos.
- Los archivos PDF son **opcionales**.

#### Campos Requeridos (Form-data)

En Postman o en tu cliente HTTP, configura el Body como **form-data** y agrega los siguientes campos:

**Datos de la Garantía:**
- `warranty_object`: ID del objeto de garantía (número)
- `letter_type`: ID del tipo de carta (número)
- `contractor`: ID del contratista (número)

**Datos del Historial Inicial:**
- `initial_history[warranty_status]`: ID del estado (número)
- `initial_history[letter_number]`: Número de carta (texto, max 50 caracteres)
- `initial_history[financial_entity]`: ID de entidad financiera (número)
- `initial_history[financial_entity_address]`: Dirección (texto, max 50 caracteres)
- `initial_history[issue_date]`: Fecha de emisión (formato: YYYY-MM-DD)
- `initial_history[validity_start]`: Inicio de vigencia (formato: YYYY-MM-DD)
- `initial_history[validity_end]`: Fin de vigencia (formato: YYYY-MM-DD)
- `initial_history[currency_type]`: ID del tipo de moneda (número)
- `initial_history[amount]`: Monto (decimal)
- `initial_history[reference_document]`: Documento de referencia (texto, opcional)
- `initial_history[comments]`: Comentarios (texto, opcional)

**Archivos (opcionales):**
- `initial_history[files][0][file_name]`: Nombre del archivo 1 (texto)
- `initial_history[files][0][file]`: Archivo PDF 1 (tipo: File)
- `initial_history[files][1][file_name]`: Nombre del archivo 2 (texto)
- `initial_history[files][1][file]`: Archivo PDF 2 (tipo: File)
- ... (puedes agregar más archivos siguiendo el mismo patrón)

#### Ejemplo A: Crear SIN Archivos (Postman - Form-data)

```
POST http://localhost:8000/api/warranties/
Headers:
  Authorization: Token {tu_token}

Body (form-data):
  warranty_object: 1
  letter_type: 1
  contractor: 1
  initial_history[warranty_status]: 1
  initial_history[letter_number]: 010079913-000
  initial_history[financial_entity]: 1
  initial_history[financial_entity_address]: Av. Principal 123, Lima
  initial_history[issue_date]: 2024-01-15
  initial_history[validity_start]: 2024-01-15
  initial_history[validity_end]: 2024-12-31
  initial_history[currency_type]: 1
  initial_history[amount]: 50000.00
  initial_history[reference_document]: INFORME 3595-2008
  initial_history[comments]: Garantía inicial del contrato
```

**Nota**: Simplemente no incluyas los campos de archivos si no vas a subir ninguno.

#### Ejemplo B: Crear CON Archivos (Postman - Form-data)

```
POST http://localhost:8000/api/warranties/
Headers:
  Authorization: Token {tu_token}

Body (form-data):
  warranty_object: 1
  letter_type: 1
  contractor: 1
  initial_history[warranty_status]: 1
  initial_history[letter_number]: 010079913-000
  initial_history[financial_entity]: 1
  initial_history[financial_entity_address]: Av. Principal 123, Lima
  initial_history[issue_date]: 2024-01-15
  initial_history[validity_start]: 2024-01-15
  initial_history[validity_end]: 2024-12-31
  initial_history[currency_type]: 1
  initial_history[amount]: 50000.00
  initial_history[reference_document]: INFORME 3595-2008
  initial_history[comments]: Garantía inicial del contrato
  initial_history[files][0][file_name]: carta_fianza_010079913.pdf
  initial_history[files][0][file]: [SELECCIONAR ARCHIVO PDF - tipo: File]
  initial_history[files][1][file_name]: anexo_contrato.pdf
  initial_history[files][1][file]: [SELECCIONAR ARCHIVO PDF - tipo: File]
```

**Nota**: En Postman, para `form-data`:
1. Selecciona `Body` > `form-data`
2. Agrega cada campo como una fila nueva
3. Para archivos, cambia el tipo de la columna de `Text` a `File`
4. Los campos anidados se escriben con corchetes: `initial_history[campo]`
5. Para arrays de archivos: `initial_history[files][0][campo]`, `initial_history[files][1][campo]`, etc.

#### Ejemplo de Respuesta

```json
{
    "id": 1,
    "warranty_object": 1,
    "warranty_object_description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
    "warranty_object_cui": "2123456",
    "letter_type": 1,
    "letter_type_description": "Fiel cumplimiento de contrato",
    "contractor": 1,
    "contractor_business_name": "CONSTRUCTORA ABC S.A.C.",
    "contractor_ruc": "20123456789",
    "history": [
        {
            "id": 1,
            "warranty_status": 1,
            "warranty_status_description": "Vigente",
            "letter_number": "010079913-000",
            "financial_entity": 1,
            "financial_entity_name": "BANCO DE CREDITO DEL PERU",
            "financial_entity_address": "Av. Principal 123, Lima",
            "issue_date": "2024-01-15",
            "validity_start": "2024-01-15",
            "validity_end": "2024-12-31",
            "currency_type": 1,
            "currency_type_code": "PEN",
            "currency_type_symbol": "S/.",
            "amount": "50000.00",
            "reference_document": "INFORME 3595-2008",
            "comments": "Garantía inicial del contrato",
            "files": [
                {
                    "id": 1,
                    "file_name": "carta_fianza_010079913.pdf",
                    "file": "/media/warranty_files/2024/11/12/carta_fianza_010079913.pdf",
                    "created_by": 1,
                    "created_by_name": "test_user",
                    "created_at": "2024-11-12T14:30:00.123456Z"
                }
            ],
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "2024-11-12T14:30:00.123456Z",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "2024-11-12T14:30:00.123456Z"
        }
    ],
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T14:30:00.123456Z",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "2024-11-12T14:30:00.123456Z"
}
```

---

### 4. Actualizar Garantía (Completo)
**PUT** `/api/warranties/{id}/`

Actualiza completamente una garantía. **NO actualiza el historial** (el historial se maneja por separado).

#### Ejemplo de Petición (Postman)

```
PUT http://localhost:8000/api/warranties/1/
Headers:
  Authorization: Token {tu_token}
  Content-Type: application/json

Body (raw JSON):
{
    "warranty_object": 1,
    "letter_type": 2,
    "contractor": 1
}
```

---

### 5. Actualizar Garantía (Parcial)
**PATCH** `/api/warranties/{id}/`

Actualiza parcialmente una garantía. Solo se envían los campos que se desean cambiar.

#### Ejemplo de Petición (Postman)

```
PATCH http://localhost:8000/api/warranties/1/
Headers:
  Authorization: Token {tu_token}
  Content-Type: application/json

Body (raw JSON):
{
    "letter_type": 2
}
```

---

### 6. Eliminar Garantía
**DELETE** `/api/warranties/{id}/`

Elimina una garantía. **Se eliminarán en cascada todos sus historiales y archivos**.

#### Ejemplo de Petición (Postman)

```
DELETE http://localhost:8000/api/warranties/1/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta

Código de estado: `204 No Content`

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa (GET, PUT, PATCH) |
| 201 | Created - Recurso creado exitosamente (POST) |
| 204 | No Content - Recurso eliminado exitosamente (DELETE) |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado o token inválido |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplos de Errores

### Error de Validación de Fechas (400)

```json
{
    "initial_history": {
        "validity_end": [
            "La fecha de fin de vigencia debe ser posterior a la fecha de inicio"
        ]
    }
}
```

### Error de Archivo No PDF (400)

```json
{
    "initial_history": {
        "files": [
            {
                "file": [
                    "Solo se permiten archivos PDF"
                ]
            }
        ]
    }
}
```

### Error de Monto Inválido (400)

```json
{
    "initial_history": {
        "amount": [
            "El monto debe ser mayor a 0"
        ]
    }
}
```

### Error de Archivo Muy Grande (400)

```json
{
    "initial_history": {
        "files": [
            {
                "file": [
                    "El archivo no debe superar los 10MB"
                ]
            }
        ]
    }
}
```

---

## Uso en React

### Configuración del Cliente con Soporte para Archivos

```javascript
// api/warrantyApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Interceptor para agregar el token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Listar garantías
export const getWarranties = async (params = {}) => {
    const response = await api.get('/warranties/', { params });
    return response.data;
};

// Obtener garantía por ID
export const getWarranty = async (id) => {
    const response = await api.get(`/warranties/${id}/`);
    return response.data;
};

// Crear garantía (con o sin archivos - siempre usa Form-data)
export const createWarranty = async (warrantyData, historyData, files = []) => {
    const formData = new FormData();
    
    // Agregar datos de la garantía
    formData.append('warranty_object', warrantyData.warranty_object);
    formData.append('letter_type', warrantyData.letter_type);
    formData.append('contractor', warrantyData.contractor);
    
    // Agregar datos del historial
    formData.append('initial_history[warranty_status]', historyData.warranty_status);
    formData.append('initial_history[letter_number]', historyData.letter_number);
    formData.append('initial_history[financial_entity]', historyData.financial_entity);
    formData.append('initial_history[financial_entity_address]', historyData.financial_entity_address);
    formData.append('initial_history[issue_date]', historyData.issue_date);
    formData.append('initial_history[validity_start]', historyData.validity_start);
    formData.append('initial_history[validity_end]', historyData.validity_end);
    formData.append('initial_history[currency_type]', historyData.currency_type);
    formData.append('initial_history[amount]', historyData.amount);
    
    if (historyData.reference_document) {
        formData.append('initial_history[reference_document]', historyData.reference_document);
    }
    if (historyData.comments) {
        formData.append('initial_history[comments]', historyData.comments);
    }
    
    // Agregar archivos
    files.forEach((file, index) => {
        formData.append(`initial_history[files][${index}][file_name]`, file.name);
        formData.append(`initial_history[files][${index}][file]`, file);
    });
    
    const response = await api.post('/warranties/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Actualizar garantía
export const updateWarranty = async (id, data) => {
    const response = await api.put(`/warranties/${id}/`, data);
    return response.data;
};

// Actualizar garantía (parcial)
export const patchWarranty = async (id, data) => {
    const response = await api.patch(`/warranties/${id}/`, data);
    return response.data;
};

// Eliminar garantía
export const deleteWarranty = async (id) => {
    const response = await api.delete(`/warranties/${id}/`);
    return response.data;
};

export default api;
```

### Componente de Formulario con Carga de Archivos

```javascript
// components/CreateWarrantyForm.jsx
import React, { useState, useEffect } from 'react';
import { createWarrantyWithFiles } from '../api/warrantyApi';
import { getWarrantyObjects } from '../api/warrantyObjectApi';
import { getLetterTypes } from '../api/letterTypeApi';
import { getContractors } from '../api/contractorApi';
import { getWarrantyStatuses } from '../api/warrantyStatusApi';
import { getFinancialEntities } from '../api/financialEntityApi';
import { getCurrencyTypes } from '../api/currencyTypeApi';

const CreateWarrantyForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Catálogos
    const [warrantyObjects, setWarrantyObjects] = useState([]);
    const [letterTypes, setLetterTypes] = useState([]);
    const [contractors, setContractors] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [financialEntities, setFinancialEntities] = useState([]);
    const [currencyTypes, setCurrencyTypes] = useState([]);
    
    // Datos del formulario
    const [warrantyData, setWarrantyData] = useState({
        warranty_object: '',
        letter_type: '',
        contractor: ''
    });
    
    const [historyData, setHistoryData] = useState({
        warranty_status: '',
        letter_number: '',
        financial_entity: '',
        financial_entity_address: '',
        issue_date: '',
        validity_start: '',
        validity_end: '',
        currency_type: '',
        amount: '',
        reference_document: '',
        comments: ''
    });
    
    const [files, setFiles] = useState([]);
    
    // Cargar catálogos al montar el componente
    useEffect(() => {
        loadCatalogs();
    }, []);
    
    const loadCatalogs = async () => {
        try {
            const [objects, types, contractorsList, statusesList, entities, currencies] = await Promise.all([
                getWarrantyObjects(),
                getLetterTypes(),
                getContractors(),
                getWarrantyStatuses(),
                getFinancialEntities(),
                getCurrencyTypes()
            ]);
            
            setWarrantyObjects(objects);
            setLetterTypes(types);
            setContractors(contractorsList);
            setStatuses(statusesList);
            setFinancialEntities(entities);
            setCurrencyTypes(currencies);
        } catch (err) {
            setError('Error al cargar los catálogos');
            console.error(err);
        }
    };
    
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Validar que sean PDFs
        const invalidFiles = selectedFiles.filter(file => file.type !== 'application/pdf');
        if (invalidFiles.length > 0) {
            setError('Solo se permiten archivos PDF');
            return;
        }
        
        // Validar tamaño (10MB)
        const largeFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
        if (largeFiles.length > 0) {
            setError('Los archivos no deben superar los 10MB');
            return;
        }
        
        setFiles(selectedFiles);
        setError(null);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        try {
            await createWarranty(warrantyData, historyData, files);
            setSuccess(true);
            
            // Limpiar formulario
            setWarrantyData({ warranty_object: '', letter_type: '', contractor: '' });
            setHistoryData({
                warranty_status: '',
                letter_number: '',
                financial_entity: '',
                financial_entity_address: '',
                issue_date: '',
                validity_start: '',
                validity_end: '',
                currency_type: '',
                amount: '',
                reference_document: '',
                comments: ''
            });
            setFiles([]);
            
            // Limpiar input de archivos
            const fileInput = document.getElementById('files');
            if (fileInput) fileInput.value = '';
            
        } catch (err) {
            setError('Error al crear la garantía: ' + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="create-warranty-form">
            <h2>Crear Nueva Garantía</h2>
            
            {error && <div className="error">{error}</div>}
            {success && <div className="success">Garantía creada exitosamente</div>}
            
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos de la Garantía</legend>
                    
                    <div>
                        <label>Objeto de Garantía:</label>
                        <select
                            value={warrantyData.warranty_object}
                            onChange={(e) => setWarrantyData({...warrantyData, warranty_object: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {warrantyObjects.map(obj => (
                                <option key={obj.id} value={obj.id}>
                                    {obj.description} {obj.cui && `(CUI: ${obj.cui})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Tipo de Carta:</label>
                        <select
                            value={warrantyData.letter_type}
                            onChange={(e) => setWarrantyData({...warrantyData, letter_type: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {letterTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.description}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Contratista:</label>
                        <select
                            value={warrantyData.contractor}
                            onChange={(e) => setWarrantyData({...warrantyData, contractor: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {contractors.map(contractor => (
                                <option key={contractor.id} value={contractor.id}>
                                    {contractor.business_name} (RUC: {contractor.ruc})
                                </option>
                            ))}
                        </select>
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Historial Inicial</legend>
                    
                    <div>
                        <label>Estado:</label>
                        <select
                            value={historyData.warranty_status}
                            onChange={(e) => setHistoryData({...historyData, warranty_status: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {statuses.map(status => (
                                <option key={status.id} value={status.id}>{status.description}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Número de Carta:</label>
                        <input
                            type="text"
                            value={historyData.letter_number}
                            onChange={(e) => setHistoryData({...historyData, letter_number: e.target.value})}
                            maxLength={50}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Entidad Financiera:</label>
                        <select
                            value={historyData.financial_entity}
                            onChange={(e) => setHistoryData({...historyData, financial_entity: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {financialEntities.map(entity => (
                                <option key={entity.id} value={entity.id}>{entity.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Dirección de Entidad:</label>
                        <input
                            type="text"
                            value={historyData.financial_entity_address}
                            onChange={(e) => setHistoryData({...historyData, financial_entity_address: e.target.value})}
                            maxLength={50}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Fecha de Emisión:</label>
                        <input
                            type="date"
                            value={historyData.issue_date}
                            onChange={(e) => setHistoryData({...historyData, issue_date: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Inicio de Vigencia:</label>
                        <input
                            type="date"
                            value={historyData.validity_start}
                            onChange={(e) => setHistoryData({...historyData, validity_start: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Fin de Vigencia:</label>
                        <input
                            type="date"
                            value={historyData.validity_end}
                            onChange={(e) => setHistoryData({...historyData, validity_end: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Tipo de Moneda:</label>
                        <select
                            value={historyData.currency_type}
                            onChange={(e) => setHistoryData({...historyData, currency_type: e.target.value})}
                            required
                        >
                            <option value="">Seleccione...</option>
                            {currencyTypes.map(currency => (
                                <option key={currency.id} value={currency.id}>
                                    {currency.description} ({currency.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Monto:</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={historyData.amount}
                            onChange={(e) => setHistoryData({...historyData, amount: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label>Documento de Referencia (opcional):</label>
                        <input
                            type="text"
                            value={historyData.reference_document}
                            onChange={(e) => setHistoryData({...historyData, reference_document: e.target.value})}
                            maxLength={50}
                        />
                    </div>
                    
                    <div>
                        <label>Comentarios (opcional):</label>
                        <textarea
                            value={historyData.comments}
                            onChange={(e) => setHistoryData({...historyData, comments: e.target.value})}
                            maxLength={1024}
                            rows={4}
                        />
                    </div>
                </fieldset>
                
                <fieldset>
                    <legend>Archivos (opcional)</legend>
                    
                    <div>
                        <label>Archivos PDF (máx. 10MB cada uno):</label>
                        <input
                            id="files"
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    
                    {files.length > 0 && (
                        <div>
                            <p>Archivos seleccionados:</p>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </fieldset>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando...' : 'Crear Garantía'}
                </button>
            </form>
        </div>
    );
};

export default CreateWarrantyForm;
```

---

## Notas Importantes

1. **Transacciones Atómicas**: Al crear una garantía con historial y archivos, todo se maneja en una transacción. Si algo falla, nada se guarda.

2. **Solo Form-data**: El endpoint **siempre** usa `Content-Type: multipart/form-data`, incluso cuando no se suben archivos. Esto permite máxima flexibilidad.

3. **Archivos PDF Opcionales**: Los archivos son completamente opcionales. Si no subes archivos, simplemente no incluyas los campos `initial_history[files][...]` en el form-data.

4. **Validación de Archivos**: Solo se permiten archivos PDF con un tamaño máximo de 10MB por archivo.

5. **Historial Inicial Requerido**: Al crear una garantía, siempre debes proporcionar los datos de `initial_history`.

6. **Actualización del Historial**: Para actualizar el historial, se debe usar el endpoint específico de historial (se documentará por separado).

7. **Eliminación en Cascada**: Al eliminar una garantía, se eliminan todos sus historiales y archivos asociados.

8. **Formato de Fechas**: Las fechas deben enviarse en formato `YYYY-MM-DD` y se devuelven en formato ISO 8601. Para mostrar al usuario, usa el formato dd/mm/yyyy HH:MM [[memory:2499711]].

9. **Campos Anidados**: En form-data, los campos anidados se escriben con corchetes: `initial_history[campo]`. Para arrays: `initial_history[files][0][campo]`.

10. **Performance**: El endpoint de listado usa `select_related` y `prefetch_related` para optimizar las consultas a la base de datos.

---

## Próximos Pasos

Para agregar más historiales a una garantía existente (renovaciones, ampliaciones, etc.), se debe crear un endpoint separado para `WarrantyHistory`. Esto se documentará en `WARRANTY_HISTORY_API.md`.

---

## Soporte

Para más información:
- Autenticación: `AUTH_DOCUMENTATION.md`
- Otros endpoints: Ver documentación de cada modelo


