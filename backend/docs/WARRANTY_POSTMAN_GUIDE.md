# Guía Rápida - Postman para Warranties

## 📋 Configuración Inicial

1. **URL**: `http://localhost:8000/api/warranties/`
2. **Método**: `POST`
3. **Headers**:
   - `Authorization: Token {tu_token}`
   - ⚠️ **NO agregues** `Content-Type` (Postman lo agrega automáticamente para form-data)

---

## ✅ Ejemplo 1: Crear Garantía SIN Archivos

### Configuración en Postman:

1. Método: **POST**
2. URL: `http://localhost:8000/api/warranties/`
3. **Headers**:
   ```
   Authorization: Token abc123xyz...
   ```

4. **Body** → Selecciona **form-data**

5. Agrega los siguientes **KEY** y **VALUE** (todos tipo **Text**):

| KEY | VALUE | TYPE |
|-----|-------|------|
| `warranty_object` | `1` | Text |
| `letter_type` | `1` | Text |
| `contractor` | `1` | Text |
| `initial_history[warranty_status]` | `1` | Text |
| `initial_history[letter_number]` | `010079913-000` | Text |
| `initial_history[financial_entity]` | `1` | Text |
| `initial_history[financial_entity_address]` | `Av. Larco 1301, Miraflores` | Text |
| `initial_history[issue_date]` | `2024-01-15` | Text |
| `initial_history[validity_start]` | `2024-01-15` | Text |
| `initial_history[validity_end]` | `2024-12-31` | Text |
| `initial_history[currency_type]` | `1` | Text |
| `initial_history[amount]` | `50000.00` | Text |
| `initial_history[reference_document]` | `CONTRATO 001-2024` | Text |
| `initial_history[comments]` | `Garantía de fiel cumplimiento` | Text |

6. Click en **Send**

---

## 📎 Ejemplo 2: Crear Garantía CON Archivos

### Configuración en Postman:

1. Método: **POST**
2. URL: `http://localhost:8000/api/warranties/`
3. **Headers**:
   ```
   Authorization: Token abc123xyz...
   ```

4. **Body** → Selecciona **form-data**

5. Agrega los siguientes **KEY** y **VALUE**:

| KEY | VALUE | TYPE |
|-----|-------|------|
| `warranty_object` | `1` | Text |
| `letter_type` | `1` | Text |
| `contractor` | `1` | Text |
| `initial_history[warranty_status]` | `1` | Text |
| `initial_history[letter_number]` | `010079913-000` | Text |
| `initial_history[financial_entity]` | `1` | Text |
| `initial_history[financial_entity_address]` | `Av. Larco 1301, Miraflores` | Text |
| `initial_history[issue_date]` | `2024-01-15` | Text |
| `initial_history[validity_start]` | `2024-01-15` | Text |
| `initial_history[validity_end]` | `2024-12-31` | Text |
| `initial_history[currency_type]` | `1` | Text |
| `initial_history[amount]` | `50000.00` | Text |
| `initial_history[reference_document]` | `CONTRATO 001-2024` | Text |
| `initial_history[comments]` | `Garantía de fiel cumplimiento` | Text |
| `initial_history[files][0][file_name]` | `carta_fianza.pdf` | Text |
| `initial_history[files][0][file]` | [Seleccionar Archivo] | **File** ⚠️ |
| `initial_history[files][1][file_name]` | `anexo_1.pdf` | Text |
| `initial_history[files][1][file]` | [Seleccionar Archivo] | **File** ⚠️ |

**⚠️ IMPORTANTE**: 
- Para los campos de archivo (`initial_history[files][0][file]`, etc.), debes cambiar el tipo de **Text** a **File** en la columna de la derecha
- Después de cambiar a File, podrás hacer click en "Select Files" para elegir el archivo PDF

6. Click en **Send**

---

## 🔍 Respuesta Esperada

Si todo sale bien, recibirás un **status 201 Created** con un JSON como:

```json
{
    "id": 1,
    "warranty_object": 1,
    "warranty_object_description": "CONSTRUCCION DE LOCAL COMUNAL MULTIUSOS",
    "warranty_object_cui": "2123456",
    "letter_type": 1,
    "letter_type_description": "Adelanto de materiales",
    "contractor": 1,
    "contractor_business_name": "CONSORCIO INFRAESTRUCTURA PERU",
    "contractor_ruc": "20123456789",
    "history": [
        {
            "id": 1,
            "warranty_status": 1,
            "warranty_status_description": "Ampliación",
            "letter_number": "010079913-000",
            "financial_entity": 1,
            "financial_entity_description": "BANCO DE LA NACION",
            "financial_entity_address": "Av. Larco 1301, Miraflores",
            "issue_date": "2024-01-15",
            "validity_start": "2024-01-15",
            "validity_end": "2024-12-31",
            "currency_type": 1,
            "currency_type_code": "USD",
            "currency_type_symbol": "$",
            "amount": "50000.00",
            "reference_document": "CONTRATO 001-2024",
            "comments": "Garantía de fiel cumplimiento",
            "files": [
                {
                    "id": 1,
                    "file_name": "carta_fianza.pdf",
                    "file": "/media/warranty_files/2024/11/12/carta_fianza.pdf",
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

## ❌ Errores Comunes

### Error 401: "Las credenciales de autenticación no se proveyeron"
**Causa**: Falta el header `Authorization` o el token es inválido  
**Solución**: Verifica que el header sea `Authorization: Token {tu_token}`

### Error 400: Validación de fechas
**Causa**: Las fechas no son coherentes  
**Solución**: Verifica que:
- `validity_end` > `validity_start`
- `validity_start` >= `issue_date`

### Error 400: "Solo se permiten archivos PDF"
**Causa**: Intentaste subir un archivo que no es PDF  
**Solución**: Solo archivos con extensión `.pdf`

### Error 400: "El archivo no debe superar los 10MB"
**Causa**: El archivo es muy grande  
**Solución**: Reduce el tamaño del PDF

### Error 400: Campos requeridos faltantes
**Causa**: Falta algún campo obligatorio  
**Solución**: Verifica que todos los campos marcados como requeridos estén presentes

---

## 💡 Tips

1. **Guarda la petición**: En Postman, puedes guardar esta configuración en una colección para reutilizarla

2. **Variables de entorno**: Usa variables de Postman para el token y la URL base:
   - `{{base_url}}` = `http://localhost:8000/api`
   - `{{token}}` = tu token de autenticación

3. **IDs de catálogos**: Antes de crear una garantía, asegúrate de tener creados:
   - Objetos de garantía (`/api/warranty-objects/`)
   - Tipos de carta (`/api/letter-types/`)
   - Contratistas (`/api/contractors/`)
   - Estados (`/api/warranty-statuses/`)
   - Entidades financieras (`/api/financial-entities/`)
   - Tipos de moneda (`/api/currency-types/`)

4. **Sin archivos**: Si no necesitas subir archivos, simplemente no agregues los campos `initial_history[files][...]`

---

## 📚 Documentación Completa

Para más detalles, consulta `WARRANTY_API.md`

