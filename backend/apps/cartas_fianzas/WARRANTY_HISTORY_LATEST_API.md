# API - Último Historial de Garantía

## Descripción General

Estos endpoints permiten obtener y validar el último historial de una garantía. Son útiles para validar que solo se pueda modificar el último historial de una garantía.

**URL Base**: `/api/warranty-histories/`

---

## Conversión de SQL a ORM de Django

### Consulta SQL Original

```sql
SELECT warranty_id, MAX(id) AS max_history_id
FROM warranty_histories
WHERE warranty_histories.warranty_id = 2
GROUP BY warranty_id
```

### Conversión a ORM - Opción 1 (Solo el ID máximo)

```python
from django.db.models import Max

result = WarrantyHistory.objects.filter(
    warranty_id=2
).aggregate(max_history_id=Max('id'))

# Retorna: {'max_history_id': 7}
```

### Conversión a ORM - Opción 2 (Objeto completo)

```python
latest_history = WarrantyHistory.objects.filter(
    warranty_id=2
).order_by('-id').first()

# Retorna el objeto WarrantyHistory completo
```

---

## Endpoints Disponibles

### 1. Verificar si un Historial es el Último

**GET** `/api/warranty-histories/{id}/is-latest/`

Verifica si un historial específico es el último (más reciente) de su garantía.

#### Parámetros

- **id** (path parameter) - ID del historial de garantía

#### Caso de Uso

Este endpoint es útil para:
- Validar antes de permitir editar un historial
- Mostrar advertencias en el frontend si no es el último
- Bloquear modificaciones de historiales antiguos

#### Ejemplo de Petición (curl)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/7/is-latest/' \
--header 'Authorization: Token {tu_token}'
```

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranty-histories/7/is-latest/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta (Es el último)

```json
{
    "is_latest": true,
    "history_id": 7,
    "warranty_id": 2,
    "latest_history_id": 7,
    "message": "Este es el último historial de la garantía"
}
```

#### Ejemplo de Respuesta (NO es el último)

```json
{
    "is_latest": false,
    "history_id": 5,
    "warranty_id": 2,
    "latest_history_id": 7,
    "message": "Este NO es el último historial de la garantía"
}
```

#### Campos de la Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `is_latest` | boolean | `true` si es el último historial, `false` si no |
| `history_id` | integer | ID del historial consultado |
| `warranty_id` | integer | ID de la garantía a la que pertenece |
| `latest_history_id` | integer | ID del último historial de esta garantía |
| `message` | string | Mensaje descriptivo |

---

### 2. Obtener el Último Historial de una Garantía

**GET** `/api/warranty-histories/latest-by-warranty/{warranty_id}/`

Obtiene el último (más reciente) historial de una garantía específica con toda su información.

#### Parámetros

- **warranty_id** (path parameter) - ID de la garantía

#### Caso de Uso

Este endpoint es útil para:
- Obtener el estado actual de una garantía
- Mostrar la información más reciente
- Verificar fechas de vigencia actuales

#### Ejemplo de Petición (curl)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/latest-by-warranty/2/' \
--header 'Authorization: Token {tu_token}'
```

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/warranty-histories/latest-by-warranty/2/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta Exitosa (200 OK)

```json
{
    "id": 7,
    "letter_number": "D000-04520649",
    "financial_entity_address": "SAN ISIDRO-LIMA",
    "issue_date": "30/10/2025",
    "validity_start": "30/10/2025",
    "validity_end": "25/02/2026",
    "amount": "1092000.00",
    "reference_document": "INFORME Nº0814-2025-O-ABAST/MPP",
    "comments": "L.P.Nº 001-2025-COMITÉ/MPP-",
    "warranty_status_id": 1,
    "warranty_status_description": "Emisión",
    "warranty_status_is_active": true,
    "financial_entity_id": 4,
    "financial_entity_description": "BCP - BANCO DE CREDITO DEL PERU",
    "currency_type_id": 1,
    "currency_type_description": "Nuevos Soles",
    "currency_type_code": "PEN",
    "currency_type_symbol": "S/.",
    "warranty_id": 2,
    "warranty_object_id": 12,
    "warranty_object_description": "MEJORAMIENTO DE LOS SERVICIOS...",
    "warranty_object_cui": "2523322",
    "letter_type_id": 3,
    "letter_type_description": "Fiel cumplimiento",
    "contractor_id": 10,
    "contractor_business_name": "MCM SOLUTIONS SAC",
    "contractor_ruc": "20520536761",
    "files": [...],
    "created_by_id": 2,
    "created_by_username": "test_user",
    "created_at": "01/12/2025 12:01",
    "updated_by_id": null,
    "updated_by_username": null,
    "updated_at": "01/12/2025 12:01"
}
```

#### Ejemplo de Respuesta de Error (404 Not Found)

```json
{
    "error": "No se encontró historial para la garantía 999"
}
```

---

## Implementación en el Frontend

### Ejemplo 1: Validar antes de permitir editar

```javascript
// En el componente ViewWarranty.js o similar
const checkIfCanEdit = async (historyId) => {
  try {
    const response = await api.get(`/warranty-histories/${historyId}/is-latest/`);
    
    if (response.data.is_latest) {
      // Permitir editar
      navigate(`/cartas-fianza/editar/${historyId}`);
    } else {
      // Mostrar advertencia
      toast.error(
        `No se puede editar este historial. ` +
        `Solo se puede editar el último historial (ID: ${response.data.latest_history_id})`
      );
    }
  } catch (error) {
    toast.error('Error al verificar el historial');
  }
};
```

### Ejemplo 2: Obtener el último historial de una garantía

```javascript
// Obtener el estado actual de una garantía
const getLatestHistory = async (warrantyId) => {
  try {
    const response = await api.get(
      `/warranty-histories/latest-by-warranty/${warrantyId}/`
    );
    
    console.log('Último historial:', response.data);
    console.log('Estado actual:', response.data.warranty_status_description);
    console.log('Vigente hasta:', response.data.validity_end);
    
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      toast.error('Esta garantía no tiene historial');
    } else {
      toast.error('Error al obtener el historial');
    }
  }
};
```

### Ejemplo 3: Botón "Modificar" con validación

```javascript
const handleModificar = async () => {
  const response = await api.get(
    `/warranty-histories/${warrantyHistoryId}/is-latest/`
  );
  
  if (!response.data.is_latest) {
    const confirmEdit = window.confirm(
      'Este NO es el último historial de la garantía. ' +
      'Solo se recomienda editar el último historial. ' +
      '¿Desea continuar de todos modos?'
    );
    
    if (!confirmEdit) {
      return;
    }
  }
  
  // Proceder a editar
  navigate(`/cartas-fianza/editar/${warrantyHistoryId}`);
};
```

---

## Explicación Técnica

### ¿Por qué usar `order_by('-id').first()` en lugar de `aggregate(Max('id'))`?

**Opción 1: aggregate (solo ID)**
```python
result = WarrantyHistory.objects.filter(
    warranty_id=2
).aggregate(max_id=Max('id'))
# Retorna: {'max_id': 7}
# Luego necesitas: WarrantyHistory.objects.get(id=7)
# Total: 2 consultas
```

**Opción 2: order_by + first (objeto completo)**
```python
history = WarrantyHistory.objects.filter(
    warranty_id=2
).order_by('-id').first()
# Retorna: objeto WarrantyHistory completo
# Total: 1 consulta
```

✅ **Opción 2 es más eficiente**: Solo 1 consulta y obtienes el objeto completo.

---

## Casos de Uso Reales

### 1. Validación en Formulario de Edición

**Problema**: Un usuario intenta editar un historial antiguo.

**Solución**:
```python
# En el backend, antes de permitir actualizar
history_id = request.data.get('history_id')
warranty_id = history.warranty_id

latest = WarrantyHistory.objects.filter(
    warranty_id=warranty_id
).order_by('-id').first()

if history_id != latest.id:
    return Response(
        {'error': 'Solo se puede modificar el último historial'},
        status=400
    )
```

### 2. Mostrar Advertencia en el Frontend

**UI mejorada**:
```jsx
{!isLatest && (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
    <div className="flex">
      <AlertIcon className="h-5 w-5 text-yellow-400" />
      <div className="ml-3">
        <p className="text-sm text-yellow-700">
          Este NO es el último historial de la garantía.
          El último es el ID: {latestHistoryId}
        </p>
      </div>
    </div>
  </div>
)}
```

### 3. Bloquear Botón de Edición

```jsx
<button
  onClick={handleModificar}
  disabled={!isLatest}
  className={`px-4 py-2 rounded ${
    isLatest 
      ? 'bg-blue-600 hover:bg-blue-700' 
      : 'bg-gray-400 cursor-not-allowed'
  }`}
>
  {isLatest ? 'Modificar' : 'No se puede modificar (no es el último)'}
</button>
```

---

## Optimización de Consultas

Ambos endpoints están optimizados con `select_related()` y `prefetch_related()`:

```python
WarrantyHistory.objects.filter(
    warranty_id=warranty_id
).select_related(
    'warranty',
    'warranty__warranty_object',
    'warranty__letter_type',
    'warranty__contractor',
    'financial_entity',
    'currency_type',
    'warranty_status',
    'created_by',
    'updated_by'
).prefetch_related(
    'files'
).order_by('-id').first()
```

**Resultado**: Solo 2 consultas SQL totales.

---

## Respuestas de Error

### 404 - Historial no encontrado

```json
{
    "error": "Historial de garantía no encontrado"
}
```

### 404 - No hay historial para la garantía

```json
{
    "error": "No se encontró historial para la garantía 999"
}
```

### 400 - Error general

```json
{
    "error": "Descripción del error"
}
```

---

## Resumen

✅ **Endpoint 1**: Verificar si un historial es el último  
✅ **Endpoint 2**: Obtener el último historial de una garantía  
✅ **Conversión SQL a ORM** documentada  
✅ **Optimización** implementada  
✅ **Casos de uso** explicados  
✅ **Ejemplos de frontend** incluidos  

Estos endpoints son esenciales para implementar la validación de que solo se puede modificar el último historial de una garantía.

