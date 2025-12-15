# 🧪 Guía de Pruebas - Sistema de Login

## ✅ Estado del Sistema

- ✅ Frontend compilado correctamente
- ✅ Sonner (notificaciones) configurado
- ✅ Zustand (estado) funcionando
- ✅ Sistema listo para probar

---

## 🔍 Pruebas del Sistema de Login

### 1. **Probar Mensaje de Error - Campos Vacíos**

**Pasos:**
1. Abre http://localhost:3000/login
2. Deja los campos vacíos
3. Haz clic en "Ingresar"

**Resultado Esperado:**
- ❌ Debe aparecer una notificación ROJA en la esquina superior derecha
- 📝 Mensaje: "Por favor ingrese usuario y contraseña"
- ⏱️ Duración: 4 segundos
- ❌ NO debe redirigir al dashboard

---

### 2. **Probar Mensaje de Error - Credenciales Incorrectas**

**Pasos:**
1. Abre http://localhost:3000/login
2. Ingresa:
   - Usuario: `usuario_incorrecto`
   - Contraseña: `password_incorrecto`
3. Haz clic en "Ingresar"

**Resultado Esperado:**
- ❌ Debe aparecer una notificación ROJA en la esquina superior derecha
- 📝 Mensaje: "Credenciales inválidas"
- ⏱️ Duración: 4 segundos
- ❌ NO debe redirigir al dashboard
- 🔄 El botón debe volver a "Ingresar" (no "Ingresando...")

---

### 3. **Probar Mensaje de Éxito - Credenciales Correctas**

**Pasos:**
1. Abre http://localhost:3000/login
2. Ingresa:
   - Usuario: `test_user`
   - Contraseña: `testpass123`
3. Haz clic en "Ingresar"

**Resultado Esperado:**
- ✅ Debe aparecer una notificación VERDE en la esquina superior derecha
- 📝 Mensaje: "¡Bienvenido! Sesión iniciada correctamente"
- ⏱️ Duración: 4 segundos
- ✅ DEBE redirigir automáticamente al dashboard
- 👤 Debe mostrar el nombre de usuario en el dashboard

---

## 🎨 Aspecto de las Notificaciones

### Notificación de Error (Roja)
```
╔════════════════════════════════════════╗
║  ❌  Credenciales inválidas      [X]  ║
╚════════════════════════════════════════╝
```

### Notificación de Éxito (Verde)
```
╔════════════════════════════════════════╗
║  ✅  ¡Bienvenido! Sesión iniciada      ║
║      correctamente               [X]   ║
╚════════════════════════════════════════╝
```

### Posición: **Top-Right** (Esquina superior derecha)

---

## 🔧 Solución de Problemas

### ❓ Las notificaciones NO aparecen

**Posibles causas:**

1. **El navegador tiene caché antigua**
   ```
   Solución: Presiona Ctrl + Shift + R para hard refresh
   ```

2. **Sonner no se instaló correctamente**
   ```bash
   # Verificar instalación
   docker exec cartas_fianzas_frontend_dev npm list sonner
   
   # Si no está instalado
   docker exec cartas_fianzas_frontend_dev npm install sonner
   docker-compose -f docker-compose.dev.yml restart frontend
   ```

3. **El Toaster no está en App.js**
   - Verifica que `App.js` tenga el componente `<Toaster />` de Sonner
   - Debe estar dentro de `<Router>` pero fuera de `<Routes>`

4. **Error de JavaScript en consola**
   - Abre las DevTools del navegador (F12)
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Copia el error y revísalo

---

### ❓ El mensaje aparece pero desaparece muy rápido

**Solución:**
Cambiar la duración en `App.js`:

```jsx
<Toaster 
  position="top-right" 
  expand={false}
  richColors
  closeButton
  duration={8000}  // Cambiar a 8 segundos
/>
```

---

### ❓ El mensaje aparece en el lugar incorrecto

**Posiciones disponibles:**
```jsx
// Esquina superior derecha (actual)
position="top-right"

// Otras opciones:
position="top-left"
position="top-center"
position="bottom-right"
position="bottom-left"
position="bottom-center"
```

---

### ❓ Quiero que el mensaje no se cierre automáticamente

```jsx
<Toaster 
  position="top-right" 
  expand={false}
  richColors
  closeButton
  duration={Infinity}  // No se cierra automáticamente
/>
```

---

## 🧪 Pruebas Adicionales del Dashboard

### 4. **Probar Logout con Notificación**

**Pasos:**
1. Inicia sesión con `test_user` / `testpass123`
2. Estás en el dashboard
3. Haz clic en "Cerrar Sesión"

**Resultado Esperado:**
- ✅ Debe aparecer una notificación VERDE
- 📝 Mensaje: "Sesión cerrada correctamente"
- ⏱️ Duración: 4 segundos
- ✅ DEBE redirigir automáticamente al login

---

## 📊 Checklist de Funcionalidad

Marca cada prueba completada:

- [ ] ❌ Mensaje de error: campos vacíos
- [ ] ❌ Mensaje de error: credenciales incorrectas
- [ ] ✅ Mensaje de éxito: login correcto
- [ ] ✅ Mensaje de éxito: logout
- [ ] 📍 Notificaciones aparecen en top-right
- [ ] ⏱️ Notificaciones duran 4 segundos
- [ ] 🎨 Notificaciones tienen colores correctos (verde/rojo)
- [ ] 🔘 Notificaciones tienen botón de cerrar [X]
- [ ] 📱 Notificaciones funcionan en móvil

---

## 🎯 Casos de Prueba Específicos

### Caso 1: Usuario no existe
```
Usuario: usuario_que_no_existe
Contraseña: cualquier_cosa
Esperado: ❌ "Credenciales inválidas"
```

### Caso 2: Contraseña incorrecta
```
Usuario: test_user
Contraseña: password_incorrecta
Esperado: ❌ "Credenciales inválidas"
```

### Caso 3: Solo espacios en blanco
```
Usuario: "   " (solo espacios)
Contraseña: "   " (solo espacios)
Esperado: ❌ "Por favor ingrese usuario y contraseña"
```

### Caso 4: Usuario correcto, contraseña vacía
```
Usuario: test_user
Contraseña: (vacío)
Esperado: ❌ "Por favor ingrese usuario y contraseña"
```

### Caso 5: Login correcto
```
Usuario: test_user
Contraseña: testpass123
Esperado: ✅ "¡Bienvenido! Sesión iniciada correctamente"
          → Redirige al dashboard
```

---

## 🎥 Video de Demostración Esperado

1. **T=0s**: Usuario abre http://localhost:3000/login
2. **T=1s**: Ingresa credenciales incorrectas
3. **T=2s**: Hace clic en "Ingresar"
4. **T=2.5s**: Botón cambia a "Ingresando..."
5. **T=3s**: Aparece notificación roja: "Credenciales inválidas"
6. **T=3.5s**: Botón vuelve a "Ingresar"
7. **T=7s**: Notificación desaparece automáticamente
8. **T=8s**: Usuario ingresa credenciales correctas
9. **T=9s**: Hace clic en "Ingresar"
10. **T=9.5s**: Aparece notificación verde: "¡Bienvenido!"
11. **T=10s**: Redirige automáticamente al dashboard

---

## 🐛 Reporte de Bugs

Si encuentras algún problema, anota:

1. **¿Qué hiciste?**
   - Ejemplo: "Ingresé credenciales incorrectas y hice clic en Ingresar"

2. **¿Qué esperabas?**
   - Ejemplo: "Esperaba ver una notificación roja con el mensaje de error"

3. **¿Qué pasó realmente?**
   - Ejemplo: "No apareció ninguna notificación"

4. **¿Hay errores en la consola?**
   - Abre F12 → Console → Copia los errores en rojo

5. **¿En qué navegador?**
   - Chrome, Firefox, Edge, Safari, etc.

---

## ✅ Verificación Rápida

Ejecuta este comando para verificar que todo está corriendo:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Deberías ver:
```
NAMES                         STATUS
cartas_fianzas_frontend_dev   Up X minutes
cartas_fianzas_backend_dev    Up X minutes
cartas_fianzas_db_dev         Up X minutes (healthy)
```

---

## 📞 Comandos de Ayuda

```bash
# Ver logs del frontend en tiempo real
docker logs cartas_fianzas_frontend_dev -f

# Ver logs del backend
docker logs cartas_fianzas_backend_dev --tail 50

# Reiniciar frontend
docker-compose -f docker-compose.dev.yml restart frontend

# Verificar que Sonner está instalado
docker exec cartas_fianzas_frontend_dev npm list sonner
```

---

## 🎉 Si Todo Funciona Correctamente

Deberías ver:
- ✅ Notificaciones elegantes con animaciones suaves
- ✅ Colores semánticos (rojo para error, verde para éxito)
- ✅ Botón de cerrar [X] en cada notificación
- ✅ Transiciones fluidas
- ✅ Posicionamiento correcto (top-right)
- ✅ Duración apropiada (4 segundos)

¡El sistema está funcionando perfectamente! 🚀

---

**Última Actualización:** 17/11/2025

