# 📮 Colección Postman - Cartas Fianza API

## 📦 Archivos Incluidos

Este directorio contiene todo lo necesario para probar el API de Cartas Fianza en Postman:

| Archivo | Descripción |
|---------|-------------|
| **`Postman_Collection_Cartas_Fianza.json`** | Colección completa con todos los endpoints |
| **`Postman_Environment_Development.json`** | Entorno de desarrollo con variables configuradas |
| **`POSTMAN_GUIA_DE_USO.md`** | Guía paso a paso de cómo usar la colección |

---

## 🚀 Inicio Rápido (3 pasos)

### 1. Importar en Postman

1. Abre Postman
2. Click en **Import**
3. Selecciona ambos archivos `.json`:
   - `Postman_Collection_Cartas_Fianza.json`
   - `Postman_Environment_Development.json`
4. Click en **Import**

### 2. Activar el Entorno

- En la esquina superior derecha, selecciona: **"Cartas Fianza - Development"**

### 3. ¡Listo! Ejecuta tu primer request

1. Abre la carpeta **"0. Autenticación"**
2. Ejecuta **"Login - Obtener Token"**
3. El token se guarda automáticamente
4. Ya puedes usar cualquier otro endpoint

---

## ✨ Características

### 🔐 Autenticación Automática
- El login guarda el token automáticamente
- Todos los requests usan el token de forma automática
- No necesitas copiar/pegar tokens manualmente

### 📋 Pre-configurado
- Todos los campos vienen con valores de ejemplo
- Solo necesitas verificar que los IDs existan en tu BD
- Listo para usar sin modificaciones

### 📎 Soporte para Archivos
- Incluye ejemplos para subir archivos PDF
- Instrucciones claras de cómo seleccionar archivos
- Múltiples archivos por garantía

### 📚 Documentación Incluida
- Cada request tiene una descripción
- Campos explicados con tooltips
- Scripts de prueba automáticos

---

## 📂 Estructura de Endpoints

```
📁 Cartas Fianza API
├── 📁 0. Autenticación (Login, Logout, User Info)
├── 📁 1. Catálogos - Listar (6 endpoints)
├── 📁 2. Garantías (6 endpoints CRUD completos)
├── 📁 3. CRUD - Objetos de Garantía
├── 📁 4. CRUD - Tipos de Carta
└── 📁 5. CRUD - Contratistas
```

**Total:** ~20 requests listos para usar

---

## 🎯 Casos de Uso Comunes

### Crear Garantía SIN Archivos
```
1. Login
2. Listar catálogos (obtener IDs)
3. Ejecutar "Crear Garantía SIN Archivos"
✅ Listo en 3 pasos
```

### Crear Garantía CON Archivos
```
1. Login
2. Listar catálogos (obtener IDs)
3. Ejecutar "Crear Garantía CON Archivos"
4. Cambiar TYPE a "File" para los campos de archivo
5. Seleccionar PDFs
✅ Listo en 5 pasos
```

### Listar Todas las Garantías
```
1. Login
2. Ejecutar "Listar Garantías"
✅ Listo en 2 pasos
```

---

## 💡 Tips

1. **Variables de entorno**: Ya configuradas, solo activa el entorno
2. **Token automático**: No necesitas copiarlo manualmente
3. **Ejemplos funcionales**: Todos los requests tienen datos de ejemplo
4. **Form-data**: Para archivos, usa el request "CON Archivos"

---

## 📖 Documentación Completa

Para más detalles, consulta:
- **`POSTMAN_GUIA_DE_USO.md`** - Guía detallada paso a paso
- **`WARRANTY_API.md`** - Documentación técnica del API
- **`WARRANTY_POSTMAN_GUIDE.md`** - Guía visual con tablas

---

## 🆘 Soporte

Si tienes problemas:
1. Consulta `POSTMAN_GUIA_DE_USO.md` - Sección "Solución de Problemas"
2. Verifica que el entorno esté activo
3. Ejecuta el Login primero
4. Verifica que los IDs de los catálogos existan en tu BD

---

## ⚡ Requisitos

- Postman instalado (Desktop o Web)
- Servidor corriendo en `http://localhost:8000`
- Base de datos con datos iniciales (catálogos)
- Usuario de prueba: `test_user` / `testpass123`

---

## 🎉 ¡Disfruta probando el API!

Esta colección te ahorra tiempo y te permite probar todas las funcionalidades del API de Cartas Fianza de forma rápida y sencilla.

**¿Preguntas?** Revisa la documentación incluida.

