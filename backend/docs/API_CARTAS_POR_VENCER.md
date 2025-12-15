# 📅 API Endpoint: Cartas Fianza por Vencer

## 📋 Información General

**Endpoint:** `GET /api/warranties/por-vencer/`  
**Método:** GET  
**Autenticación:** ✅ Requerida (Token)  
**Permisos:** IsAuthenticated

---

## 📝 Descripción

Este endpoint retorna un listado de **cartas fianza que están próximas a vencer**, específicamente aquellas cuya fecha de vencimiento está entre **1 y 15 días** desde la fecha actual.

Similar al endpoint `/api/warranties/vencidas/`, pero enfocado en cartas que **aún no han vencido** pero están próximas a hacerlo, permitiendo tomar acciones preventivas.

---

## 🔍 Lógica de Filtrado

### Criterios de Filtrado

1. **Último Historial de cada Garantía**
   - Se obtiene el historial más reciente (`max(id)`) de cada garantía
   - Garantiza que se evalúe solo el estado actual de cada carta

2. **Estado Activo**
   - `warranty_status.is_active = True`
   - Excluye cartas con estado "Devolución" (ID 3) y "Ejecución" (ID 6)

3. **Rango de Fechas (1 a 15 días)**
   - `validity_end > fecha_actual` → No vencidas aún
   - `validity_end <= fecha_actual + 15 días` → Vencen en los próximos 15 días

### Ejemplo Visual

```
Hoy: 17/11/2025

❌ 15/11/2025 - Vencida (no se incluye)
❌ 16/11/2025 - Vencida (no se incluye)
❌ 17/11/2025 - Vence hoy (no se incluye)
✅ 18/11/2025 - 1 día restante (SE INCLUYE)
✅ 20/11/2025 - 3 días restantes (SE INCLUYE)
✅ 25/11/2025 - 8 días restantes (SE INCLUYE)
✅ 01/12/2025 - 14 días restantes (SE INCLUYE)
✅ 02/12/2025 - 15 días restantes (SE INCLUYE)
❌ 03/12/2025 - 16 días restantes (no se incluye)
❌ 10/12/2025 - 23 días restantes (no se incluye)
```

---

## 📤 Respuesta del Endpoint

### Estructura de la Respuesta

```json
{
  "count": 5,
  "results": [
    {
      "max_warranty_history": 42,
      "warranty_id": 15,
      "warranty_object_id": 2,
      "warranty_object_description": "Adelanto de Materiales",
      "letter_type_id": 1,
      "letter_type_description": "Fianza Solidaria",
      "warranty_status_id": 1,
      "warranty_status_description": "Emisión",
      "letter_number": "CF-2025-042",
      "validity_end": "2025-11-20",
      "days_remaining": 3,
      "time_remaining": "3 días",
      "time_remaining_years": 0,
      "time_remaining_months": 0,
      "time_remaining_days": 3
    },
    {
      "max_warranty_history": 87,
      "warranty_id": 23,
      "warranty_object_id": 1,
      "warranty_object_description": "Fiel Cumplimiento",
      "letter_type_id": 2,
      "letter_type_description": "Póliza de Caución",
      "warranty_status_id": 2,
      "warranty_status_description": "Renovación",
      "letter_number": "PC-2025-087",
      "validity_end": "2025-12-01",
      "days_remaining": 14,
      "time_remaining": "14 días",
      "time_remaining_years": 0,
      "time_remaining_months": 0,
      "time_remaining_days": 14
    }
  ]
}
```

### Descripción de Campos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `count` | integer | Número total de cartas por vencer |
| `results` | array | Lista de cartas próximas a vencer |
| `max_warranty_history` | integer | ID del último historial de la garantía |
| `warranty_id` | integer | ID de la garantía |
| `warranty_object_id` | integer | ID del objeto de la garantía |
| `warranty_object_description` | string | Descripción del objeto (ej: "Fiel Cumplimiento") |
| `letter_type_id` | integer | ID del tipo de carta |
| `letter_type_description` | string | Descripción del tipo (ej: "Fianza Solidaria") |
| `warranty_status_id` | integer | ID del estado actual |
| `warranty_status_description` | string | Descripción del estado (ej: "Emisión", "Renovación") |
| `letter_number` | string | Número de la carta fianza |
| `validity_end` | date | Fecha de vencimiento (formato: YYYY-MM-DD) |
| `days_remaining` | integer | **Total de días restantes** hasta el vencimiento |
| `time_remaining` | string | **Texto descriptivo** del tiempo restante (ej: "3 días", "1 mes, 5 días") |
| `time_remaining_years` | integer | Años completos restantes |
| `time_remaining_months` | integer | Meses completos restantes (después de restar años) |
| `time_remaining_days` | integer | Días restantes (después de restar años y meses) |

---

## 🔧 Ejemplos de Uso

### Ejemplo 1: Request Básico

```bash
GET /api/warranties/por-vencer/
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Respuesta:**
```json
{
  "count": 3,
  "results": [
    {
      "max_warranty_history": 101,
      "warranty_id": 45,
      "warranty_object_id": 3,
      "warranty_object_description": "Adelanto de Valorizaciones",
      "letter_type_id": 1,
      "letter_type_description": "Fianza Solidaria",
      "warranty_status_id": 1,
      "warranty_status_description": "Emisión",
      "letter_number": "FS-2025-101",
      "validity_end": "2025-11-18",
      "days_remaining": 1,
      "time_remaining": "1 día",
      "time_remaining_years": 0,
      "time_remaining_months": 0,
      "time_remaining_days": 1
    },
    {
      "max_warranty_history": 95,
      "warranty_id": 38,
      "warranty_object_id": 1,
      "warranty_object_description": "Fiel Cumplimiento",
      "letter_type_id": 1,
      "letter_type_description": "Fianza Solidaria",
      "warranty_status_id": 2,
      "warranty_status_description": "Renovación",
      "letter_number": "FS-2025-095",
      "validity_end": "2025-11-25",
      "days_remaining": 8,
      "time_remaining": "8 días",
      "time_remaining_years": 0,
      "time_remaining_months": 0,
      "time_remaining_days": 8
    },
    {
      "max_warranty_history": 78,
      "warranty_id": 29,
      "warranty_object_id": 2,
      "warranty_object_description": "Adelanto de Materiales",
      "letter_type_id": 2,
      "letter_type_description": "Póliza de Caución",
      "warranty_status_id": 1,
      "warranty_status_description": "Emisión",
      "letter_number": "PC-2025-078",
      "validity_end": "2025-12-02",
      "days_remaining": 15,
      "time_remaining": "15 días",
      "time_remaining_years": 0,
      "time_remaining_months": 0,
      "time_remaining_days": 15
    }
  ]
}
```

### Ejemplo 2: Usando cURL

```bash
# Obtener token primero
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "tu_password"
  }'

# Usar el token para obtener cartas por vencer
curl -X GET http://127.0.0.1:8000/api/warranties/por-vencer/ \
  -H "Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b" \
  -H "Content-Type: application/json"
```

### Ejemplo 3: Usando JavaScript/Axios

```javascript
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const token = localStorage.getItem('token');

// Configurar axios con el token
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
});

// Obtener cartas por vencer
const fetchSoonToExpireWarranties = async () => {
  try {
    const response = await api.get('/warranties/por-vencer/');
    console.log(`Total de cartas por vencer: ${response.data.count}`);
    
    response.data.results.forEach(warranty => {
      console.log(`
        Carta: ${warranty.letter_number}
        Objeto: ${warranty.warranty_object_description}
        Vence: ${warranty.validity_end}
        Tiempo restante: ${warranty.time_remaining}
      `);
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener cartas por vencer:', error);
    throw error;
  }
};

// Uso
fetchSoonToExpireWarranties();
```

### Ejemplo 4: Usando Python/Requests

```python
import requests
from datetime import date

API_URL = 'http://127.0.0.1:8000/api'
token = 'tu_token_aqui'

headers = {
    'Authorization': f'Token {token}',
    'Content-Type': 'application/json'
}

# Obtener cartas por vencer
response = requests.get(f'{API_URL}/warranties/por-vencer/', headers=headers)

if response.status_code == 200:
    data = response.json()
    print(f"Total de cartas por vencer: {data['count']}")
    
    for warranty in data['results']:
        print(f"""
        Carta: {warranty['letter_number']}
        Objeto: {warranty['warranty_object_description']}
        Vence: {warranty['validity_end']}
        Días restantes: {warranty['days_remaining']}
        Tiempo: {warranty['time_remaining']}
        """)
else:
    print(f"Error: {response.status_code}")
```

---

## 🎯 Casos de Uso

### 1. Dashboard de Alertas
Mostrar un widget con las cartas próximas a vencer para que el usuario tome acciones.

### 2. Notificaciones Proactivas
Enviar emails/notificaciones automáticas sobre cartas que están por vencer.

### 3. Reportes de Seguimiento
Generar reportes periódicos de cartas que requieren atención inmediata.

### 4. Gestión Preventiva
Identificar cartas que necesitan renovación o gestión antes de que venzan.

---

## 📊 Comparación con Endpoint de Vencidas

| Aspecto | Cartas Vencidas | Cartas Por Vencer |
|---------|----------------|-------------------|
| **Endpoint** | `/api/warranties/vencidas/` | `/api/warranties/por-vencer/` |
| **Filtro de Fecha** | `validity_end < hoy` | `hoy < validity_end <= hoy+15` |
| **Campo Principal** | `days_expired` (días vencidos) | `days_remaining` (días restantes) |
| **Campo Texto** | `time_expired` | `time_remaining` |
| **Propósito** | Identificar cartas ya vencidas | Prevenir vencimientos |
| **Urgencia** | 🔴 Alta (ya vencidas) | 🟡 Media (próximas a vencer) |

---

## 🧮 Función: `calcular_tiempo_restante()`

### Descripción
Función auxiliar que calcula el tiempo restante exacto hasta una fecha de vencimiento.

### Ubicación
**Archivo:** `backend/apps/cartas_fianzas/views.py` (líneas 90-145)

### Características
- ✅ Usa `dateutil.relativedelta` para cálculos precisos
- ✅ Considera años bisiestos y duración real de meses
- ✅ Retorna días totales + desglose en años/meses/días
- ✅ Incluye texto descriptivo en español

### Ejemplo de Uso
```python
from datetime import date
from apps.cartas_fianzas.views import calcular_tiempo_restante

# Calcular tiempo restante
resultado = calcular_tiempo_restante(date(2025, 12, 5), date(2025, 11, 20))

print(resultado)
# {
#     'days_remaining': 15,
#     'years': 0,
#     'months': 0,
#     'days': 15,
#     'time_remaining': '15 días'
# }
```

---

## ⚠️ Manejo de Errores

### Error 401: No Autorizado
```json
{
  "detail": "Las credenciales de autenticación no se proveyeron."
}
```
**Solución:** Incluir el header `Authorization: Token <tu_token>`

### Error 403: Sin Permisos
```json
{
  "detail": "No tiene permiso para realizar esta acción."
}
```
**Solución:** Asegurar que el usuario tenga permisos adecuados

### Respuesta Vacía
```json
{
  "count": 0,
  "results": []
}
```
**Significado:** No hay cartas próximas a vencer en los próximos 15 días (¡buena noticia!)

---

## 🧪 Testing Manual

### Test 1: Verificar Endpoint
```bash
# En el shell de Django
docker exec -it cartas_fianzas_backend_dev python manage.py shell

# Probar la función
from datetime import date, timedelta
from apps.cartas_fianzas.views import calcular_tiempo_restante

hoy = date.today()
fecha_vencimiento = hoy + timedelta(days=10)

resultado = calcular_tiempo_restante(fecha_vencimiento, hoy)
print(f"Días restantes: {resultado['days_remaining']}")  # 10
print(f"Texto: {resultado['time_remaining']}")  # "10 días"
```

### Test 2: Verificar Consulta
```bash
# En el shell de Django
from apps.cartas_fianzas.models import WarrantyHistory
from datetime import date, timedelta

hoy = date.today()
max_dias = hoy + timedelta(days=15)

# Contar cartas por vencer
count = WarrantyHistory.objects.filter(
    warranty_status__is_active=True,
    validity_end__gt=hoy,
    validity_end__lte=max_dias
).count()

print(f"Cartas por vencer: {count}")
```

### Test 3: Verificar Endpoint Completo
```bash
# Usando curl (PowerShell)
$token = "TU_TOKEN_AQUI"
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/warranties/por-vencer/" `
  -Headers @{"Authorization"="Token $token"} | 
  Select-Object -ExpandProperty Content | 
  ConvertFrom-Json
```

---

## 📚 Documentación Relacionada

### Archivos del Proyecto
- `backend/apps/cartas_fianzas/views.py` - Implementación del endpoint
- `backend/apps/cartas_fianzas/models.py` - Modelos de datos
- `API_CARTAS_VENCIDAS.md` - Endpoint de cartas vencidas
- `FUNCION_CALCULAR_TIEMPO_VENCIDO.md` - Documentación de funciones de cálculo

### Endpoints Relacionados
- `GET /api/warranties/` - Lista todas las garantías
- `GET /api/warranties/{id}/` - Detalle de una garantía
- `GET /api/warranties/vencidas/` - Cartas vencidas

---

## ✅ Checklist de Implementación

- ✅ Función `calcular_tiempo_restante()` creada
- ✅ Action `cartas_por_vencer()` implementado
- ✅ Import `timedelta` agregado
- ✅ Filtros de fecha correctos (1 a 15 días)
- ✅ Usa `warranty_status.is_active` para filtrar estados
- ✅ Retorna campos completos con tiempo restante
- ✅ Ordenado por fecha de vencimiento (más próximas primero)
- ✅ Documentación completa

---

## 🚀 Estado

**Fecha Implementación:** 17/11/2025  
**Status:** ✅ Implementado y Documentado  
**Endpoint:** `GET /api/warranties/por-vencer/`  
**Requiere:** Autenticación con Token  
**Dependencias:** python-dateutil==2.9.0.post0

---

## 💡 Ejemplo de Integración Frontend

### React Component para Alertas

```jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SoonToExpireAlerts = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await api.get('/warranties/por-vencer/');
        setWarranties(response.data.results);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="alerts-container">
      <h2>⚠️ Cartas Próximas a Vencer</h2>
      <p className="alert-count">
        {warranties.length} carta{warranties.length !== 1 ? 's' : ''} 
        {warranties.length > 0 ? ' requieren atención' : ''}
      </p>
      
      {warranties.length === 0 ? (
        <p className="no-alerts">✅ No hay cartas próximas a vencer</p>
      ) : (
        <ul className="warranty-list">
          {warranties.map((warranty) => (
            <li key={warranty.warranty_id} className="warranty-item">
              <div className="warranty-header">
                <strong>{warranty.letter_number}</strong>
                <span className={`badge ${warranty.days_remaining <= 3 ? 'urgent' : ''}`}>
                  {warranty.time_remaining}
                </span>
              </div>
              <div className="warranty-details">
                <p>{warranty.warranty_object_description}</p>
                <p className="vence">Vence: {warranty.validity_end}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SoonToExpireAlerts;
```

---

**¿Necesitas más detalles o ejemplos?** Consulta la documentación completa en el proyecto. 🚀

