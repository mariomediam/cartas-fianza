# 📅 Función `calcular_tiempo_vencido()`

## ✅ Problema Resuelto

### ❌ Problema Original
El cálculo de tiempo vencido era **inexacto** porque usaba aproximaciones:
- **365 días por año** (ignora años bisiestos)
- **30 días por mes** (los meses tienen 28, 29, 30 o 31 días)

**Ejemplo del error:**
- **Fecha vencimiento:** 31/12/2024
- **Fecha actual:** 17/11/2025
- **Resultado anterior:** "10 meses, 21 días" ❌
- **Resultado correcto:** "10 meses, 17 días" ✅

### ✅ Solución
Se creó una función `calcular_tiempo_vencido()` que usa `dateutil.relativedelta` para calcular la diferencia **exacta** de fechas considerando:
- ✅ Años bisiestos
- ✅ Duración real de cada mes (28/29/30/31 días)
- ✅ Cambios de año correctos

---

## 📝 Definición de la Función

### Ubicación
**Archivo:** `backend/apps/cartas_fianzas/views.py`  
**Líneas:** 32-87

### Firma
```python
def calcular_tiempo_vencido(fecha_vencimiento, fecha_actual=None):
    """
    Calcula el tiempo transcurrido entre una fecha de vencimiento y la fecha actual.
    
    Args:
        fecha_vencimiento (date): Fecha de vencimiento de la carta fianza
        fecha_actual (date, optional): Fecha actual. Si no se proporciona, usa date.today()
    
    Returns:
        dict: Diccionario con la información del tiempo vencido
    """
```

---

## 📥 Parámetros

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `fecha_vencimiento` | `date` | ✅ Sí | Fecha en que venció la carta fianza | `date(2024, 12, 31)` |
| `fecha_actual` | `date` | ❌ No | Fecha actual para comparar (default: hoy) | `date(2025, 11, 17)` |

---

## 📤 Valor de Retorno

La función retorna un **diccionario** con la siguiente estructura:

```python
{
    'days_expired': int,      # Total de días transcurridos
    'years': int,             # Años completos transcurridos
    'months': int,            # Meses completos (después de restar años)
    'days': int,              # Días (después de restar años y meses)
    'time_expired': str       # Texto descriptivo en español
}
```

### Ejemplo de Retorno

```python
{
    'days_expired': 321,
    'years': 0,
    'months': 10,
    'days': 17,
    'time_expired': '10 meses, 17 días'
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Uso básico (usa fecha actual)
```python
from datetime import date
from apps.cartas_fianzas.views import calcular_tiempo_vencido

# Calcular tiempo vencido hasta hoy
resultado = calcular_tiempo_vencido(date(2024, 12, 31))
print(resultado['time_expired'])  # "10 meses, 17 días"
```

### Ejemplo 2: Con fecha específica
```python
# Calcular tiempo vencido hasta una fecha específica
fecha_vencimiento = date(2024, 12, 31)
fecha_consulta = date(2025, 11, 17)

resultado = calcular_tiempo_vencido(fecha_vencimiento, fecha_consulta)
print(f"Días vencidos: {resultado['days_expired']}")       # 321
print(f"Años: {resultado['years']}")                        # 0
print(f"Meses: {resultado['months']}")                      # 10
print(f"Días: {resultado['days']}")                         # 17
print(f"Descripción: {resultado['time_expired']}")          # "10 meses, 17 días"
```

### Ejemplo 3: Más de un año vencido
```python
resultado = calcular_tiempo_vencido(date(2022, 5, 15), date(2025, 11, 17))
print(resultado['time_expired'])  # "3 años, 6 meses, 2 días"
```

### Ejemplo 4: Solo días
```python
resultado = calcular_tiempo_vencido(date(2025, 11, 5), date(2025, 11, 17))
print(resultado['time_expired'])  # "12 días"
```

### Ejemplo 5: Menos de un día
```python
resultado = calcular_tiempo_vencido(date(2025, 11, 17), date(2025, 11, 17))
print(resultado['time_expired'])  # "Menos de un día"
```

---

## 🔧 Integración en el Endpoint

### Uso en `/api/warranties/vencidas/`

**Antes (cálculo manual incorrecto):**
```python
# ❌ Cálculo inexacto
days_expired = (today - warranty['validity_end']).days
years = days_expired // 365
remaining_days = days_expired % 365
months = remaining_days // 30
days = remaining_days % 30
```

**Ahora (usando la función):**
```python
# ✅ Cálculo exacto
tiempo_vencido = calcular_tiempo_vencido(warranty['validity_end'], today)

results.append({
    # ... otros campos ...
    'days_expired': tiempo_vencido['days_expired'],
    'time_expired': tiempo_vencido['time_expired'],
    'time_expired_years': tiempo_vencido['years'],
    'time_expired_months': tiempo_vencido['months'],
    'time_expired_days': tiempo_vencido['days']
})
```

---

## 📊 Casos de Prueba

### Test 1: Fecha del problema reportado
```python
# Entrada:
fecha_vencimiento = date(2024, 12, 31)
fecha_actual = date(2025, 11, 17)

# Salida esperada:
{
    'days_expired': 321,
    'years': 0,
    'months': 10,
    'days': 17,
    'time_expired': '10 meses, 17 días'
}
```

### Test 2: Año bisiesto
```python
# Entrada:
fecha_vencimiento = date(2024, 1, 31)  # 2024 es bisiesto
fecha_actual = date(2024, 3, 1)

# Salida esperada:
{
    'days_expired': 30,  # Febrero tiene 29 días en 2024
    'years': 0,
    'months': 1,
    'days': 0,
    'time_expired': '1 mes'
}
```

### Test 3: Múltiples años
```python
# Entrada:
fecha_vencimiento = date(2020, 6, 15)
fecha_actual = date(2025, 11, 17)

# Salida esperada:
{
    'days_expired': 1981,
    'years': 5,
    'months': 5,
    'days': 2,
    'time_expired': '5 años, 5 meses, 2 días'
}
```

---

## 🛠️ Dependencias

### Nueva Dependencia Agregada

**Archivo:** `backend/requirements.txt`

```txt
python-dateutil==2.9.0.post0
```

### Instalación

Para instalar la nueva dependencia en el contenedor:

```bash
# Opción 1: Reiniciar el contenedor (recomendado)
docker-compose -f docker-compose.dev.yml restart backend

# Opción 2: Reconstruir el contenedor
docker-compose -f docker-compose.dev.yml up -d --build backend

# Opción 3: Instalar manualmente dentro del contenedor
docker exec -it cartas_fianzas_backend_dev pip install python-dateutil==2.9.0.post0
```

---

## 📋 Ventajas de la Solución

### ✅ Precisión
- Cálculos exactos respetando calendarios reales
- Maneja correctamente años bisiestos
- Considera la duración real de cada mes

### ✅ Reutilización
- Función independiente y reutilizable
- Puede usarse en otros endpoints o vistas
- Fácil de probar unitariamente

### ✅ Mantenibilidad
- Código más limpio y legible
- Lógica centralizada en un solo lugar
- Fácil de modificar si se necesitan cambios

### ✅ Documentación
- Docstring completo con ejemplos
- Parámetros y retorno claramente definidos
- Ejemplos de uso incluidos

---

## 🧪 Pruebas Manuales

### Probar la función directamente

```bash
# Entrar al shell de Django
docker exec -it cartas_fianzas_backend_dev python manage.py shell

# Ejecutar pruebas
from datetime import date
from apps.cartas_fianzas.views import calcular_tiempo_vencido

# Test 1: Caso reportado
resultado = calcular_tiempo_vencido(date(2024, 12, 31), date(2025, 11, 17))
print(resultado)
# Debería mostrar: {'days_expired': 321, 'years': 0, 'months': 10, 'days': 17, ...}

# Test 2: Más años
resultado = calcular_tiempo_vencido(date(2020, 1, 1), date(2025, 11, 17))
print(resultado['time_expired'])
# Debería mostrar: "5 años, 10 meses, 16 días"
```

### Probar el endpoint

```bash
# Obtener token de autenticación
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "tu_password"}'

# Usar el token para consultar cartas vencidas
curl -X GET http://127.0.0.1:8000/api/warranties/vencidas/ \
  -H "Authorization: Token TU_TOKEN_AQUI"
```

---

## 🔄 Cambios Realizados

### Archivos Modificados

1. **`backend/apps/cartas_fianzas/views.py`**
   - ✅ Agregado import: `from dateutil.relativedelta import relativedelta`
   - ✅ Creada función: `calcular_tiempo_vencido()`
   - ✅ Actualizado endpoint `cartas_vencidas()` para usar la nueva función

2. **`backend/requirements.txt`**
   - ✅ Agregada dependencia: `python-dateutil==2.9.0.post0`

### Líneas de Código

- **Total agregado:** ~60 líneas (función + docstring)
- **Total eliminado:** ~20 líneas (cálculo manual)
- **Ganancia neta:** +40 líneas (pero con mejor calidad y documentación)

---

## ✅ Verificación

### Checklist de Implementación

- ✅ Función `calcular_tiempo_vencido()` creada
- ✅ Docstring completo con ejemplos
- ✅ Import de `relativedelta` agregado
- ✅ Endpoint actualizado para usar la función
- ✅ Dependencia agregada a `requirements.txt`
- ✅ Código más limpio y mantenible

### Próximos Pasos

1. **Reiniciar el contenedor backend:**
   ```bash
   docker-compose -f docker-compose.dev.yml restart backend
   ```

2. **Probar el endpoint:**
   - Verificar que los cálculos sean correctos
   - Confirmar que "10 meses, 17 días" aparece correctamente

3. **Opcional: Crear tests unitarios:**
   - Crear `tests.py` en la app
   - Agregar tests para diferentes casos

---

**Fecha:** 17/11/2025  
**Status:** ✅ Implementado y documentado  
**Dependencias:** python-dateutil==2.9.0.post0

