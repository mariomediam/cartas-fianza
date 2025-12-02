# API - Renovar Carta Fianza

## Descripción General

Este endpoint permite renovar una carta fianza creando un nuevo registro en el historial de garantías.

**URL**: `POST /api/warranty-histories/renovar/`

---

## Funcionamiento

Al renovar una carta fianza:
1. Se crea un nuevo registro en `warranty_histories`
2. Se pueden adjuntar archivos PDF
3. La garantía (`warranty`) se mantiene igual
4. El nuevo historial pasa a ser el "último" de la garantía

---

## Validaciones

⚠️ **Validaciones previas:**

1. ✅ La garantía debe existir
2. ✅ La garantía debe tener al menos un historial previo
3. ✅ El último historial debe tener estado **activo** (`is_active=True`)
4. ✅ Las fechas deben ser válidas
5. ✅ El monto debe ser mayor a 0

---

## Endpoint

### POST `/api/warranty-histories/renovar/`

**Content-Type**: `multipart/form-data` (si incluye archivos) o `application/json`

---

## Campos

### Campos Requeridos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `warranty_id` | integer | ID de la garantía a renovar |
| `letter_number` | string | Nuevo número de carta |
| `financial_entity` | integer | ID de la entidad financiera |
| `financial_entity_address` | string | Dirección de la entidad |
| `issue_date` | date | Fecha de emisión (YYYY-MM-DD) |
| `validity_start` | date | Inicio de vigencia (YYYY-MM-DD) |
| `validity_end` | date | Fin de vigencia (YYYY-MM-DD) |
| `currency_type` | integer | ID del tipo de moneda |
| `amount` | decimal | Monto de la renovación |
| `warranty_status` | integer | ID del estado (normalmente "Renovación") |

### Campos Opcionales

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `reference_document` | string | Documento de referencia |
| `comments` | string | Observaciones |
| `files` | file[] | Archivos PDF adjuntos |

---

## Ejemplos de Uso

### Ejemplo 1: Renovar con FormData (con archivos)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/renovar/' \
--header 'Authorization: Token {tu_token}' \
--form 'warranty_id="7"' \
--form 'letter_number="D000-04520650"' \
--form 'financial_entity="4"' \
--form 'financial_entity_address="SAN ISIDRO-LIMA"' \
--form 'issue_date="2026-02-25"' \
--form 'validity_start="2026-02-25"' \
--form 'validity_end="2026-08-25"' \
--form 'currency_type="1"' \
--form 'amount="1100000.00"' \
--form 'warranty_status="2"' \
--form 'reference_document="INFORME Nº0001-2026-RENOVACION"' \
--form 'comments="Renovación por 6 meses adicionales"' \
--form 'files=@"/path/to/carta_renovacion.pdf"'
```

### Ejemplo 2: Renovar con JSON (sin archivos)

```bash
curl --location 'http://localhost:8000/api/warranty-histories/renovar/' \
--header 'Authorization: Token {tu_token}' \
--header 'Content-Type: application/json' \
--data '{
    "warranty_id": 7,
    "letter_number": "D000-04520650",
    "financial_entity": 4,
    "financial_entity_address": "SAN ISIDRO-LIMA",
    "issue_date": "2026-02-25",
    "validity_start": "2026-02-25",
    "validity_end": "2026-08-25",
    "currency_type": 1,
    "amount": "1100000.00",
    "warranty_status": 2,
    "reference_document": "INFORME Nº0001-2026-RENOVACION",
    "comments": "Renovación por 6 meses adicionales"
}'
```

---

## Respuestas

### Respuesta Exitosa (201 Created)

Retorna el nuevo historial completo:

```json
{
    "id": 8,
    "letter_number": "D000-04520650",
    "financial_entity_address": "SAN ISIDRO-LIMA",
    "issue_date": "25/02/2026",
    "validity_start": "25/02/2026",
    "validity_end": "25/08/2026",
    "amount": "1100000.00",
    "reference_document": "INFORME Nº0001-2026-RENOVACION",
    "comments": "Renovación por 6 meses adicionales",
    "warranty_status_id": 2,
    "warranty_status_description": "Renovación",
    "warranty_status_is_active": true,
    "financial_entity_id": 4,
    "financial_entity_description": "BCP - BANCO DE CREDITO DEL PERU",
    "currency_type_id": 1,
    "currency_type_description": "Nuevos Soles",
    "currency_type_code": "PEN",
    "currency_type_symbol": "S/.",
    "warranty_id": 7,
    "warranty_object_id": 12,
    "warranty_object_description": "MEJORAMIENTO DE LOS SERVICIOS...",
    "warranty_object_cui": "2523322",
    "letter_type_id": 3,
    "letter_type_description": "Fiel cumplimiento",
    "contractor_id": 10,
    "contractor_business_name": "MCM SOLUTIONS SAC",
    "contractor_ruc": "20520536761",
    "files": [
        {
            "id": 10,
            "file_name": "carta_renovacion.pdf",
            "file": "http://127.0.0.1:8000/media/warranty_files/10.pdf",
            "created_by": 2,
            "created_by_name": "test_user",
            "created_at": "02/12/2025 15:30"
        }
    ],
    "created_by_id": 2,
    "created_by_username": "test_user",
    "created_at": "02/12/2025 15:30",
    "updated_by_id": null,
    "updated_by_username": null,
    "updated_at": "02/12/2025 15:30"
}
```

---

## Errores

### Error: warranty_id no proporcionado (400)

```json
{
    "error": "El campo warranty_id es requerido"
}
```

### Error: Garantía no existe (404)

```json
{
    "error": "No se encontró la garantía con ID 999"
}
```

### Error: Garantía sin historial (400)

```json
{
    "error": "La garantía no tiene historial"
}
```

### Error: Estado no activo (400)

```json
{
    "error": "Solo se puede renovar una carta con estado activo",
    "current_status": "Devuelto",
    "is_active": false
}
```

### Error: Campos faltantes (400)

```json
{
    "error": "Campos requeridos faltantes: letter_number, amount"
}
```

### Error: Fechas inválidas (400)

```json
{
    "error": "La fecha de fin de vigencia debe ser posterior al inicio"
}
```

### Error: Monto inválido (400)

```json
{
    "error": "El monto debe ser mayor a 0"
}
```

---

## Implementación en Frontend

### Ejemplo React

```javascript
const renovarCarta = async (warrantyId, formData) => {
  try {
    // Preparar FormData
    const data = new FormData();
    
    data.append('warranty_id', warrantyId);
    data.append('letter_number', formData.letter_number);
    data.append('financial_entity', formData.financial_entity);
    data.append('financial_entity_address', formData.financial_entity_address);
    data.append('issue_date', formData.issue_date);
    data.append('validity_start', formData.validity_start);
    data.append('validity_end', formData.validity_end);
    data.append('currency_type', formData.currency_type);
    data.append('amount', formData.amount);
    data.append('warranty_status', formData.warranty_status); // ID del estado "Renovación"
    
    if (formData.reference_document) {
      data.append('reference_document', formData.reference_document);
    }
    
    if (formData.comments) {
      data.append('comments', formData.comments);
    }
    
    // Archivos
    if (formData.files && formData.files.length > 0) {
      formData.files.forEach(file => {
        data.append('files', file);
      });
    }
    
    // Enviar
    const response = await api.post('/warranty-histories/renovar/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    toast.success('Carta renovada correctamente');
    return response.data;
    
  } catch (error) {
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Error al renovar la carta');
    }
    throw error;
  }
};
```

### Uso

```javascript
// Desde el componente
const handleRenovar = async () => {
  const formData = {
    letter_number: 'D000-04520650',
    financial_entity: 4,
    financial_entity_address: 'SAN ISIDRO-LIMA',
    issue_date: '2026-02-25',
    validity_start: '2026-02-25',
    validity_end: '2026-08-25',
    currency_type: 1,
    amount: '1100000.00',
    warranty_status: 2, // ID del estado "Renovación"
    reference_document: 'INFORME 001-2026',
    comments: 'Renovación por 6 meses',
    files: selectedFiles, // Array de File objects
  };
  
  await renovarCarta(warrantyId, formData);
  navigate('/cartas-fianza');
};
```

---

## Flujo de Renovación

```
1. Usuario hace clic en "Renovar" en una carta activa
   ↓
2. Frontend verifica que el último historial sea activo (opcional, ya valida backend)
   ↓
3. Usuario llena formulario de renovación (nuevos datos)
   ↓
4. Frontend envía POST /api/warranty-histories/renovar/
   ↓
5. Backend valida:
   - warranty_id existe
   - Último historial es activo
   - Fechas válidas
   - Monto > 0
   ↓
6. Backend crea nuevo registro en warranty_histories
   ↓
7. Backend crea registros en warranty_files (si hay archivos)
   ↓
8. Backend retorna el nuevo historial completo (201 Created)
   ↓
9. Frontend muestra mensaje de éxito y actualiza la vista
```

---

## Consideraciones Importantes

1. **Estado de Renovación**: Asegúrate de que el `warranty_status` que envíes corresponda a "Renovación" y tenga `is_active=True` para permitir futuras renovaciones.

2. **Fechas continuas**: Normalmente el `validity_start` de la renovación debe ser igual o posterior al `validity_end` del historial anterior.

3. **Archivos opcionales**: No es obligatorio adjuntar archivos.

4. **Historial preservado**: El historial anterior NO se modifica, solo se agrega uno nuevo.

5. **Auditoría**: El `created_by` se asigna automáticamente al usuario autenticado.

---

## Resumen

✅ **Endpoint creado**: `POST /api/warranty-histories/renovar/`  
✅ **Validación de estado activo** implementada  
✅ **Validación de fechas y montos**  
✅ **Soporte para archivos PDF**  
✅ **Respuesta con historial completo**  
✅ **Errores descriptivos**  
✅ **Documentación completa**  

El endpoint está listo para usar en el frontend para implementar la funcionalidad de renovación de cartas fianza.

