# 💰 CRUD de Tipos de Moneda

## ✅ Implementación Completada

Se ha creado el CRUD completo para **Tipos de Moneda** (Currency Types) siguiendo el mismo patrón de diseño y UX que los otros catálogos.

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/pages/CurrencyTypes.js` - Página principal del CRUD

### Archivos Modificados:
- `frontend/src/App.js` - Agregada ruta `/catalogos/tipos-moneda`

## 🎯 Funcionalidades Implementadas

### 1. ✅ Búsqueda Multi-campo
- Búsqueda por **descripción**, **código** o **símbolo**
- Backend busca en los tres campos simultáneamente
- Placeholder: "Busca por descripción, código o símbolo"
- Botón "Buscar" explícito (sin carga inicial)

### 2. ✅ Validación de Código
- **3 caracteres exactos**: Auto-limita mientras escribes
- **Conversión automática a MAYÚSCULAS**: En frontend y backend
- **Código único**: No permite duplicados
- Placeholder ayuda: "Ej: PEN"

### 3. ✅ Campos del Formulario
```javascript
{
  description: string,  // Descripción (máx. 50 caracteres)
  code: string,        // Código ISO (3 caracteres, único, MAYÚSCULAS)
  symbol: string       // Símbolo (máx. 5 caracteres)
}
```

## 🔗 Endpoints Utilizados

```javascript
// Listar todos (búsqueda multi-campo)
GET /api/currency-types/
GET /api/currency-types/?search=PEN  // Busca en description, code y symbol

// Crear nuevo
POST /api/currency-types/
Body: { description, code, symbol }

// Actualizar
PUT /api/currency-types/{id}/
Body: { description, code, symbol }

// Eliminar
DELETE /api/currency-types/{id}/
```

## 🎨 Diseño y UX

### Header
```
┌──────────────────────────────────────────────────────┐
│ Tipos de Moneda         [+ Agregar Tipo de Moneda]  │
└──────────────────────────────────────────────────────┘
```

### Buscador Multi-campo
```
┌──────────────────────────────────────────────────────┐
│ [🔍 Busca por descripción, código o símbolo] [Buscar]│
└──────────────────────────────────────────────────────┘
```

### Cards de Listado (Grid 3 columnas en desktop)
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ S/. [PEN]     ⋮  │  │ $ [USD]       ⋮  │  │ € [EUR]       ⋮  │
│ Nuevos Soles     │  │ Dólares       │  │ Euros         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Características visuales:**
- ✨ Símbolo grande y destacado en color primary
- 🏷️ Badge con código (fondo primary-100, texto primary-800)
- 📱 Responsive: 1 columna (móvil), 2 (tablet), 3 (desktop)

### Modal de Agregar/Editar
```
┌────────────────────────────────────────────┐
│ Agregar Tipo de Moneda                ✕   │
├────────────────────────────────────────────┤
│                                            │
│ Descripción *                              │
│ [____________________________]             │
│  Ej: Nuevos Soles                         │
│                                            │
│ Código *                                   │
│ [___]                                      │
│  Código ISO de 3 caracteres               │
│  (se convertirá a mayúsculas)             │
│                                            │
│ Símbolo *                                  │
│ [_____]                                    │
│  Símbolo de la moneda (máximo 5 caracteres)│
│                                            │
│         [Cancelar]  [Guardar]             │
└────────────────────────────────────────────┘
```

## 🔢 Ejemplos de Datos

### Monedas Comunes

```javascript
// Nuevos Soles (Perú)
{
  description: "Nuevos Soles",
  code: "PEN",
  symbol: "S/."
}

// Dólares Americanos
{
  description: "Dólares Americanos",
  code: "USD",
  symbol: "$"
}

// Euros
{
  description: "Euros",
  code: "EUR",
  symbol: "€"
}

// Libras Esterlinas
{
  description: "Libras Esterlinas",
  code: "GBP",
  symbol: "£"
}

// Yenes Japoneses
{
  description: "Yenes Japoneses",
  code: "JPY",
  symbol: "¥"
}
```

## 📊 Modelo de Datos

```javascript
{
  id: number,                    // ID único
  description: string,           // Descripción (máx. 50 caracteres)
  code: string,                  // Código ISO (3 caracteres, único, MAYÚSCULAS)
  symbol: string,                // Símbolo (máx. 5 caracteres)
  created_by: number,           // ID del usuario que creó
  created_by_name: string,      // Nombre del usuario que creó
  created_at: string,           // Fecha de creación (ISO)
  updated_by: number,           // ID del usuario que actualizó
  updated_by_name: string,      // Nombre del usuario que actualizó
  updated_at: string            // Fecha de actualización (ISO)
}
```

## 🔄 Flujo de Uso

### Buscar Tipos de Moneda
```
1. Usuario escribe término de búsqueda (o deja vacío)
2. Hace clic en "Buscar"
3. Backend busca en description, code y symbol
4. Muestra resultados en grid
```

### Crear Tipo de Moneda
```
1. Click en "Agregar Tipo de Moneda"
2. Modal se abre vacío
3. Usuario llena:
   - Descripción: "Nuevos Soles"
   - Código: "pen" → se convierte a "PEN" automáticamente
   - Símbolo: "S/."
4. Click en "Guardar"
5. Modal se cierra
6. Lista se actualiza
```

### Editar Tipo de Moneda
```
1. Click en menú ⋮ → Editar
2. Modal se abre con datos precargados
3. Usuario modifica datos
4. Código se convierte a MAYÚSCULAS automáticamente
5. Click en "Actualizar"
6. Modal se cierra
7. Lista se actualiza
```

### Eliminar Tipo de Moneda
```
1. Click en menú ⋮ → Eliminar
2. Modal de confirmación aparece
3. Usuario confirma
4. Si está en uso → Error: "No se puede eliminar porque está siendo utilizado en cartas fianza"
5. Si no está en uso → Se elimina exitosamente
```

## 🎯 Validaciones Implementadas

### Frontend
```javascript
✅ Descripción obligatoria (no vacía)
✅ Código obligatorio (no vacío)
✅ Código exactamente 3 caracteres
✅ Código auto-convierte a MAYÚSCULAS mientras escribes
✅ Código auto-limita a 3 caracteres
✅ Símbolo obligatorio (no vacío)
✅ Descripción máximo 50 caracteres
✅ Símbolo máximo 5 caracteres
```

### Backend (API)
```python
✅ Código debe tener 3 caracteres
✅ Código se convierte a MAYÚSCULAS
✅ Código debe ser único (no duplicados)
✅ Descripción no puede estar vacía
✅ Símbolo no puede estar vacío
```

## 🎨 Estilos y Colores

### Símbolo en Card
```css
font-size: 2xl (1.5rem)
font-weight: bold
color: primary-600 (#2c5f8d)
```

### Badge de Código
```css
background: primary-100
color: primary-800
font-size: xs
font-weight: semibold
padding: 0.25rem 0.5rem
border-radius: 0.25rem
```

### Placeholders
```css
color: gray-400  /* Tenue, no parece texto ingresado */
```

## 🔐 Seguridad

- ✅ Ruta protegida con `<PrivateRoute>`
- ✅ Token JWT en todas las peticiones
- ✅ Validación en frontend Y backend
- ✅ Código único (no duplicados)

## 🚀 Acceso

**URL:** `http://localhost:3000/catalogos/tipos-moneda`

**Desde el menú:**
```
Catálogos → Tipos de Moneda
```

## 💡 Casos de Uso

### 1. Registro Inicial del Sistema
```javascript
// Crear las monedas principales para Perú
1. Nuevos Soles (PEN, S/.)
2. Dólares Americanos (USD, $)
```

### 2. Expansión Internacional
```javascript
// Si la universidad tiene proyectos internacionales
3. Euros (EUR, €)
4. Libras Esterlinas (GBP, £)
```

### 3. Búsqueda Rápida
```javascript
// Buscar por símbolo
search = "S/."  → Encuentra "Nuevos Soles"

// Buscar por código
search = "USD"  → Encuentra "Dólares Americanos"

// Buscar por descripción
search = "dólar"  → Encuentra "Dólares Americanos"
```

## 🔍 Ejemplos de Búsqueda

```javascript
// Búsqueda por código
GET /api/currency-types/?search=PEN
→ Retorna: Nuevos Soles

// Búsqueda por símbolo
GET /api/currency-types/?search=$
→ Retorna: Dólares Americanos

// Búsqueda por descripción
GET /api/currency-types/?search=soles
→ Retorna: Nuevos Soles

// Búsqueda parcial
GET /api/currency-types/?search=dól
→ Retorna: Dólares Americanos

// Ver todos
GET /api/currency-types/?page_size=1000
→ Retorna: Todos los tipos de moneda
```

## 🐛 Manejo de Errores

### Código Duplicado
```javascript
// Intentar crear PEN cuando ya existe:
Error: "code: currency type with this code already exists."
Toast: "code: currency type with this code already exists."
```

### Código Inválido (Largo)
```javascript
// Frontend valida antes de enviar:
if (code.length !== 3) {
  toast.error('El código debe tener exactamente 3 caracteres');
  return; // No envía al backend
}
```

### En Uso (No puede eliminar)
```javascript
// Al intentar eliminar una moneda usada en cartas fianza:
if (error.response?.status === 400 || error.response?.status === 409) {
  toast.error('No se puede eliminar porque está siendo utilizado en cartas fianza');
}
```

## 📋 Comparación con Otros CRUDs

| Característica | Objetos Garantía | Entidades Financieras | Contratistas | **Tipos Moneda** |
|----------------|------------------|----------------------|--------------|------------------|
| **Campos** | description, cui | description | business_name, ruc | description, code, symbol |
| **Búsqueda por** | description, cui | description | business_name, ruc | **3 campos** |
| **Validación especial** | CUI opcional | - | RUC 11 dígitos | Código 3 chars MAYÚSCULAS |
| **Layout cards** | Lista vertical | Lista vertical | Lista vertical | **Grid 3 columnas** |
| **Modal reutilizable** | ❌ No | ❌ No | ✅ Sí | ❌ No |
| **Elemento visual** | - | - | - | **Símbolo grande + Badge** |

## ✨ Características Destacadas

1. **Grid de 3 Columnas**: Mejor aprovechamiento del espacio
2. **Símbolo Destacado**: Visual atractivo con el símbolo de la moneda
3. **Badge de Código**: Código ISO visible prominentemente
4. **Búsqueda en 3 Campos**: Máxima flexibilidad de búsqueda
5. **Auto-MAYÚSCULAS**: Código siempre consistente
6. **Auto-límite**: No permite escribir más de 3 caracteres
7. **Responsive**: Se adapta a móvil (1 col), tablet (2 cols), desktop (3 cols)

## 🎓 Patrón de Diseño

**Patrón Utilizado:**
- Controller Pattern (para manejo de estado)
- Form Validation Pattern (validación en múltiples capas)
- Responsive Grid Pattern (layout adaptativo)

**Consistencia:**
- ✅ Mismos colores UNF
- ✅ Mismo flujo de búsqueda
- ✅ Mismos mensajes de error
- ✅ Mismo estilo de modales
- ✅ Misma UX en placeholders

## 🔜 Uso Futuro

### En Formulario de Carta Fianza
```javascript
// Select de tipos de moneda
<select name="currency_type">
  <option value="1">S/. - Nuevos Soles</option>
  <option value="2">$ - Dólares Americanos</option>
</select>
```

### En Reportes
```javascript
// Mostrar montos con símbolo correcto
const amount = 10000;
const currency = currencyTypes.find(c => c.id === warranty.currency_type);
// Muestra: "S/. 10,000.00" o "$ 10,000.00"
```

## 📝 Notas Importantes

1. ⚠️ **Código ISO**: Se recomienda usar códigos ISO 4217 estándar (PEN, USD, EUR, etc.)
2. ⚠️ **Símbolo único**: Un símbolo puede ser usado por múltiples monedas ($)
3. ⚠️ **No eliminar monedas en uso**: El sistema protege contra eliminación accidental
4. ✅ **Mayúsculas automáticas**: No te preocupes por escribir en mayúsculas, se hace automáticamente

## 🎉 Estado de Implementación

```
✅ Página creada y funcional
✅ Ruta agregada a App.js
✅ Sin errores de linter
✅ Validaciones completas
✅ Diseño responsivo
✅ Consistente con otros CRUDs
✅ Documentación completa
```

---

**Implementado por:** Sistema de IA  
**Fecha:** 18 de Noviembre, 2025  
**Ruta:** `/catalogos/tipos-moneda`  
**Estado:** ✅ Completado y funcional  
**Patrón:** Consistente con Objetos de Garantía, Entidades Financieras y Contratistas

