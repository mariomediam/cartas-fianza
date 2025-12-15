# 🖼️ Guía Completa de Imágenes del Sistema

## 📍 Ubicación de la Carpeta

```
C:\Mario2\Docker\cartas-fianza\frontend\public\images\
```

## 🎯 Paso a Paso

### 1️⃣ Abre la Carpeta de Imágenes

```powershell
# Opción 1: Desde el explorador de archivos
Navega a: C:\Mario2\Docker\cartas-fianza\frontend\public\images\

# Opción 2: Desde PowerShell
cd C:\Mario2\Docker\cartas-fianza\frontend\public\images\
explorer .
```

### 2️⃣ Copia tus Imágenes

Necesitas copiar **2 imágenes**:

#### 🏛️ Imagen 1: Logo/Escudo de la Universidad
- **Nombre exacto**: `logo-unf.png`
- **Formatos aceptados**: `.png` (recomendado), `.jpg`, `.svg`
- **¿Dónde se usa?**: En la esquina superior izquierda del formulario de login
- **Tamaño recomendado**: 80x80 a 100x100 píxeles
- **Ejemplo**: El escudo oficial de la Universidad Nacional de Frontera

```
┌─────────────────────────────────────┐
│  [LOGO]  SULLANA                    │
│          UNIVERSIDAD NACIONAL       │
│          DE FRONTERA                │
│─────────────────────────────────────│
│                                     │
│  SISTEMA DE GESTIÓN DE             │
│  CARTAS FIANZA                     │
│                                     │
│  Ingrese a su cuenta               │
│  ...formulario...                  │
└─────────────────────────────────────┘
```

#### 🏢 Imagen 2: Fondo del Login (Oficina/Institucional)
- **Nombre exacto**: `office-background.jpg`
- **Formatos aceptados**: `.jpg` (recomendado), `.png`, `.webp`
- **¿Dónde se usa?**: En todo el lado derecho del login (solo visible en desktop)
- **Tamaño recomendado**: Mínimo 1200x800 píxeles (Full HD: 1920x1080)
- **Ejemplo**: Foto de oficinas de la universidad, edificio institucional, o ambiente profesional

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│   LOGO + FORMULARIO │   IMAGEN DE FONDO   │
│                     │   (Esta imagen)     │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

### 3️⃣ Renombra las Imágenes

**IMPORTANTE**: Los nombres deben ser **exactamente** estos:

✅ **Correcto**:
- `logo-unf.png`
- `office-background.jpg`

❌ **Incorrecto**:
- `Logo-UNF.png` (mayúsculas incorrectas)
- `logo unf.png` (espacio en lugar de guión)
- `escudo.png` (nombre diferente)
- `fondo.jpg` (nombre diferente)

### 4️⃣ Verifica la Estructura

Después de copiar, la carpeta debe verse así:

```
C:\Mario2\Docker\cartas-fianza\frontend\public\images\
├── logo-unf.png              ✅ Tu logo aquí
├── office-background.jpg     ✅ Tu imagen de fondo aquí
└── README.md                 ℹ️ Archivo informativo
```

### 5️⃣ Verifica que Funcionan

1. **Abre tu navegador** en: http://localhost:3000/login

2. **Prueba las URLs directamente**:
   - Logo: http://localhost:3000/images/logo-unf.png
   - Fondo: http://localhost:3000/images/office-background.jpg

3. **Refresca el navegador** (F5 o Ctrl+R)

## 🎨 Ejemplos de Comandos

### Copiar desde otra ubicación:

```powershell
# Copiar el logo
Copy-Item "C:\Descargas\escudo-universidad.png" -Destination "C:\Mario2\Docker\cartas-fianza\frontend\public\images\logo-unf.png"

# Copiar la imagen de fondo
Copy-Item "C:\Descargas\oficina-unf.jpg" -Destination "C:\Mario2\Docker\cartas-fianza\frontend\public\images\office-background.jpg"
```

### Verificar que las imágenes existen:

```powershell
cd C:\Mario2\Docker\cartas-fianza\frontend\public\images\
Get-ChildItem
```

## 🔧 Solución de Problemas

### ❓ Las imágenes no se muestran

**Problema 1**: Nombres incorrectos
- **Solución**: Verifica que los nombres sean exactamente `logo-unf.png` y `office-background.jpg`

**Problema 2**: Extensiones incorrectas
- **Solución**: Si tu logo es `.jpg`, renómbralo a `.png` o actualiza el código

**Problema 3**: Caché del navegador
- **Solución**: Presiona `Ctrl + Shift + R` para forzar la recarga

### ❓ Quiero usar otros nombres de archivo

Si prefieres usar otros nombres (por ejemplo, `escudo.png` en lugar de `logo-unf.png`), debes actualizar estas referencias en el código:

**Para cambiar el nombre del logo:**

Edita: `frontend/src/pages/Login.js` línea 53
```javascript
// Cambiar de:
src="/images/logo-unf.png"
// A:
src="/images/escudo.png"
```

**Para cambiar el nombre de la imagen de fondo:**

Edita: `frontend/src/pages/Login.css` línea 162
```css
/* Cambiar de: */
background-image: url('/images/office-background.jpg');
/* A: */
background-image: url('/images/tu-nombre-de-imagen.jpg');
```

## 📐 Recomendaciones de Diseño

### Para el Logo:
- ✅ **Formato**: PNG con fondo transparente
- ✅ **Tamaño**: 80x80 a 120x120 píxeles
- ✅ **Colores**: Colores institucionales de la universidad
- ✅ **Calidad**: Alta resolución para pantallas Retina (2x)

### Para la Imagen de Fondo:
- ✅ **Formato**: JPG (menor tamaño) o PNG
- ✅ **Dimensiones**: 1920x1080 o mayor
- ✅ **Contenido**: Oficinas, edificio de la universidad, ambiente profesional
- ✅ **Iluminación**: Preferiblemente bien iluminada
- ✅ **Peso**: Optimizar para web (< 500KB idealmente)

## 🎯 Características del Sistema

### Sistema de Fallback

El sistema tiene un **fallback automático**:
- Si `logo-unf.png` no existe, se muestra un logo SVG temporal
- Si `office-background.jpg` no existe, se muestra un fondo de color sólido

Esto significa que **el sistema seguirá funcionando** incluso sin las imágenes, pero se verá mejor con tus imágenes institucionales.

## ✅ Checklist Final

Antes de continuar, asegúrate de:

- [ ] Las imágenes están en `C:\Mario2\Docker\cartas-fianza\frontend\public\images\`
- [ ] El logo se llama exactamente `logo-unf.png` (o `.jpg`, `.svg`)
- [ ] La imagen de fondo se llama exactamente `office-background.jpg` (o `.png`)
- [ ] Has refrescado el navegador (F5)
- [ ] Puedes ver las imágenes en las URLs directas
- [ ] Las imágenes se muestran correctamente en el login

## 🚀 Resultado Final

Una vez que copies las imágenes correctamente, el formulario de login mostrará:

**Lado Izquierdo:**
- ✅ Tu logo/escudo institucional
- ✅ Nombre de la universidad
- ✅ Título del sistema
- ✅ Formulario de login

**Lado Derecho:**
- ✅ Tu imagen institucional de fondo
- ✅ Overlay con degradado azul (para legibilidad)
- ✅ Se oculta automáticamente en móviles

---

**¿Necesitas ayuda adicional?** Consulta el archivo `frontend/INSTRUCCIONES_IMAGENES.md` para más detalles.

