# API de Búsqueda de Objetos de Garantía

## 📍 Endpoint

**GET** `/api/warranty-objects/buscar/`

Este endpoint permite buscar objetos de garantía utilizando diferentes filtros avanzados que requieren consultas a través de múltiples tablas relacionadas.

---

## 🔑 Parámetros Requeridos

| Parámetro | Tipo | Descripción | Obligatorio |
|-----------|------|-------------|-------------|
| `filter_type` | string | Tipo de filtro a aplicar | ✅ Sí |
| `filter_value` | string | Valor a buscar | ✅ Sí |

---

## 🎯 Tipos de Filtro Disponibles

### 1. **Búsqueda por Número de Carta** (`letter_number`)

Busca objetos de garantía que tengan cartas fianza con un número específico.

**Ejemplo de uso:**
```bash
GET /api/warranty-objects/buscar/?filter_type=letter_number&filter_value=002-00
```

**Equivalente SQL:**
```sql
SELECT DISTINCT warranty_objects.id, warranty_objects.*
FROM warranty_objects
INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
INNER JOIN warranty_histories ON warranties.id = warranty_histories.warranty_id
WHERE warranty_histories.letter_number LIKE '%002-00%'
ORDER BY warranty_objects.created_at DESC;
```

**Django ORM:**
```python
WarrantyObject.objects.filter(
    warranties__history__letter_number__icontains='002-00'
).distinct()
```

---

### 2. **Búsqueda por Descripción** (`description`)

Busca objetos de garantía por su descripción.

**Ejemplo de uso:**
```bash
GET /api/warranty-objects/buscar/?filter_type=description&filter_value=MANTENIMIENTO
```

**Equivalente SQL:**
```sql
SELECT DISTINCT warranty_objects.id, warranty_objects.*
FROM warranty_objects
WHERE warranty_objects.description LIKE '%MANTENIMIENTO%'
ORDER BY warranty_objects.created_at DESC;
```

**Django ORM:**
```python
WarrantyObject.objects.filter(
    description__icontains='MANTENIMIENTO'
).distinct()
```

---

### 3. **Búsqueda por RUC del Contratista** (`contractor_ruc`)

Busca objetos de garantía asociados a un contratista específico por su RUC.

**Ejemplo de uso:**
```bash
GET /api/warranty-objects/buscar/?filter_type=contractor_ruc&filter_value=20123456789
```

**Equivalente SQL:**
```sql
SELECT DISTINCT warranty_objects.id, warranty_objects.*
FROM warranty_objects
INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
INNER JOIN contractors ON warranties.contractor_id = contractors.id
WHERE contractors.ruc LIKE '%20123456789%'
ORDER BY warranty_objects.created_at DESC;
```

**Django ORM:**
```python
WarrantyObject.objects.filter(
    warranties__contractor__ruc__icontains='20123456789'
).distinct()
```

---

### 4. **Búsqueda por Nombre del Contratista** (`contractor_name`)

Busca objetos de garantía asociados a un contratista por su razón social o nombre.

**Ejemplo de uso:**
```bash
GET /api/warranty-objects/buscar/?filter_type=contractor_name&filter_value=CONSTRUCTORA
```

**Equivalente SQL:**
```sql
SELECT DISTINCT warranty_objects.id, warranty_objects.*
FROM warranty_objects
INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
INNER JOIN contractors ON warranties.contractor_id = contractors.id
WHERE contractors.business_name LIKE '%CONSTRUCTORA%'
ORDER BY warranty_objects.created_at DESC;
```

**Django ORM:**
```python
WarrantyObject.objects.filter(
    warranties__contractor__business_name__icontains='CONSTRUCTORA'
).distinct()
```

---

## 📥 Formato de Respuesta

### Respuesta Exitosa (200 OK)

El endpoint retorna los objetos de garantía con toda su información anidada: garantías e historiales completos.

```json
{
    "count": 2,
    "results": [
        {
            "id": 1,
            "description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
            "cui": "2456789",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 17:29",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 17:29",
            "warranties": [
                {
                    "id": 1,
                    "letter_type_id": 1,
                    "letter_type_description": "Adelanto de materiales",
                    "contractor_id": 2,
                    "contractor_business_name": "CANTON LIMA SA",
                    "contractor_ruc": "12345678901",
                    "warranty_histories": [
                        {
                            "id": 4,
                            "warranty_status_id": 1,
                            "warranty_status_description": "Emisión",
                            "warranty_status_is_active": true,
                            "letter_number": "010079913-000",
                            "validity_start": "2025-01-01",
                            "validity_end": "2025-12-31",
                            "reference_document": "INF 076-2025-HFD/YT",
                            "issue_date": "2025-12-21",
                            "currency_type_id": 3,
                            "currency_type_symbol": "S/",
                            "amount": "26756.73",
                            "financial_entity_id": 1,
                            "financial_entity_description": "SCOTIABANK PERU",
                            "financial_entity_address": "Av. Principal 123",
                            "comments": "Carta fianza inicial"
                        },
                        {
                            "id": 8,
                            "warranty_status_id": 2,
                            "warranty_status_description": "Renovación",
                            "warranty_status_is_active": true,
                            "letter_number": "010079913-001",
                            "validity_start": "2026-01-01",
                            "validity_end": "2026-12-31",
                            "reference_document": "INF 120-2026-HFD/YT",
                            "issue_date": "2025-12-15",
                            "currency_type_id": 3,
                            "currency_type_symbol": "S/",
                            "amount": "26756.73",
                            "financial_entity_id": 1,
                            "financial_entity_description": "SCOTIABANK PERU",
                            "financial_entity_address": "Av. Principal 123",
                            "comments": "Primera renovación"
                        }
                    ]
                },
                {
                    "id": 5,
                    "letter_type_id": 2,
                    "letter_type_description": "Fiel cumplimiento",
                    "contractor_id": 2,
                    "contractor_business_name": "CANTON LIMA SA",
                    "contractor_ruc": "12345678901",
                    "warranty_histories": [
                        {
                            "id": 12,
                            "warranty_status_id": 1,
                            "warranty_status_description": "Emisión",
                            "warranty_status_is_active": true,
                            "letter_number": "010088451-000",
                            "validity_start": "2025-03-01",
                            "validity_end": "2025-09-30",
                            "reference_document": "INF 089-2025-HFD/YT",
                            "issue_date": "2025-02-28",
                            "currency_type_id": 3,
                            "currency_type_symbol": "S/",
                            "amount": "45000.00",
                            "financial_entity_id": 2,
                            "financial_entity_description": "BANCO DE LA NACION",
                            "financial_entity_address": "Jr. Central 456",
                            "comments": ""
                        }
                    ]
                }
            ]
        },
        {
            "id": 3,
            "description": "MEJORAMIENTO DE INFRAESTRUCTURA VIAL",
            "cui": "2345678",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "10/11/2025 15:20",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "10/11/2025 15:20",
            "warranties": [
                {
                    "id": 7,
                    "letter_type_id": 1,
                    "letter_type_description": "Adelanto de materiales",
                    "contractor_id": 5,
                    "contractor_business_name": "CONSTRUCTORA DEL SUR SAC",
                    "contractor_ruc": "20987654321",
                    "warranty_histories": [
                        {
                            "id": 15,
                            "warranty_status_id": 1,
                            "warranty_status_description": "Emisión",
                            "warranty_status_is_active": true,
                            "letter_number": "010002-004",
                            "validity_start": "2025-05-01",
                            "validity_end": "2025-11-30",
                            "reference_document": "MEMO 234-2025",
                            "issue_date": "2025-04-25",
                            "currency_type_id": 1,
                            "currency_type_symbol": "$",
                            "amount": "85000.00",
                            "financial_entity_id": 3,
                            "financial_entity_description": "BCP",
                            "financial_entity_address": "Av. Comercial 789",
                            "comments": "Carta en dólares"
                        }
                    ]
                }
            ]
        }
    ]
}
```

### Errores

#### Error 400 - Parámetros Faltantes

```json
{
    "error": "Se requieren los parámetros filter_type y filter_value"
}
```

#### Error 400 - Tipo de Filtro Inválido

```json
{
    "error": "Tipo de filtro no válido. Valores permitidos: letter_number, description, contractor_ruc, contractor_name"
}
```

---

## 🔐 Autenticación

Este endpoint requiere autenticación. Debes incluir el token en los headers:

```bash
Authorization: Token tu-token-aqui
```

---

## 📝 Ejemplos Completos

### Ejemplo 1: Buscar por Número de Carta

**Petición:**
```bash
curl -X GET "http://localhost:8000/api/warranty-objects/buscar/?filter_type=letter_number&filter_value=002-00" \
  -H "Authorization: Token tu-token-aqui"
```

**Respuesta:**
```json
{
    "count": 1,
    "results": [
        {
            "id": 5,
            "description": "OBRA DE CONSTRUCCION DE PUENTE",
            "cui": "3456789",
            "created_by": 1,
            "created_by_name": "admin",
            "created_at": "15/11/2025 10:30",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "15/11/2025 10:30"
        }
    ]
}
```

---

### Ejemplo 2: Buscar por RUC de Contratista

**Petición:**
```bash
curl -X GET "http://localhost:8000/api/warranty-objects/buscar/?filter_type=contractor_ruc&filter_value=20123456789" \
  -H "Authorization: Token tu-token-aqui"
```

**Respuesta:**
```json
{
    "count": 3,
    "results": [
        {
            "id": 2,
            "description": "MANTENIMIENTO DE REDES ELECTRICAS",
            "cui": "2345678",
            "created_by": 1,
            "created_by_name": "admin",
            "created_at": "14/11/2025 09:15",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "14/11/2025 09:15"
        },
        {
            "id": 4,
            "description": "MEJORAMIENTO DE PARQUES Y JARDINES",
            "cui": "1234567",
            "created_by": 1,
            "created_by_name": "admin",
            "created_at": "13/11/2025 08:00",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "13/11/2025 08:00"
        },
        {
            "id": 7,
            "description": "CONSTRUCCION DE LOCAL COMUNAL",
            "cui": "9876543",
            "created_by": 1,
            "created_by_name": "admin",
            "created_at": "12/11/2025 14:45",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 14:45"
        }
    ]
}
```

---

## 🔍 Notas Técnicas

### Uso de DISTINCT

Todos los filtros utilizan `.distinct()` para evitar duplicados cuando un objeto de garantía tiene múltiples garantías o historiales que coinciden con el criterio de búsqueda.

### Búsqueda Case-Insensitive

Todas las búsquedas utilizan `__icontains`, lo que significa que:
- Son insensibles a mayúsculas/minúsculas
- Realizan búsqueda parcial (LIKE '%valor%')

### Relaciones Utilizadas

El endpoint aprovecha las relaciones definidas en los modelos:
- `WarrantyObject` → `warranties` (relación inversa)
- `Warranty` → `history` (relación inversa)
- `Warranty` → `contractor` (relación directa)

### Optimización

Para optimizar las consultas, considera agregar `select_related` o `prefetch_related` si necesitas traer información relacionada adicional en la respuesta.

---

## 🎓 Comparación SQL vs Django ORM

### Consulta Original (SQL)
```sql
SELECT DISTINCT warranty_objects.id
FROM warranty_objects
INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
INNER JOIN warranty_histories ON warranties.id = warranty_histories.warranty_id
INNER JOIN contractors ON warranties.contractor_id = contractors.id
WHERE warranty_histories.letter_number LIKE '%002-00%'
```

### Implementación Django ORM
```python
WarrantyObject.objects.filter(
    warranties__history__letter_number__icontains='002-00'
).distinct()
```

**Ventajas del ORM:**
- ✅ Más legible y mantenible
- ✅ Protección contra SQL injection
- ✅ Los JOINs se generan automáticamente
- ✅ Portable entre diferentes bases de datos
- ✅ Integración con el sistema de serialización de DRF

---

## 🧪 Pruebas

### Probar con Thunder Client / Postman

1. **Configurar el endpoint:**
   ```
   GET http://localhost:8000/api/warranty-objects/buscar/
   ```

2. **Agregar parámetros de consulta:**
   - `filter_type`: letter_number
   - `filter_value`: 002-00

3. **Agregar header de autenticación:**
   - Key: `Authorization`
   - Value: `Token tu-token-aqui`

### Probar desde Python Shell

```python
# Acceder al shell de Django
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell

# Probar las consultas
from apps.cartas_fianzas.models import WarrantyObject

# Buscar por número de carta
results = WarrantyObject.objects.filter(
    warranties__history__letter_number__icontains='002-00'
).distinct()
print(f"Encontrados: {results.count()}")
for obj in results:
    print(f"- {obj.id}: {obj.description}")

# Buscar por RUC de contratista
results = WarrantyObject.objects.filter(
    warranties__contractor__ruc__icontains='20123456789'
).distinct()
print(f"Encontrados: {results.count()}")
for obj in results:
    print(f"- {obj.id}: {obj.description}")
```

---

## 💡 Casos de Uso

### 1. Búsqueda Rápida de Carta
Un usuario ingresa el número de carta parcial para encontrar todos los objetos de garantía relacionados.

### 2. Filtrar por Contratista
El administrador quiere ver todos los objetos de garantía asociados a un contratista específico.

### 3. Búsqueda de Proyectos
Buscar proyectos (objetos de garantía) por palabras clave en su descripción.

### 4. Auditoría
Rastrear todos los objetos de garantía relacionados con un contratista específico por RUC.

---

## ⚡ Optimización de Consultas

### Problema N+1

Este endpoint implementa optimizaciones para evitar el problema N+1, que ocurre cuando se realizan múltiples consultas innecesarias a la base de datos.

**Sin optimización (Problema N+1):**
```python
# 1 consulta para obtener objetos de garantía
warranty_objects = WarrantyObject.objects.filter(...)

# Para cada objeto de garantía:
for obj in warranty_objects:
    # +1 consulta por cada garantía
    warranties = obj.warranties.all()
    for warranty in warranties:
        # +1 consulta por cada historial
        histories = warranty.history.all()
        # +1 consulta por cada relación (contractor, letter_type, etc.)
```

**Con optimización (Nuestra implementación):**
```python
queryset = WarrantyObject.objects.select_related(
    'created_by',
    'updated_by'
).prefetch_related(
    Prefetch(
        'warranties',
        queryset=Warranty.objects.select_related(
            'letter_type',
            'contractor'
        ).prefetch_related(
            Prefetch(
                'history',
                queryset=WarrantyHistory.objects.select_related(
                    'warranty_status',
                    'currency_type',
                    'financial_entity'
                ).order_by('-issue_date')
            )
        )
    )
)
```

### Diferencia de Rendimiento

**Sin optimización:**
- 1 consulta para objetos de garantía
- N consultas para garantías (N = número de objetos)
- M consultas para historiales (M = número de garantías)
- X consultas para relaciones (X = número de relaciones por historial)
- **Total: 1 + N + M + X consultas** (puede ser 100+ consultas)

**Con optimización:**
- 1 consulta para objetos de garantía con created_by y updated_by
- 1 consulta para todas las garantías con letter_type y contractor
- 1 consulta para todos los historiales con warranty_status, currency_type y financial_entity
- **Total: ~3-4 consultas** (independientemente del número de resultados)

### Técnicas Utilizadas

#### 1. `select_related()`
Usado para relaciones ForeignKey (uno a uno o muchos a uno):
- `created_by`, `updated_by` en WarrantyObject
- `letter_type`, `contractor` en Warranty
- `warranty_status`, `currency_type`, `financial_entity` en WarrantyHistory

**Genera un SQL JOIN:**
```sql
SELECT warranty_objects.*, users.*
FROM warranty_objects
LEFT OUTER JOIN auth_user ON warranty_objects.created_by_id = users.id
```

#### 2. `prefetch_related()`
Usado para relaciones inversas (uno a muchos o muchos a muchos):
- `warranties` (relación inversa de warranty_object)
- `history` (relación inversa de warranty)

**Genera consultas separadas optimizadas:**
```sql
-- Primera consulta
SELECT * FROM warranty_objects WHERE ...

-- Segunda consulta
SELECT * FROM warranties WHERE warranty_object_id IN (1, 2, 3, ...)

-- Tercera consulta
SELECT * FROM warranty_histories WHERE warranty_id IN (5, 6, 7, ...)
```

#### 3. `Prefetch()`
Permite personalizar el queryset de `prefetch_related`:
- Agregar ordenamiento a los historiales: `.order_by('-issue_date')`
- Incluir select_related en las relaciones anidadas

### Monitorear Consultas

Para verificar cuántas consultas se ejecutan, puedes usar:

```python
from django.db import connection
from django.test.utils import override_settings

@override_settings(DEBUG=True)
def test_queries():
    # Tu código aquí
    print(f"Número de consultas: {len(connection.queries)}")
    for query in connection.queries:
        print(query['sql'])
```

O instalar Django Debug Toolbar en desarrollo:

```bash
pip install django-debug-toolbar
```

---

## 📊 Estructura de Datos

### Campos Retornados por Nivel

#### Nivel 1: Objeto de Garantía
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID del objeto de garantía |
| `description` | string | Descripción del proyecto |
| `cui` | string | Código Único de Inversión |
| `created_by` | integer | ID del usuario creador |
| `created_by_name` | string | Nombre del usuario creador |
| `created_at` | string | Fecha de creación |
| `updated_by` | integer | ID del usuario que actualizó |
| `updated_by_name` | string | Nombre del usuario que actualizó |
| `updated_at` | string | Fecha de actualización |
| `warranties` | array | Array de garantías |

#### Nivel 2: Garantía (Warranty)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID de la garantía |
| `letter_type_id` | integer | ID del tipo de carta |
| `letter_type_description` | string | Descripción del tipo de carta |
| `contractor_id` | integer | ID del contratista |
| `contractor_business_name` | string | Razón social del contratista |
| `contractor_ruc` | string | RUC del contratista |
| `warranty_histories` | array | Array de historiales |

#### Nivel 3: Historial de Garantía (Warranty History)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | integer | ID del historial |
| `warranty_status_id` | integer | ID del estado |
| `warranty_status_description` | string | Descripción del estado |
| `warranty_status_is_active` | boolean | Si el estado está activo |
| `letter_number` | string | Número de carta fianza |
| `validity_start` | date | Inicio de vigencia |
| `validity_end` | date | Fin de vigencia |
| `reference_document` | string | Documento de referencia |
| `issue_date` | date | Fecha de emisión |
| `currency_type_id` | integer | ID del tipo de moneda |
| `currency_type_symbol` | string | Símbolo de la moneda |
| `amount` | decimal | Monto de la carta |
| `financial_entity_id` | integer | ID de la entidad financiera |
| `financial_entity_description` | string | Nombre de la entidad |
| `financial_entity_address` | string | Dirección de la entidad |
| `comments` | string | Comentarios adicionales |

---

## 🔧 Personalización

### Agregar más campos al historial

Si necesitas incluir más campos en el historial, edita `WarrantyHistoryNestedSerializer`:

```python
class WarrantyHistoryNestedSerializer(serializers.ModelSerializer):
    # Agregar nuevos campos aquí
    created_at = serializers.DateTimeField(format='%d/%m/%Y %H:%M', read_only=True)
    
    class Meta:
        model = WarrantyHistory
        fields = [
            # ... campos existentes ...
            'created_at',  # nuevo campo
        ]
```

### Cambiar el ordenamiento de historiales

Por defecto, los historiales se ordenan por fecha de emisión (más recientes primero):

```python
queryset=WarrantyHistory.objects.select_related(
    'warranty_status',
    'currency_type',
    'financial_entity'
).order_by('-issue_date')  # Cambiar aquí
```

Opciones:
- `.order_by('-issue_date')` - Más recientes primero
- `.order_by('issue_date')` - Más antiguos primero
- `.order_by('-id')` - Por ID descendente
- `.order_by('validity_end')` - Por fecha de vencimiento

### Filtrar historiales por estado

Si solo quieres historiales activos:

```python
queryset=WarrantyHistory.objects.filter(
    warranty_status__is_active=True
).select_related(
    'warranty_status',
    'currency_type',
    'financial_entity'
).order_by('-issue_date')
```

