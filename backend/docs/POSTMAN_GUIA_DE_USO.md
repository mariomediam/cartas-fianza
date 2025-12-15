# 📮 Guía de Uso - Colección Postman

## 📥 1. Importar los Archivos en Postman

### Paso 1: Importar la Colección

1. Abre Postman
2. Click en **Import** (botón arriba a la izquierda)
3. Click en **Upload Files**
4. Selecciona el archivo: `Postman_Collection_Cartas_Fianza.json`
5. Click en **Import**

✅ Verás una nueva colección llamada **"Cartas Fianza API"**

### Paso 2: Importar el Entorno (Environment)

1. Click en **Import** nuevamente
2. Selecciona el archivo: `Postman_Environment_Development.json`
3. Click en **Import**

✅ Verás un nuevo entorno llamado **"Cartas Fianza - Development"**

### Paso 3: Activar el Entorno

1. En la esquina superior derecha de Postman, busca el dropdown de entornos
2. Selecciona **"Cartas Fianza - Development"**
3. ✅ El entorno está activo cuando lo ves seleccionado

---

## 🚀 2. Usar la Colección

### 📌 Orden Recomendado de Uso:

#### **PASO 1: Autenticación** 🔐

1. Abre la carpeta **"0. Autenticación"**
2. Ejecuta **"Login - Obtener Token"**
   - Credenciales por defecto: `test_user` / `testpass123`
   - El token se guarda **automáticamente** en la variable `{{auth_token}}`
3. ✅ Ya estás autenticado para todos los demás requests

#### **PASO 2: Consultar Catálogos** 📋

Antes de crear una garantía, necesitas los IDs de los catálogos.

Ejecuta estos requests (carpeta **"1. Catálogos - Listar"**):

1. **Listar Objetos de Garantía** → Anota un `id`
2. **Listar Tipos de Carta** → Anota un `id`
3. **Listar Contratistas** → Anota un `id`
4. **Listar Estados de Garantía** → Anota un `id`
5. **Listar Entidades Financieras** → Anota un `id`
6. **Listar Tipos de Moneda** → Anota un `id`

#### **PASO 3: Crear Garantía** 📝

Ve a la carpeta **"2. Garantías (Warranties)"**

##### Opción A: Sin Archivos
- Ejecuta **"Crear Garantía SIN Archivos"**
- Todos los campos ya están pre-llenados con valores de ejemplo
- Solo verifica que los IDs coincidan con los de tu base de datos

##### Opción B: Con Archivos PDF
- Ejecuta **"Crear Garantía CON Archivos"**
- **⚠️ IMPORTANTE:** Para los campos de archivo:
  1. Busca los campos que terminan en `[file]`
  2. En la columna **TYPE** (derecha), cambia de `Text` a `File`
  3. Aparecerá un botón **"Select Files"**
  4. Click y selecciona tu archivo PDF

---

## 📂 3. Estructura de la Colección

```
📁 Cartas Fianza API
├── 📁 0. Autenticación
│   ├── Login - Obtener Token ⭐ (¡Ejecutar primero!)
│   ├── User Info
│   └── Logout
│
├── 📁 1. Catálogos - Listar
│   ├── Listar Objetos de Garantía
│   ├── Listar Tipos de Carta
│   ├── Listar Contratistas
│   ├── Listar Estados de Garantía
│   ├── Listar Entidades Financieras
│   └── Listar Tipos de Moneda
│
├── 📁 2. Garantías (Warranties)
│   ├── Listar Garantías
│   ├── Obtener Garantía por ID
│   ├── Crear Garantía SIN Archivos ⭐⭐
│   ├── Crear Garantía CON Archivos ⭐⭐⭐
│   ├── Actualizar Garantía
│   └── Eliminar Garantía
│
├── 📁 3. CRUD - Objetos de Garantía
│   └── Crear Objeto de Garantía
│
├── 📁 4. CRUD - Tipos de Carta
│   └── Crear Tipo de Carta
│
└── 📁 5. CRUD - Contratistas
    └── Crear Contratista
```

---

## 🎯 4. Ejemplo Práctico Completo

### Escenario: Crear una garantía con 2 archivos PDF

#### 1️⃣ Login
```
POST /api/auth/login/
Body: { "username": "test_user", "password": "testpass123" }
✅ Token guardado automáticamente
```

#### 2️⃣ Obtener IDs necesarios
```
GET /api/warranty-objects/      → ID: 1
GET /api/letter-types/          → ID: 1
GET /api/contractors/           → ID: 1
GET /api/warranty-statuses/     → ID: 1
GET /api/financial-entities/    → ID: 1
GET /api/currency-types/        → ID: 1
```

#### 3️⃣ Crear Garantía
```
POST /api/warranties/
Body (form-data):
  warranty_object: 1
  letter_type: 1
  contractor: 1
  initial_history[warranty_status]: 1
  initial_history[letter_number]: 010079913-100
  initial_history[financial_entity]: 1
  initial_history[financial_entity_address]: Av. Larco 1301
  initial_history[issue_date]: 2024-01-15
  initial_history[validity_start]: 2024-01-15
  initial_history[validity_end]: 2024-12-31
  initial_history[currency_type]: 1
  initial_history[amount]: 50000.00
  initial_history[files][0][file_name]: Carta Fianza
  initial_history[files][0][file]: [PDF FILE]
  initial_history[files][1][file_name]: Anexo
  initial_history[files][1][file]: [PDF FILE]

✅ Garantía creada con ID: 4
✅ Archivos guardados como:
   - warranty_files/5.pdf
   - warranty_files/6.pdf
```

---

## 🔧 5. Variables de Entorno

La colección usa estas variables:

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `{{base_url}}` | URL base del API | `http://localhost:8000/api` |
| `{{auth_token}}` | Token de autenticación | Se llena automáticamente al hacer login |
| `{{user_id}}` | ID del usuario | Se llena automáticamente al hacer login |

### Cómo ver/editar variables:

1. Click en el ícono del ojo 👁️ (arriba derecha)
2. Verás las variables y sus valores actuales
3. Puedes editar si es necesario

---

## ⚠️ 6. Notas Importantes

### Archivos PDF
- Solo se permiten archivos **PDF**
- Tamaño máximo: **10MB** por archivo
- Los archivos se guardan como: `warranty_files/ID.pdf`
- El `file_name` es el nombre descriptivo (se guarda en BD)
- El nombre físico es el ID del registro

### Fechas
- Formato: `YYYY-MM-DD`
- `validity_end` debe ser mayor a `validity_start`
- `validity_start` debe ser mayor o igual a `issue_date`

### Campos Opcionales
- `initial_history[reference_document]`
- `initial_history[comments]`
- `initial_history[files]` (todos los archivos son opcionales)

### Transacción Atómica
- Al crear una garantía, si algo falla, **nada se guarda**
- Garantía + Historial + Archivos = todo o nada

---

## 🐛 7. Solución de Problemas

### Error 401: "Las credenciales de autenticación no se proveyeron"
**Solución:** 
1. Ejecuta el request "Login - Obtener Token"
2. Verifica que el entorno esté activo (esquina superior derecha)

### Error 400: Validación de campos
**Solución:**
- Lee el mensaje de error en la respuesta
- Verifica que los IDs existan en la base de datos
- Verifica el formato de las fechas (YYYY-MM-DD)

### No puedo seleccionar archivos
**Solución:**
- Asegúrate de cambiar el **TYPE** de `Text` a `File`
- Solo entonces aparecerá el botón "Select Files"

### Los archivos no se están guardando
**Solución:**
- Verifica que sean archivos PDF
- Verifica que no excedan 10MB
- Verifica que el contenedor Docker tenga permisos de escritura en `/app/media/warranty_files/`

---

## 📚 8. Documentación Adicional

Para más detalles técnicos, consulta:

- `WARRANTY_API.md` - Documentación completa del API de garantías
- `WARRANTY_POSTMAN_GUIDE.md` - Guía visual paso a paso
- `AUTH_DOCUMENTATION.md` - Sistema de autenticación

---

## 💡 9. Tips

1. **Guarda tus requests personalizados**: Puedes duplicar requests y modificarlos
2. **Usa variables**: Para valores que cambien seguido (como IDs)
3. **Tests automáticos**: El login ya incluye un test que guarda el token automáticamente
4. **Organiza con carpetas**: Crea subcarpetas para diferentes escenarios de prueba

---

## 🎉 ¡Listo para Usar!

Con esta colección puedes:
- ✅ Probar todos los endpoints del API
- ✅ Crear garantías con/sin archivos
- ✅ Gestionar todos los catálogos
- ✅ Autenticarte automáticamente
- ✅ Ver ejemplos funcionales

**¿Dudas?** Consulta la documentación técnica en los archivos `.md` del proyecto.

