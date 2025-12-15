# ✅ Endpoint: Cartas Vencidas - Implementado

## 🎯 URL

```
GET /api/warranties/vencidas/
```

---

## 📋 ¿Qué hace?

Retorna el listado de cartas fianza vencidas basándose en tu consulta SQL:

```sql
-- Obtiene el último historial (MAX(id)) de cada garantía
-- Excluye estados 3 (Devolución) y 6 (Ejecución)  
-- Filtra por validity_end < NOW()
```

---

## 📤 Respuesta

```json
{
  "count": 2,
  "results": [
    {
      "max_warranty_history": 25,
      "warranty_id": 10,
      "warranty_object_id": 1,
      "warranty_object_description": "MANTENIMIENTO DE VIAS",
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
    }
  ]
}
```

---

## 🔑 Campos Retornados

Todos los campos solicitados en tu consulta SQL + campos calculados:

| Campo | Descripción |
|-------|-------------|
| `max_warranty_history` | ID del último historial (MAX(id)) |
| `warranty_id` | ID de la garantía |
| `warranty_object_id` | ID del objeto de garantía |
| `warranty_object_description` | Descripción del objeto |
| `letter_type_id` | ID del tipo de carta |
| `letter_type_description` | Tipo de carta |
| `warranty_status_id` | ID del estado |
| `warranty_status_description` | Descripción del estado |
| `letter_number` | Número de carta |
| `validity_end` | Fecha de vencimiento |
| **`days_expired`** | **Total días vencidos** ⭐ |
| **`time_expired`** | **"2 años, 5 meses, 3 días"** ⭐ |
| **`time_expired_years`** | **Años vencidos** ⭐ |
| **`time_expired_months`** | **Meses vencidos** ⭐ |
| **`time_expired_days`** | **Días vencidos** ⭐ |

---

## 🧪 Prueba Rápida

### Navegador:
```
http://localhost:8000/api/warranties/vencidas/
```
*(Después de hacer login en http://localhost:8000/api-auth/login/)*

### cURL:
```bash
curl -H "Authorization: Token tu-token" \
  http://localhost:8000/api/warranties/vencidas/
```

---

## 💻 Implementación Técnica

### Consulta SQL Original (Tu especificación):
```sql
SELECT TUltHistory.max_warranty_history,
       warranty_histories.warranty_id,
       warranties.warranty_object_id,
       warranty_objects.description,
       -- ... más campos
FROM (
    SELECT warranty_id, MAX(id) max_warranty_history
    FROM warranty_histories
    GROUP BY warranty_id
) AS TUltHistory
INNER JOIN warranty_histories ON ...
WHERE warranty_histories.warranty_status_id NOT IN (3, 6)
  AND warranty_histories.validity_end < NOW();
```

### Implementación Django ORM:
```python
# Subconsulta para último historial
latest_history_subquery = WarrantyHistory.objects.filter(
    warranty_id=OuterRef('warranty_id')
).order_by('-id').values('id')[:1]

# Query principal con filtros
expired_warranties = WarrantyHistory.objects.filter(
    id__in=Subquery(latest_history_subquery)
).filter(
    warranty_status_id__in=[1, 2, 4, 5]  # Excluye 3, 6
).filter(
    validity_end__lt=today
).select_related(
    'warranty', 'warranty__warranty_object',
    'warranty__letter_type', 'warranty_status'
)
```

---

## 📁 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `backend/apps/cartas_fianzas/views.py` | ✅ Agregado método `cartas_vencidas()` (líneas 267-359) |
| `backend/apps/cartas_fianzas/API_CARTAS_VENCIDAS.md` | ✅ Documentación completa |
| `backend/ENDPOINT_CARTAS_VENCIDAS.md` | ✅ Este resumen |

---

## ✅ Estado Actual

```
✅ Código implementado
✅ Backend funcionando
✅ Endpoint activo en /api/warranties/vencidas/
✅ Documentación completa
✅ Listo para usar
```

---

## 🚀 Uso en Frontend

### Servicio API:
```javascript
// frontend/src/services/api.js
export const warrantyService = {
  getExpiredWarranties: async () => {
    const response = await api.get('/warranties/vencidas/');
    return response.data;
  }
};
```

### Componente:
```javascript
const ExpiredWarranties = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const result = await warrantyService.getExpiredWarranties();
      setData(result);
    };
    fetch();
  }, []);

  return (
    <div>
      <h2>Cartas Vencidas ({data?.count || 0})</h2>
      {data?.results.map(carta => (
        <div key={carta.max_warranty_history}>
          <h3>{carta.letter_number}</h3>
          <p>Vencida: {carta.time_expired}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📞 Información

**URL:** http://localhost:8000/api/warranties/vencidas/
**Método:** GET
**Auth:** Token requerido
**Doc completa:** `backend/apps/cartas_fianzas/API_CARTAS_VENCIDAS.md`

---

**Implementado:** 17/11/2025
**Status:** ✅ Funcionando

