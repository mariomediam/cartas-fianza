# 📸 Instrucciones para Agregar Imágenes

## 📁 Ubicación de las Imágenes

Debes copiar tus imágenes en la siguiente carpeta:

```
C:\Mario2\Docker\cartas-fianza\frontend\public\images\
```

## 🖼️ Imágenes Requeridas

### 1. **Logo/Escudo de la Universidad**
   - **Nombre del archivo**: `logo-unf.png` (o `.jpg`, `.svg`)
   - **Ubicación**: `frontend/public/images/logo-unf.png`
   - **Uso**: Se muestra en el formulario de login (lado izquierdo)
   - **Recomendaciones**:
     - Tamaño recomendado: 80x80 píxeles o similar
     - Formato preferido: PNG con fondo transparente
     - También puede ser SVG para mejor calidad

### 2. **Imagen de Fondo (Oficina)**
   - **Nombre del archivo**: `office-background.jpg` (o `.png`)
   - **Ubicación**: `frontend/public/images/office-background.jpg`
   - **Uso**: Se muestra en el lado derecho del login
   - **Recomendaciones**:
     - Tamaño mínimo: 1200x800 píxeles
     - Formato preferido: JPG (menor peso)
     - Puede ser cualquier imagen relacionada con oficina, universidad, o institucional

## 📋 Pasos para Agregar las Imágenes

### Opción 1: Copiar manualmente (Recomendado)

1. Abre el explorador de archivos de Windows
2. Navega a: `C:\Mario2\Docker\cartas-fianza\frontend\public\images\`
3. Copia tus imágenes en esa carpeta
4. Asegúrate de que tengan los nombres correctos:
   - `logo-unf.png` (o el formato que uses)
   - `office-background.jpg` (o el formato que uses)

### Opción 2: Usando PowerShell

```powershell
# Copiar logo
Copy-Item "RUTA\A\TU\LOGO.png" -Destination "C:\Mario2\Docker\cartas-fianza\frontend\public\images\logo-unf.png"

# Copiar imagen de fondo
Copy-Item "RUTA\A\TU\IMAGEN.jpg" -Destination "C:\Mario2\Docker\cartas-fianza\frontend\public\images\office-background.jpg"
```

## 🔄 Después de Copiar las Imágenes

1. **NO es necesario reiniciar el frontend** - Los archivos en `public/` se sirven directamente
2. **Refresca el navegador** (F5 o Ctrl+R) para ver los cambios
3. Si las imágenes no aparecen, verifica:
   - ✅ Los nombres de archivo coinciden exactamente
   - ✅ Las extensiones son correctas (.png, .jpg, .svg)
   - ✅ Las imágenes están en la carpeta correcta

## 📐 Formatos Soportados

El sistema soporta los siguientes formatos de imagen:
- ✅ **PNG** (recomendado para logo con transparencia)
- ✅ **JPG/JPEG** (recomendado para fotos de fondo)
- ✅ **SVG** (recomendado para logo si está en vectores)
- ✅ **WEBP** (formato moderno, menor peso)

## 🎨 Nombres de Archivo Alternativos

Si tus imágenes tienen otros nombres, puedes usar estos nombres alternativos:

### Para el Logo:
- `logo-unf.png`
- `logo-unf.jpg`
- `logo-unf.svg`
- `escudo-universidad.png`

### Para el Fondo:
- `office-background.jpg`
- `office-background.png`
- `login-background.jpg`
- `fondo-oficina.jpg`

**IMPORTANTE**: Si usas nombres diferentes, debes actualizar las referencias en los archivos:
- `frontend/src/pages/Login.js` (para el logo)
- `frontend/src/pages/Login.css` (para el fondo)

## 🔍 Verificar que las Imágenes se Cargaron

Después de copiar las imágenes, puedes verificar que estén accesibles:

1. Abre tu navegador
2. Visita:
   - Logo: `http://localhost:3000/images/logo-unf.png`
   - Fondo: `http://localhost:3000/images/office-background.jpg`
3. Si se muestran las imágenes, están correctamente configuradas

## ⚠️ Problemas Comunes

### La imagen no se muestra
- **Problema**: Nombre de archivo incorrecto
- **Solución**: Verifica que el nombre coincida exactamente (mayúsculas/minúsculas importan)

### La imagen se ve pixelada
- **Problema**: Imagen muy pequeña
- **Solución**: Usa una imagen de mayor resolución

### La página de login no actualiza
- **Problema**: Caché del navegador
- **Solución**: Presiona Ctrl+Shift+R para hacer un hard refresh

## 📞 Ejemplo Completo

```
frontend/
└── public/
    └── images/
        ├── logo-unf.png          ← Tu logo/escudo aquí
        └── office-background.jpg  ← Tu imagen de fondo aquí
```

Una vez que copies las imágenes en esta carpeta, el sistema las utilizará automáticamente. ✅

