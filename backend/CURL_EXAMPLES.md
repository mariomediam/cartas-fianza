# 🔥 Ejemplos de Curl para Warranties

## ✅ FORMATO SIMPLIFICADO (Nuevo)

Ahora puedes enviar los datos de forma **directa y simple**, sin necesidad de `initial_history[...]`.

---

## 📝 Crear Garantía SIN Archivos

```bash
curl --location 'http://127.0.0.1:8000/api/warranties/' \
--header 'Authorization: Token TU_TOKEN_AQUI' \
--form 'warranty_object="3"' \
--form 'letter_type="3"' \
--form 'contractor="1"' \
--form 'warranty_status="1"' \
--form 'letter_number="00000002-002"' \
--form 'financial_entity="2"' \
--form 'financial_entity_address="Av. Principal 123, Lima"' \
--form 'issue_date="2024-01-15"' \
--form 'validity_start="2024-01-15"' \
--form 'validity_end="2024-12-31"' \
--form 'currency_type="2"' \
--form 'amount="5000"' \
--form 'reference_document="CONTRATO 001-2024"' \
--form 'comments="Garantía inicial"'
```

---

## 📎 Crear Garantía CON Archivos

```bash
curl --location 'http://127.0.0.1:8000/api/warranties/' \
--header 'Authorization: Token TU_TOKEN_AQUI' \
--form 'warranty_object="3"' \
--form 'letter_type="3"' \
--form 'contractor="1"' \
--form 'warranty_status="1"' \
--form 'letter_number="00000002-003"' \
--form 'financial_entity="2"' \
--form 'financial_entity_address="Av. Principal 123, Lima"' \
--form 'issue_date="2024-01-15"' \
--form 'validity_start="2024-01-15"' \
--form 'validity_end="2024-12-31"' \
--form 'currency_type="2"' \
--form 'amount="5000"' \
--form 'reference_document="CONTRATO 001-2024"' \
--form 'comments="Garantía con archivos"' \
--form 'files=@"/ruta/al/archivo1.pdf"' \
--form 'files=@"/ruta/al/archivo2.pdf"'
```

**Nota:** Reemplaza `/ruta/al/archivo1.pdf` con la ruta real de tus archivos PDF.

---

## 📋 Campos Requeridos

### Datos de la Garantía (3 campos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `warranty_object` | int | ID del objeto de garantía |
| `letter_type` | int | ID del tipo de carta |
| `contractor` | int | ID del contratista |

### Datos del Historial (11 campos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `warranty_status` | int | ID del estado |
| `letter_number` | string | Número de carta (máx. 50 caracteres) |
| `financial_entity` | int | ID de la entidad financiera |
| `financial_entity_address` | string | Dirección (máx. 50 caracteres) |
| `issue_date` | date | Fecha de emisión (YYYY-MM-DD) |
| `validity_start` | date | Inicio de vigencia (YYYY-MM-DD) |
| `validity_end` | date | Fin de vigencia (YYYY-MM-DD) |
| `currency_type` | int | ID del tipo de moneda |
| `amount` | decimal | Monto (mayor a 0) |
| `reference_document` | string | Documento de referencia (opcional, máx. 50) |
| `comments` | string | Comentarios (opcional, máx. 1024) |

### Archivos (opcional)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `files` | file[] | Lista de archivos PDF (máx. 10MB cada uno) |

---

## 🔑 Obtener Token

Si necesitas obtener un token:

```bash
curl --location 'http://127.0.0.1:8000/api/auth/login/' \
--header 'Content-Type: application/json' \
--data '{
    "username": "test_user",
    "password": "testpass123"
}'
```

Respuesta:
```json
{
    "token": "686fc5426f0d7f09df219ac2eb18f33660f82271",
    "user_id": 1,
    "username": "test_user"
}
```

---

## 📊 Listar Garantías

```bash
curl --location 'http://127.0.0.1:8000/api/warranties/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

---

## 🔍 Obtener Garantía por ID

```bash
curl --location 'http://127.0.0.1:8000/api/warranties/1/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

---

## ✏️ Actualizar Garantía

```bash
curl --location --request PATCH 'http://127.0.0.1:8000/api/warranties/1/' \
--header 'Authorization: Token TU_TOKEN_AQUI' \
--header 'Content-Type: application/json' \
--data '{
    "letter_type": 2
}'
```

**Nota:** Solo se pueden actualizar los campos de la garantía (warranty_object, letter_type, contractor). El historial NO se puede actualizar por este endpoint.

---

## 🗑️ Eliminar Garantía

```bash
curl --location --request DELETE 'http://127.0.0.1:8000/api/warranties/1/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

⚠️ **PRECAUCIÓN:** Esto eliminará la garantía y todo su historial y archivos (cascada).

---

## 📁 Listar Catálogos

### Objetos de Garantía
```bash
curl --location 'http://127.0.0.1:8000/api/warranty-objects/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

### Tipos de Carta
```bash
curl --location 'http://127.0.0.1:8000/api/letter-types/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

### Contratistas
```bash
curl --location 'http://127.0.0.1:8000/api/contractors/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

### Estados de Garantía
```bash
curl --location 'http://127.0.0.1:8000/api/warranty-statuses/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

### Entidades Financieras
```bash
curl --location 'http://127.0.0.1:8000/api/financial-entities/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

### Tipos de Moneda
```bash
curl --location 'http://127.0.0.1:8000/api/currency-types/' \
--header 'Authorization: Token TU_TOKEN_AQUI'
```

---

## ✅ Respuesta Exitosa

Al crear una garantía, recibirás una respuesta como esta:

```json
{
    "id": 5,
    "warranty_object": 3,
    "warranty_object_description": "MEJORAMIENTO DE INFRAESTRUCTURA VIAL",
    "warranty_object_cui": "2234567",
    "letter_type": 3,
    "letter_type_description": "Garantía por defectos",
    "contractor": 1,
    "contractor_business_name": "CONSORCIO INFRAESTRUCTURA PERU",
    "contractor_ruc": "20123456789",
    "history": [
        {
            "id": 5,
            "warranty_status": 1,
            "warranty_status_description": "Ampliación",
            "letter_number": "00000002-002",
            "financial_entity": 2,
            "financial_entity_description": "BANCO DE LA NACION",
            "financial_entity_address": "Av. Principal 123, Lima",
            "issue_date": "2024-01-15",
            "validity_start": "2024-01-15",
            "validity_end": "2024-12-31",
            "currency_type": 2,
            "currency_type_code": "USD",
            "currency_type_symbol": "$",
            "amount": "5000.00",
            "reference_document": "CONTRATO 001-2024",
            "comments": "Garantía inicial",
            "files": [
                {
                    "id": 5,
                    "file_name": "Formarto Devengado SIAF 0000005773-2025-0002",
                    "file": "warranty_files/5.pdf",
                    "file_url": "http://127.0.0.1:8000/media/warranty_files/5.pdf",
                    "created_by": 1,
                    "created_by_name": "test_user",
                    "created_at": "2024-11-12T19:56:28.123456Z"
                },
                {
                    "id": 6,
                    "file_name": "Formarto Devengado SIAF 0000005751-2025-0002",
                    "file": "warranty_files/6.pdf",
                    "file_url": "http://127.0.0.1:8000/media/warranty_files/6.pdf",
                    "created_by": 1,
                    "created_by_name": "test_user",
                    "created_at": "2024-11-12T19:56:28.123456Z"
                }
            ],
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "2024-11-12T19:56:28.123456Z",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "2024-11-12T19:56:28.123456Z"
        }
    ],
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T19:56:28.123456Z",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "2024-11-12T19:56:28.123456Z"
}
```

---

## ⚠️ Validaciones

### Fechas
- `validity_end` debe ser mayor a `validity_start`
- `validity_start` debe ser mayor o igual a `issue_date`
- Formato: `YYYY-MM-DD`

### Monto
- Debe ser mayor a 0

### Archivos
- Solo archivos **PDF**
- Tamaño máximo: **10MB** por archivo
- Se guardan como: `warranty_files/ID.pdf`
- El nombre descriptivo se toma del nombre original del archivo (sin extensión)

---

## 🎯 Ejemplo Completo

```bash
# 1. Obtener token
TOKEN=$(curl -s --location 'http://127.0.0.1:8000/api/auth/login/' \
--header 'Content-Type: application/json' \
--data '{"username": "test_user", "password": "testpass123"}' | jq -r '.token')

# 2. Crear garantía con archivos
curl --location 'http://127.0.0.1:8000/api/warranties/' \
--header "Authorization: Token $TOKEN" \
--form 'warranty_object="3"' \
--form 'letter_type="3"' \
--form 'contractor="1"' \
--form 'warranty_status="1"' \
--form 'letter_number="00000002-004"' \
--form 'financial_entity="2"' \
--form 'financial_entity_address="Av. Principal 123, Lima"' \
--form 'issue_date="2024-01-15"' \
--form 'validity_start="2024-01-15"' \
--form 'validity_end="2024-12-31"' \
--form 'currency_type="2"' \
--form 'amount="5000"' \
--form 'reference_document="CONTRATO 001-2024"' \
--form 'comments="Garantía inicial"' \
--form 'files=@"/C:/Users/mmedina/Downloads/documento1.pdf"' \
--form 'files=@"/C:/Users/mmedina/Downloads/documento2.pdf"'
```

---

## 💡 Tips

1. **Token**: Guarda el token y reutilízalo en todas las peticiones
2. **IDs**: Asegúrate de que los IDs de los catálogos existan
3. **Rutas de archivos**: Usa rutas absolutas para los archivos
4. **Múltiples archivos**: Puedes agregar tantos `--form 'files=@"ruta"'` como necesites
5. **Nombre de archivo**: El nombre descriptivo se toma automáticamente del nombre del archivo

---

## 🆘 Errores Comunes

### Error 401
```json
{"detail": "Las credenciales de autenticación no se proveyeron."}
```
**Solución:** Verifica que el token sea correcto y esté en el header

### Error 400 - Campo requerido
```json
{"letter_number": ["Este campo es requerido."]}
```
**Solución:** Verifica que todos los campos requeridos estén presentes

### Error 400 - Validación de fechas
```json
{"validity_end": ["La fecha de fin de vigencia debe ser posterior a la fecha de inicio"]}
```
**Solución:** Verifica que `validity_end` > `validity_start`

### Error 400 - Archivo no PDF
```json
{"files": ["Solo se permiten archivos PDF"]}
```
**Solución:** Solo sube archivos con extensión `.pdf`

---

## 🎉 ¡Listo!

Ahora puedes usar el formato **simple y directo** para crear garantías con o sin archivos. 

**No más `initial_history[...]`, solo campos directos!** 🚀

