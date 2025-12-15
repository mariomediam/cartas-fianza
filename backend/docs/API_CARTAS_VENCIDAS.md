# 📅 API - Cartas Fianza Vencidas

## Endpoint

```
GET /api/warranties/vencidas/
```

---

## Descripción

Obtiene el listado de todas las cartas fianza vencidas basándose en el **último historial** de cada garantía.

### Lógica de la Consulta

El endpoint replica la siguiente consulta SQL:

```sql
SELECT 
    TUltHistory.max_warranty_history,
    warranty_histories.warranty_id,
    warranties.warranty_object_id,
    warranties.letter_type_id,
    warranty_histories.warranty_status_id,
    warranty_objects.description as warranty_object_description,
    letter_types.description as letter_type_description,
    warranty_statuses.description as warranty_status_description,
    warranty_histories.validity_end,
    warranty_histories.letter_number
FROM (
    SELECT warranty_id, MAX(id) as max_warranty_history
    FROM warranty_histories
    GROUP BY warranty_id
) AS TUltHistory
INNER JOIN warranty_histories 
    ON TUltHistory.max_warranty_history = warranty_histories.id
INNER JOIN warranties 
    ON warranty_histories.warranty_id = warranties.id
INNER JOIN warranty_objects 
    ON warranties.warranty_object_id = warranty_objects.id
INNER JOIN letter_types 
    ON warranties.letter_type_id = letter_types.id
INNER JOIN warranty_statuses 
    ON warranty_histories.warranty_status_id = warranty_statuses.id
WHERE warranty_histories.warranty_status_id NOT IN (3, 6)
  AND warranty_histories.validity_end < NOW();
```

### Filtros Aplicados

- ✅ **Último historial**: Se considera solo el historial más reciente (MAX(id)) de cada garantía
- ✅ **Estados excluidos**: No incluye estados 3 (Devolución) y 6 (Ejecución)
- ✅ **Fecha vencida**: `validity_end < fecha_actual`

---

## 🔐 Autenticación

Requiere Token de autenticación:

```
Authorization: Token <tu-token>
```

---

## 📤 Respuesta Exitosa (200 OK)

```json
{
  "count": 3,
  "results": [
    {
      "max_warranty_history": 25,
      "warranty_id": 10,
      "warranty_object_id": 1,
      "warranty_object_description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
      "letter_type_id": 2,
      "letter_type_description": "Adelanto de materiales",
      "warranty_status_id": 1,
      "warranty_status_description": "Vigente",
      "letter_number": "010079913-000",
      "validity_end": "2022-06-15",
      "days_expired": 886,
      "time_expired": "2 años, 5 meses, 6 días",
      "time_expired_years": 2,
      "time_expired_months": 5,
      "time_expired_days": 6
    },
    {
      "max_warranty_history": 42,
      "warranty_id": 15,
      "warranty_object_id": 3,
      "warranty_object_description": "CONSTRUCCION DE EDIFICIO ADMINISTRATIVO",
      "letter_type_id": 1,
      "letter_type_description": "Fiel cumplimiento",
      "warranty_status_id": 2,
      "warranty_status_description": "Renovada",
      "letter_number": "010079914-001",
      "validity_end": "2023-08-20",
      "days_expired": 455,
      "time_expired": "1 año, 2 meses, 28 días",
      "time_expired_years": 1,
      "time_expired_months": 2,
      "time_expired_days": 28
    }
  ]
}
```

---

## 📋 Campos de Respuesta

### Nivel raíz

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `count` | `integer` | Número total de cartas vencidas |
| `results` | `array` | Array con las cartas vencidas |

### Objeto en `results[]`

| Campo | Tipo | Descripción | Origen SQL |
|-------|------|-------------|------------|
| `max_warranty_history` | `integer` | ID del último historial | `MAX(warranty_histories.id)` |
| `warranty_id` | `integer` | ID de la garantía | `warranty_histories.warranty_id` |
| `warranty_object_id` | `integer` | ID del objeto de garantía | `warranties.warranty_object_id` |
| `warranty_object_description` | `string` | Descripción del objeto | `warranty_objects.description` |
| `letter_type_id` | `integer` | ID del tipo de carta | `warranties.letter_type_id` |
| `letter_type_description` | `string` | Tipo de carta | `letter_types.description` |
| `warranty_status_id` | `integer` | ID del estado | `warranty_histories.warranty_status_id` |
| `warranty_status_description` | `string` | Estado de la garantía | `warranty_statuses.description` |
| `letter_number` | `string` | Número de carta | `warranty_histories.letter_number` |
| `validity_end` | `date` | Fecha de vencimiento | `warranty_histories.validity_end` |
| `days_expired` | `integer` | **Total de días vencidos** | *(calculado)* |
| `time_expired` | `string` | **Tiempo vencido legible** | *(calculado)* |
| `time_expired_years` | `integer` | **Años vencidos** | *(calculado)* |
| `time_expired_months` | `integer` | **Meses vencidos** | *(calculado)* |
| `time_expired_days` | `integer` | **Días vencidos** | *(calculado)* |

---

## 🔍 Lógica del Endpoint

### 1. Obtener Último Historial

Usando una subconsulta, se obtiene el ID máximo del historial para cada garantía:

```python
latest_history_subquery = WarrantyHistory.objects.filter(
    warranty_id=OuterRef('warranty_id')
).order_by('-id').values('id')[:1]
```

**Equivalente SQL:**
```sql
SELECT warranty_id, MAX(id) as max_warranty_history
FROM warranty_histories
GROUP BY warranty_id
```

### 2. Filtrar Historiales

Se filtran los historiales que cumplen las condiciones:

```python
expired_warranties = WarrantyHistory.objects.filter(
    id__in=Subquery(latest_history_subquery)  # Solo últimos historiales
).filter(
    warranty_status_id__in=[1, 2, 4, 5]  # Excluir 3 y 6
).filter(
    validity_end__lt=today  # Vencidas
)
```

### 3. Obtener Datos Relacionados

Se hace select_related para traer los datos de las tablas relacionadas:

```python
.select_related(
    'warranty',
    'warranty__warranty_object',
    'warranty__letter_type',
    'warranty_status'
)
```

### 4. Calcular Tiempo Vencido

Para cada carta vencida, se calculan:

```python
days_expired = (today - validity_end).days

years = days_expired // 365
remaining_days = days_expired % 365
months = remaining_days // 30
days = remaining_days % 30
```

### 5. Formatear Salida

```python
time_expired = "2 años, 5 meses, 3 días"
```

---

## 📊 Ejemplos de Uso

### cURL

```bash
curl -X GET \
  "http://localhost:8000/api/warranties/vencidas/" \
  -H "Authorization: Token abc123..."
```

### Python (requests)

```python
import requests

url = "http://localhost:8000/api/warranties/vencidas/"
headers = {"Authorization": "Token abc123..."}

response = requests.get(url, headers=headers)
data = response.json()

print(f"Cartas vencidas: {data['count']}")
for carta in data['results']:
    print(f"- {carta['letter_number']}: {carta['time_expired']} vencida")
```

### JavaScript (Fetch)

```javascript
const response = await fetch('http://localhost:8000/api/warranties/vencidas/', {
  headers: {
    'Authorization': `Token ${token}`
  }
});

const data = await response.json();
console.log(`Total vencidas: ${data.count}`);

data.results.forEach(carta => {
  console.log(`${carta.letter_number} - ${carta.time_expired}`);
});
```

### Axios (React)

```javascript
import axios from 'axios';

const getCartasVencidas = async () => {
  try {
    const response = await axios.get('/warranties/vencidas/');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uso en componente
const { count, results } = await getCartasVencidas();
```

---

## 🎯 Casos de Uso

### Dashboard con Alertas

```javascript
const { count } = await getCartasVencidas();

if (count > 0) {
  toast.warning(`¡Atención! ${count} carta(s) fianza vencida(s)`);
}
```

### Tabla de Cartas Vencidas

```jsx
const ExpiredTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th>Número</th>
        <th>Objeto</th>
        <th>Tipo</th>
        <th>Estado</th>
        <th>Vencimiento</th>
        <th>Tiempo Vencido</th>
      </tr>
    </thead>
    <tbody>
      {data.results.map(carta => (
        <tr key={carta.max_warranty_history}>
          <td>{carta.letter_number}</td>
          <td>{carta.warranty_object_description}</td>
          <td>{carta.letter_type_description}</td>
          <td>{carta.warranty_status_description}</td>
          <td>{carta.validity_end}</td>
          <td className="text-red-600">{carta.time_expired}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
```

### Reporte de Vencimientos

```python
response = requests.get(url, headers=headers)
data = response.json()

# Agrupar por criticidad
criticas = [c for c in data['results'] if c['days_expired'] > 365]
urgentes = [c for c in data['results'] if 90 < c['days_expired'] <= 365]
recientes = [c for c in data['results'] if c['days_expired'] <= 90]

print(f"Críticas (>1 año): {len(criticas)}")
print(f"Urgentes (3-12 meses): {len(urgentes)}")
print(f"Recientes (<3 meses): {len(recientes)}")
```

---

## 🔴 Respuestas de Error

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Solución:** Incluir token en el header Authorization.

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

**Solución:** Verificar permisos del usuario.

---

## ⚙️ Configuración

### Cambiar Estados Excluidos

Edita `views.py` línea 295:

```python
warranty_status_id__in=[1, 2, 4, 5]  # Modificar según necesidad
```

### Cambiar Ordenamiento

Edita `views.py` línea 314:

```python
.order_by('validity_end')  # Opciones:
# 'validity_end' - Por fecha (más antiguas primero)
# '-validity_end' - Por fecha (más recientes primero)
# 'letter_number' - Por número de carta
```

---

## 📈 Formato de Tiempo Vencido

| Tiempo | Formato |
|--------|---------|
| 2 años, 5 meses, 3 días | `"2 años, 5 meses, 3 días"` |
| 1 año, 2 meses | `"1 año, 2 meses"` |
| 6 meses, 15 días | `"6 meses, 15 días"` |
| 20 días | `"20 días"` |
| < 1 día | `"Menos de un día"` |

---

## 🧪 Pruebas

### En el Navegador

1. Inicia sesión: http://localhost:8000/api-auth/login/
2. Visita: http://localhost:8000/api/warranties/vencidas/

### Con Postman

1. **Método:** GET
2. **URL:** http://localhost:8000/api/warranties/vencidas/
3. **Headers:**
   - Authorization: Token <tu-token>

---

## 📝 Notas Importantes

### Performance

- ✅ Usa subconsultas para obtener el último historial (eficiente)
- ✅ Usa `select_related` para reducir queries
- ✅ Ordena en la base de datos, no en Python

### Precisión de Fechas

El cálculo de años/meses/días es aproximado:
- 1 año = 365 días
- 1 mes = 30 días

Para cálculos exactos, considera usar `python-dateutil` (opcional).

---

## 🔗 Endpoints Relacionados

- `GET /api/warranties/` - Listar todas las garantías
- `GET /api/warranties/{id}/` - Detalle de una garantía
- `GET /api/warranty-statuses/` - Estados de garantía

---

**Última actualización:** 17/11/2025
**Versión:** 2.0 (Basado en consulta SQL optimizada)

