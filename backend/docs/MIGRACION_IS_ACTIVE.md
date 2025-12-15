# ✅ Migración: Campo `is_active` en WarrantyStatus

## 🎯 Objetivo

Mejorar las buenas prácticas eliminando IDs hardcodeados en la API y usar un campo semántico `is_active` para filtrar estados de garantía.

---

## 📋 Cambios Realizados

### 1. **Modelo `WarrantyStatus` Actualizado**

**Archivo:** `backend/apps/cartas_fianzas/models.py`

**Cambio:**
```python
class WarrantyStatus(BaseModel):
    description = models.CharField(...)
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo',
        help_text='Indica si el estado está activo para considerar en reportes de vencimiento'
    )
```

---

### 2. **Migraciones Creadas**

#### Migración 0004: Agregar campo `is_active`
**Archivo:** `migrations/0004_warrantystatus_is_active.py`

```python
operations = [
    migrations.AddField(
        model_name='warrantystatus',
        name='is_active',
        field=models.BooleanField(
            default=True,
            verbose_name='Activo',
            help_text='Indica si el estado está activo...'
        ),
    ),
]
```

**Resultado:**
- ✅ Agrega columna `is_active` BOOLEAN NOT NULL DEFAULT TRUE
- ✅ Todos los registros existentes tienen `is_active=True` por defecto

---

#### Migración 0005: Actualizar datos (Data Migration)
**Archivo:** `migrations/0005_update_warranty_status_is_active.py`

```python
def update_warranty_status_is_active(apps, schema_editor):
    WarrantyStatus = apps.get_model('cartas_fianzas', 'WarrantyStatus')
    
    # Marcar estado 3 (Devolución) como inactivo
    WarrantyStatus.objects.filter(id=3).update(is_active=False)
    
    # Marcar estado 6 (Ejecución) como inactivo
    WarrantyStatus.objects.filter(id=6).update(is_active=False)
```

**Resultado:**
- ✅ Estado 3 (Devolución): `is_active=False`
- ✅ Estado 6 (Ejecución): `is_active=False`
- ✅ Todos los demás estados: `is_active=True`

**Función reverse:**
```python
def reverse_update(apps, schema_editor):
    WarrantyStatus = apps.get_model('cartas_fianzas', 'WarrantyStatus')
    WarrantyStatus.objects.filter(id__in=[3, 6]).update(is_active=True)
```
- ✅ Permite revertir la migración si es necesario

---

### 3. **API Actualizada**

**Archivo:** `backend/apps/cartas_fianzas/views.py`

**ANTES (Mala práctica):**
```python
expired_warranties = WarrantyHistory.objects.filter(
    warranty_status_id__in=[1, 2, 4, 5]  # IDs hardcodeados ❌
)
```

**AHORA (Buena práctica):**
```python
expired_warranties = WarrantyHistory.objects.filter(
    warranty_status__is_active=True  # Campo semántico ✅
)
```

**Ventajas:**
- ✅ Más legible y mantenible
- ✅ No depende de IDs específicos
- ✅ Flexible: se puede cambiar desde la base de datos
- ✅ Semántico: el código expresa la intención

---

## 🗄️ Estado de la Base de Datos

### Tabla `warranty_statuses` después de la migración:

| id | description | is_active | created_at | updated_at |
|----|-------------|-----------|------------|------------|
| 1 | Emisión | ✅ TRUE | ... | ... |
| 2 | Renovación | ✅ TRUE | ... | ... |
| 3 | Devolución | ❌ FALSE | ... | ... |
| 4 | Ampliación | ✅ TRUE | ... | ... |
| 5 | Reducción | ✅ TRUE | ... | ... |
| 6 | Ejecución | ❌ FALSE | ... | ... |

---

## 🧪 Verificación

### Verificar en la base de datos:

```sql
-- Ver todos los estados y su campo is_active
SELECT id, description, is_active 
FROM warranty_statuses 
ORDER BY id;
```

**Resultado esperado:**
```
 id | description | is_active 
----+-------------+-----------
  1 | Emisión     | t
  2 | Renovación  | t
  3 | Devolución  | f
  4 | Ampliación  | t
  5 | Reducción   | t
  6 | Ejecución   | f
```

### Verificar en Django shell:

```python
python manage.py shell

>>> from apps.cartas_fianzas.models import WarrantyStatus
>>> 
>>> # Ver todos los estados
>>> for status in WarrantyStatus.objects.all():
...     print(f"{status.id}: {status.description} - Active: {status.is_active}")
... 
1: Emisión - Active: True
2: Renovación - Active: True
3: Devolución - Active: False
4: Ampliación - Active: True
5: Reducción - Active: True
6: Ejecución - Active: False
```

### Verificar el endpoint:

```bash
curl -H "Authorization: Token tu-token" \
  http://localhost:8000/api/warranties/vencidas/
```

Ahora filtra automáticamente por `is_active=True` ✅

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Filtrado** | IDs hardcodeados | Campo `is_active` |
| **Mantenibilidad** | Baja (cambiar código) | Alta (cambiar BD) |
| **Legibilidad** | `id__in=[1,2,4,5]` ❌ | `is_active=True` ✅ |
| **Flexibilidad** | Rígido | Configurable |
| **Semántica** | Poco clara | Clara y expresiva |
| **Buenas prácticas** | ❌ Hardcoding | ✅ Campo de estado |

---

## 🔄 Revertir Cambios (Si es necesario)

### Revertir la migración de datos:

```bash
docker exec cartas_fianzas_backend_dev \
  python manage.py migrate cartas_fianzas 0004
```

Esto ejecutará la función `reverse_update()` que marca los estados 3 y 6 como activos nuevamente.

### Revertir completamente (incluir eliminación del campo):

```bash
docker exec cartas_fianzas_backend_dev \
  python manage.py migrate cartas_fianzas 0003
```

**⚠️ Advertencia:** Esto eliminará el campo `is_active` de la tabla.

---

## 🎯 Uso Futuro

### Agregar nuevos estados inactivos:

Si en el futuro necesitas marcar otro estado como inactivo, puedes hacerlo directamente en la BD:

```sql
UPDATE warranty_statuses 
SET is_active = FALSE 
WHERE id = 7;  -- Por ejemplo, un nuevo estado "Anulado"
```

O desde Django admin/shell:

```python
from apps.cartas_fianzas.models import WarrantyStatus

status = WarrantyStatus.objects.get(id=7)
status.is_active = False
status.save()
```

### Consultar solo estados activos:

```python
# En cualquier parte del código
active_statuses = WarrantyStatus.objects.filter(is_active=True)
```

---

## 📝 Archivos Modificados

| Archivo | Descripción |
|---------|-------------|
| `models.py` | ✅ Agregado campo `is_active` |
| `migrations/0004_*.py` | ✅ Migración de esquema |
| `migrations/0005_*.py` | ✅ Migración de datos |
| `views.py` | ✅ API actualizada |

---

## ✅ Checklist de Migración

- [x] Campo `is_active` agregado al modelo
- [x] Migración de esquema creada (0004)
- [x] Migración de datos creada (0005)
- [x] Migraciones aplicadas a la BD
- [x] Estados 3 y 6 marcados como `is_active=False`
- [x] API actualizada para usar `is_active=True`
- [x] Backend reiniciado
- [x] Endpoint funcionando correctamente
- [x] Documentación actualizada

---

## 🎉 Conclusión

✅ **Migración completada exitosamente**

La base de datos y la API ahora usan el campo `is_active` en lugar de IDs hardcodeados, siguiendo mejores prácticas de desarrollo.

**Beneficios:**
- Código más limpio y mantenible
- Mayor flexibilidad
- Mejor expresividad semántica
- Facilita cambios futuros

---

**Fecha:** 17/11/2025
**Versión:** 1.0
**Status:** ✅ Producción ready

