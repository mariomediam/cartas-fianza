# API de Historial de Garantías (WarrantyHistory)

## Descripción General

Esta API permite consultar el historial de garantías con toda la información relacionada. Es de **solo lectura** y optimizada para obtener el detalle completo de un historial específico.

**URL Base**: `/api/warranty-histories/`

---

## Autenticación

Todos los endpoints requieren autenticación mediante Token. Incluye el token en el header de cada petición:

```
Authorization: Token {tu_token_aquí}
```

---

## Conversión de SQL a ORM de Django

### Consulta SQL Original

```sql
SELECT *
FROM warranty_histories
INNER JOIN warranties ON warranty_histories.warranty_id = warranties.id
LEFT JOIN letter_types ON warranties.letter_type_id = letter_types.id
LEFT JOIN financial_entities ON warranty_histories.financial_entity_id = financial_entities.id
LEFT JOIN contractors ON warranties.contractor_id = contractors.id
LEFT JOIN currency_types ON warranty_histories.currency_type_id = currency_types.id
LEFT JOIN warranty_files ON warranty_histories.id = warranty_files.warranty_history_id
WHERE warranty_histories.id = 7;
```

### Conversión a ORM de Django

```python
from apps.cartas_fianzas.models import WarrantyHistory

warranty_history = WarrantyHistory.objects.select_related(
    # INNER JOIN con warranty
    'warranty',
    # Relaciones de warranty (LEFT JOINs)
    'warranty__warranty_object',
    'warranty__letter_type',
    'warranty__contractor',
    # Relaciones directas de warranty_history (LEFT JOINs)
    'financial_entity',
    'currency_type',
    'warranty_status',
    # Información de auditoría
    'created_by',
    'updated_by'
).prefetch_related(
    # LEFT JOIN con warranty_files (relación inversa)
    'files'
).get(id=7)
```

### Explicación de la Conversión

1. **`select_related()`**: Se usa para relaciones `ForeignKey` y `OneToOneField`
   - Realiza un `JOIN` SQL en una sola consulta
   - Ejemplo: `'warranty'`, `'financial_entity'`, `'currency_type'`

2. **`select_related()` con doble underscore**: Permite atravesar relaciones
   - `'warranty__letter_type'` = `warranties.letter_type_id -> letter_types.id`
   - `'warranty__contractor'` = `warranties.contractor_id -> contractors.id`

3. **`prefetch_related()`**: Se usa para relaciones inversas y `ManyToMany`
   - `'files'` = Los archivos relacionados con este historial
   - Hace una consulta separada optimizada

---

## Endpoints Disponibles

### 1. Listar Todos los Historiales de Garantías
**GET** `/api/warranty-histories/`

Retorna una lista paginada de todos los historiales de garantías con información completa.

#### Ejemplo de Petición (curl)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/' \
--header 'Authorization: Token {tu_token}'
```

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranty-histories/
Headers:
  Authorization: Token {tu_token}
```

---

### 2. Obtener un Historial Específico
**GET** `/api/warranty-histories/{id}/`

Obtiene los detalles completos de un historial de garantía específico, incluyendo toda la información relacionada.

#### Parámetros

- **id** (path parameter) - ID del historial de garantía

#### Ejemplo de Petición (curl)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/7/' \
--header 'Authorization: Token {tu_token}'
```

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranty-histories/7/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta Exitosa (200 OK)

```json
{
    "id": 7,
    "letter_number": "0011-0267-9800071157-23",
    "financial_entity_address": "CA-LIBERTAD 7854 - PIURA",
    "issue_date": "2025-10-23",
    "validity_start": "2025-10-23",
    "validity_end": "2026-10-23",
    "amount": "234072.00",
    "reference_document": "INFORME 3595-2008-DO-O/MPP 30.09.08",
    "comments": "ADS 016-2008-CEP/MPP-PRIMERA CONVOCATORIA 40% VALORIZACION 02 SE AMORTIZA AL 100 % LOS ADELANTOS OTORGADOS H/A 016301 13.11.08 S/. 34,023.68",
    
    "warranty_status_id": 1,
    "warranty_status_description": "Vigente",
    "warranty_status_is_active": true,
    
    "financial_entity_id": 2,
    "financial_entity_description": "SCOTIABANK PERU",
    
    "currency_type_id": 2,
    "currency_type_description": "Nuevos Soles",
    "currency_type_code": "PEN",
    "currency_type_symbol": "S/.",
    
    "warranty_id": 5,
    "warranty_object_id": 3,
    "warranty_object_description": "OBRA - MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
    "warranty_object_cui": "2052536260S",
    
    "letter_type_id": 3,
    "letter_type_description": "Adelanto de materiales",
    
    "contractor_id": 1,
    "contractor_business_name": "CONSTRUCTORA INMOBILIARIA L. HOUSE SAC.",
    "contractor_ruc": "20525362605",
    
    "files": [
        {
            "id": 1,
            "file_name": "Carta_Fianza_001.pdf",
            "file": "/media/warranty_files/Carta_Fianza_001.pdf",
            "created_at": "01/12/2025 14:30",
            "created_by": 1,
            "created_by_name": "admin"
        },
        {
            "id": 2,
            "file_name": "Documento_Adicional.pdf",
            "file": "/media/warranty_files/Documento_Adicional.pdf",
            "created_at": "01/12/2025 14:30",
            "created_by": 1,
            "created_by_name": "admin"
        }
    ],
    
    "created_by_id": 1,
    "created_by_username": "admin",
    "created_at": "2025-12-01T14:30:00Z",
    "updated_by_id": null,
    "updated_by_username": null,
    "updated_at": "2025-12-01T14:30:00Z"
}
```

---

## Estructura de la Respuesta

### Campos del Historial de Garantía

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID del historial |
| `letter_number` | string | Número de carta |
| `financial_entity_address` | string | Dirección de la entidad financiera |
| `issue_date` | date | Fecha de emisión |
| `validity_start` | date | Inicio de vigencia |
| `validity_end` | date | Fin de vigencia |
| `amount` | decimal | Monto de la carta |
| `reference_document` | string | Documento de referencia |
| `comments` | string | Observaciones (puede estar vacío) |

### Información del Estado de Garantía

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `warranty_status_id` | integer | ID del estado |
| `warranty_status_description` | string | Descripción del estado (Vigente, Renovación, etc.) |
| `warranty_status_is_active` | boolean | Si el estado es activo |

### Información de la Entidad Financiera

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `financial_entity_id` | integer | ID de la entidad |
| `financial_entity_description` | string | Nombre de la entidad |

### Información del Tipo de Moneda

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `currency_type_id` | integer | ID del tipo de moneda |
| `currency_type_description` | string | Descripción (ej: "Nuevos Soles") |
| `currency_type_code` | string | Código ISO (ej: "PEN") |
| `currency_type_symbol` | string | Símbolo (ej: "S/.") |

### Información de la Garantía

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `warranty_id` | integer | ID de la garantía |
| `warranty_object_id` | integer | ID del objeto de garantía |
| `warranty_object_description` | string | Descripción del objeto de garantía |
| `warranty_object_cui` | string | CUI del objeto de garantía |

### Información del Tipo de Carta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `letter_type_id` | integer | ID del tipo de carta |
| `letter_type_description` | string | Descripción (ej: "Adelanto de materiales") |

### Información del Contratista

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `contractor_id` | integer | ID del contratista |
| `contractor_business_name` | string | Razón social |
| `contractor_ruc` | string | RUC del contratista |

### Archivos Adjuntos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `files` | array | Lista de archivos adjuntos |
| `files[].id` | integer | ID del archivo |
| `files[].file_name` | string | Nombre del archivo |
| `files[].file` | string | URL del archivo |
| `files[].created_at` | datetime | Fecha de creación |
| `files[].created_by` | integer | ID del usuario que lo creó |
| `files[].created_by_name` | string | Nombre del usuario que lo creó |

### Información de Auditoría

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `created_by_id` | integer | ID del usuario creador |
| `created_by_username` | string | Username del creador |
| `created_at` | datetime | Fecha de creación |
| `updated_by_id` | integer | ID del usuario que actualizó |
| `updated_by_username` | string | Username del que actualizó |
| `updated_at` | datetime | Fecha de actualización |

---

## Optimización de Consultas

El ViewSet está optimizado para minimizar las consultas a la base de datos:

### Sin Optimización
- **1 consulta** para obtener el historial
- **1 consulta** para obtener la garantía
- **1 consulta** para obtener el objeto de garantía
- **1 consulta** para obtener el tipo de carta
- **1 consulta** para obtener el contratista
- **1 consulta** para obtener la entidad financiera
- **1 consulta** para obtener el tipo de moneda
- **1 consulta** para obtener el estado
- **N consultas** para obtener los archivos (1 por archivo)

**Total**: ~10+ consultas

### Con Optimización (Implementada)
- **1 consulta** con JOIN para todas las relaciones ForeignKey
- **1 consulta** para obtener todos los archivos relacionados

**Total**: **2 consultas solamente** ✅

---

## Casos de Uso

### 1. Obtener Detalle Completo para Mostrar en Frontend

```javascript
// JavaScript/React ejemplo
const fetchHistoryDetail = async (historyId) => {
  const response = await fetch(`/api/warranty-histories/${historyId}/`, {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  const data = await response.json();
  
  console.log(`Carta: ${data.letter_number}`);
  console.log(`Contratista: ${data.contractor_business_name}`);
  console.log(`Monto: ${data.currency_type_symbol} ${data.amount}`);
  console.log(`Archivos: ${data.files.length}`);
};
```

### 2. Verificar Estado de una Carta

```python
# Python ejemplo
from apps.cartas_fianzas.models import WarrantyHistory

history = WarrantyHistory.objects.select_related(
    'warranty_status'
).get(id=7)

if history.warranty_status.is_active:
    print(f"Carta {history.letter_number} está activa")
else:
    print(f"Carta {history.letter_number} está inactiva")
```

---

## Permisos

- ✅ Requiere autenticación (`IsAuthenticated`)
- ✅ Solo lectura (`ReadOnlyModelViewSet`)
- ❌ No permite crear, actualizar ni eliminar

---

## Notas Importantes

1. **Solo Lectura**: Este endpoint es de solo lectura. Para crear historiales, usar el endpoint de garantías.

2. **Optimización**: Las consultas están optimizadas con `select_related()` y `prefetch_related()`.

3. **Archivos**: Los archivos se retornan como array, puede estar vacío si no hay archivos adjuntos.

4. **Fechas**: Las fechas se retornan en formato ISO 8601 o DD/MM/YYYY según configuración.

5. **Relaciones**: Todas las relaciones están pre-cargadas para evitar el problema N+1.

---

## Ejemplos de Uso con Postman

### Colección Postman

```json
{
  "info": {
    "name": "Warranty History API"
  },
  "item": [
    {
      "name": "Get All Warranty Histories",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Token {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/warranty-histories/",
          "host": ["{{base_url}}"],
          "path": ["api", "warranty-histories"]
        }
      }
    },
    {
      "name": "Get Warranty History Detail",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Token {{token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/warranty-histories/7/",
          "host": ["{{base_url}}"],
          "path": ["api", "warranty-histories", "7"]
        }
      }
    }
  ]
}
```

---

## Resumen

✅ **Endpoint creado**: `/api/warranty-histories/`  
✅ **Consulta SQL convertida a ORM**  
✅ **Optimización implementada** (2 consultas vs 10+)  
✅ **Documentación completa**  
✅ **Solo lectura** (seguro)  
✅ **Autenticación requerida**  

El endpoint está listo para usar y proporciona toda la información necesaria para mostrar el detalle completo de un historial de garantía en el frontend.

