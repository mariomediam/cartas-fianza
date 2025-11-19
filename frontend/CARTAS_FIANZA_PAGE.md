# 📄 Página Cartas Fianza - Documentación

## 📝 Descripción General

Página completa para buscar y visualizar cartas fianza con toda su información anidada (objetos de garantía, garantías e historiales), utilizando acordeones anidados y un timeline visual.

---

## 🎯 Características Implementadas

### ✅ 1. Formulario de Búsqueda

**Ubicación:** Parte superior de la página

**Componentes:**
- **Dropdown de filtro** con 4 opciones:
  - Número de carta (`letter_number`)
  - Objeto de garantía (`description`)
  - Contratista por RUC (`contractor_ruc`)
  - Contratista por Nombre (`contractor_name`)
  
- **Input de búsqueda:** Campo de texto para ingresar el valor a buscar

- **Botón Buscar:** Ejecuta la búsqueda y muestra el estado de carga

**Validaciones:**
- Verifica que el valor de búsqueda no esté vacío
- Muestra mensajes de error o éxito según el resultado

---

### ✅ 2. Visualización de Resultados

#### Estructura Anidada de Acordeones:

```
📦 Objeto de Garantía (Nivel 1)
├── Descripción + CUI
└── Garantías (Nivel 2)
    ├── Tipo de carta + RUC/Nombre contratista + Badge de vencimiento
    └── Timeline de Historial (Nivel 3)
        ├── Estado 1 (Más reciente)
        ├── Estado 2
        └── Estado N (Más antiguo)
```

#### Nivel 1: Objeto de Garantía
- **Encabezado:**
  - Icono de documento
  - Descripción del objeto de garantía (bold)
  - CUI entre paréntesis (si existe)

#### Nivel 2: Garantía
- **Encabezado:**
  - Icono de archivo
  - Descripción del tipo de carta
  - RUC y razón social del contratista
  - **Badge de vencimiento** (derecha):
    - 🔴 Rojo: Si ya está vencida (muestra días vencidos)
    - 🟡 Amarillo: Si faltan entre 1-15 días (muestra días restantes)
    - Sin badge: Si faltan más de 15 días

#### Nivel 3: Timeline de Historial
- **Timeline vertical** con círculos conectados
- **Primer elemento** (más reciente): círculo azul
- **Elementos anteriores:** círculos grises
- **Cada elemento muestra:**
  - Estado de la garantía (Emisión, Renovación, etc.)
  - Número de carta
  - Vigencia (inicio - fin)
  - Monto con símbolo de moneda
  - Fecha de emisión
  - Entidad financiera
  - Documento de referencia
  - Comentarios
  - **Botón "Ver detalle"** (esquina superior derecha)

---

### ✅ 3. Botones de Acción

**Ubicación:** Parte inferior de cada garantía

**Condición de visualización:**
- Solo se muestran si el **último historial** tiene `warranty_status_is_active = true`

**Botones:**
1. **🔄 Renovar** (Azul)
   - Permite renovar la carta fianza
   
2. **✅ Devolver** (Verde)
   - Permite devolver la carta fianza
   
3. **⚠️ Ejecutar** (Rojo)
   - Permite ejecutar la carta fianza

**Estado actual:** Muestran toast de "Función en desarrollo"

---

## 🎨 Diseño y UX

### Colores de Estado:
- 🔴 **Rojo** (`bg-red-100 text-red-800`): Vencidas
- 🟡 **Amarillo** (`bg-yellow-100 text-yellow-800`): Por vencer (1-15 días)
- 🔵 **Azul** (`bg-primary-600`): Historial más reciente
- ⚫ **Gris** (`bg-gray-400`): Historiales anteriores

### Componentes UI:
- **Acordeones:** Flowbite React Accordion
- **Iconos:** SVG inline
- **Notificaciones:** Sonner toast
- **Estilos:** Tailwind CSS

### Responsive:
- Grid adaptativo para información
- Acordeones colapsables
- Scroll automático en contenido largo

---

## 📊 Datos Mostrados

### Objeto de Garantía:
```javascript
{
  id: number,
  description: string,
  cui: string,
  created_by: number,
  created_by_name: string,
  created_at: string,
  updated_by: number,
  updated_by_name: string,
  updated_at: string,
  warranties: Array
}
```

### Garantía:
```javascript
{
  id: number,
  letter_type_id: number,
  letter_type_description: string,
  contractor_id: number,
  contractor_business_name: string,
  contractor_ruc: string,
  warranty_histories: Array
}
```

### Historial de Garantía:
```javascript
{
  id: number,
  warranty_status_id: number,
  warranty_status_description: string,
  warranty_status_is_active: boolean,
  letter_number: string,
  validity_start: string,
  validity_end: string,
  reference_document: string,
  issue_date: string,
  currency_type_id: number,
  currency_type_symbol: string,
  amount: string,
  financial_entity_id: number,
  financial_entity_description: string,
  financial_entity_address: string,
  comments: string
}
```

---

## 🔧 Funciones Principales

### `handleSearch(e)`
Ejecuta la búsqueda llamando al endpoint:
```
GET /api/warranty-objects/buscar/?filter_type={tipo}&filter_value={valor}
```

### `calculateDaysUntilExpiry(validityEnd)`
Calcula los días hasta el vencimiento:
- Parsea fecha en formato DD/MM/YYYY
- Compara con la fecha actual
- Retorna número positivo (días restantes) o negativo (días vencidos)

### `getExpiryBadge(validityEnd)`
Genera el badge de vencimiento según días:
- < 0 días: Badge rojo "Vencida hace X días"
- 1-15 días: Badge amarillo "X días para vencer"
- > 15 días: Sin badge

### `shouldShowActionButtons(warrantyHistories)`
Determina si mostrar los botones de acción:
- Verifica que exista historial
- Verifica que el primer elemento (más reciente) tenga `warranty_status_is_active = true`

---

## 🔌 Integración con API

### Endpoint utilizado:
```
GET /api/warranty-objects/buscar/
```

### Parámetros:
- `filter_type`: Tipo de filtro
- `filter_value`: Valor a buscar

### Respuesta esperada:
```json
{
  "count": number,
  "results": [
    {
      // Objeto de garantía con warranties anidadas
    }
  ]
}
```

---

## 📁 Archivos Modificados/Creados

### ✅ Archivos Creados:
1. **`frontend/src/pages/CartasFianza.js`**
   - Componente principal de la página
   - Lógica de búsqueda y visualización
   - Acordeones anidados y timeline
   - 400+ líneas de código

### ✅ Archivos Modificados:
1. **`frontend/src/App.js`**
   - Agregada importación de `CartasFianza`
   - Agregada ruta `/cartas-fianza`

2. **`frontend/src/flowbite-theme.js`**
   - Agregado `customAccordionTheme` para personalizar acordeones

---

## 🚀 Uso de la Página

### 1. Acceder a la página:
```
http://localhost:3000/cartas-fianza
```

### 2. Realizar una búsqueda:
1. Seleccionar el tipo de filtro en el dropdown
2. Ingresar el valor a buscar
3. Hacer clic en "Buscar"

### 3. Ver resultados:
1. Expandir el acordeón del objeto de garantía
2. Expandir el acordeón de la garantía específica
3. Revisar el timeline del historial
4. Hacer clic en "Ver detalle" para ver más información
5. Usar los botones de acción (si están disponibles)

---

## 🎯 Casos de Uso

### Caso 1: Buscar por número de carta
```
1. Seleccionar "Número de carta"
2. Ingresar "002-00"
3. Buscar
4. Ver todos los objetos de garantía que tienen cartas con ese número
```

### Caso 2: Buscar por contratista
```
1. Seleccionar "Contratista (Nombre)"
2. Ingresar "CANTON"
3. Buscar
4. Ver todos los objetos asociados a ese contratista
```

### Caso 3: Verificar vencimientos
```
1. Realizar cualquier búsqueda
2. Observar los badges de vencimiento:
   - Rojo: Requiere acción urgente
   - Amarillo: Requiere atención próxima
   - Sin badge: Todo en orden
```

---

## 💡 Características Destacadas

### ✨ Visualización Intuitiva
- Acordeones anidados para organizar la información jerárquicamente
- Timeline visual para el historial de estados
- Badges de colores para identificar rápidamente el estado

### ⚡ Rendimiento
- Búsqueda optimizada con el backend (3-4 queries SQL)
- Una sola petición HTTP trae toda la información
- Lazy rendering de acordeones (solo se renderiza lo visible)

### 🎨 UX Mejorada
- Estados de carga visuales
- Mensajes de éxito/error con toast
- Iconos descriptivos
- Diseño responsive
- Información bien organizada y fácil de leer

### 🔒 Validaciones
- Verifica que el valor de búsqueda no esté vacío
- Manejo de errores del API
- Estados vacíos con mensajes amigables

---

## 🧪 Pruebas Sugeridas

### 1. Búsqueda por número de carta:
```
Filtro: "Número de carta"
Valor: "002"
Esperado: Objetos con cartas que contengan "002"
```

### 2. Búsqueda por objeto de garantía:
```
Filtro: "Objeto de garantía"
Valor: "MANTENIMIENTO"
Esperado: Objetos cuya descripción contenga "MANTENIMIENTO"
```

### 3. Búsqueda sin resultados:
```
Filtro: Cualquiera
Valor: "XXXXXXXXXXXXX"
Esperado: Mensaje "No se encontraron resultados"
```

### 4. Búsqueda vacía:
```
Filtro: Cualquiera
Valor: ""
Esperado: Error "Por favor ingrese un valor para buscar"
```

### 5. Verificar badges de vencimiento:
```
Buscar cartas con diferentes fechas de vencimiento
Verificar que los colores sean correctos:
- Rojo para vencidas
- Amarillo para 1-15 días
- Sin badge para >15 días
```

### 6. Verificar botones de acción:
```
Buscar una garantía activa
Verificar que aparezcan los 3 botones (Renovar, Devolver, Ejecutar)
Buscar una garantía inactiva
Verificar que NO aparezcan los botones
```

---

## 🔮 Mejoras Futuras

### Funcionalidades Pendientes:
1. **Implementar formularios de acción:**
   - Formulario de renovación
   - Formulario de devolución
   - Formulario de ejecución

2. **Página de detalle:**
   - Ver toda la información del historial
   - Mostrar archivos adjuntos
   - Historial de cambios

3. **Filtros avanzados:**
   - Filtro por estado de garantía
   - Filtro por entidad financiera
   - Filtro por rango de fechas
   - Filtro por monto

4. **Exportación:**
   - Exportar resultados a Excel
   - Exportar a PDF
   - Imprimir cartas

5. **Ordenamiento:**
   - Ordenar por fecha de vencimiento
   - Ordenar por monto
   - Ordenar por contratista

---

## 📚 Dependencias Utilizadas

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "flowbite-react": "^0.7.x",
  "sonner": "^1.x",
  "tailwindcss": "^3.x"
}
```

---

## 🐛 Solución de Problemas

### Problema: No se muestran resultados
**Solución:** Verificar que el backend esté corriendo y el endpoint esté disponible

### Problema: Acordeones no se expanden
**Solución:** Verificar que flowbite-react esté instalado correctamente

### Problema: Fechas mal formateadas
**Solución:** Verificar que las fechas vengan en formato DD/MM/YYYY desde el backend

### Problema: Botones de acción no aparecen
**Solución:** Verificar que `warranty_status_is_active` esté en true en el último historial

---

## 📞 Contacto y Soporte

Para dudas o mejoras, contactar al equipo de desarrollo o crear un issue en el repositorio del proyecto.

---

## ✅ Checklist de Implementación

- [x] Crear página CartasFianza.js
- [x] Agregar ruta en App.js
- [x] Crear tema de acordeón en flowbite-theme.js
- [x] Implementar formulario de búsqueda
- [x] Implementar acordeones anidados
- [x] Implementar timeline de historial
- [x] Implementar cálculo de días de vencimiento
- [x] Implementar badges de color
- [x] Implementar botones de acción
- [x] Verificar linter (sin errores)
- [x] Crear documentación
- [ ] Implementar formularios de acción (pendiente)
- [ ] Implementar página de detalle (pendiente)
- [ ] Pruebas end-to-end (pendiente)

---

**Última actualización:** 19/11/2025

