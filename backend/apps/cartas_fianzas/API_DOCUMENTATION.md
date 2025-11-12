# API Documentation - LetterType (Tipos de Carta)

## Endpoints Disponibles

### 1. Listar todos los tipos de carta
**GET** `/api/letter-types/`

Retorna una lista paginada de todos los tipos de carta.

**Respuesta exitosa (200 OK):**
```json
{
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "description": "Adelanto de materiales",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 15:48",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 15:48"
        },
        {
            "id": 2,
            "description": "Adelanto directo",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 15:48",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 15:48"
        }
    ]
}
```

### 2. Obtener un tipo de carta específico
**GET** `/api/letter-types/{id}/`

Retorna los detalles de un tipo de carta específico.

**Parámetros:**
- `id` (path) - ID del tipo de carta

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "Adelanto de materiales",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 15:48",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 15:48"
}
```

### 3. Crear un nuevo tipo de carta
**POST** `/api/letter-types/`

Crea un nuevo tipo de carta.

**Body (JSON):**
```json
{
    "description": "Adelanto de materiales"
}
```

**Respuesta exitosa (201 Created):**
```json
{
    "id": 5,
    "description": "Adelanto de materiales",
    "created_by": 1,
    "created_by_name": "admin",
    "created_at": "12/11/2025 16:00",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 16:00"
}
```

### 4. Actualizar completamente un tipo de carta
**PUT** `/api/letter-types/{id}/`

Actualiza todos los campos de un tipo de carta.

**Parámetros:**
- `id` (path) - ID del tipo de carta

**Body (JSON):**
```json
{
    "description": "Adelanto de materiales actualizado"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "Adelanto de materiales actualizado",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 15:48",
    "updated_by": 2,
    "updated_by_name": "admin",
    "updated_at": "12/11/2025 16:05"
}
```

### 5. Actualizar parcialmente un tipo de carta
**PATCH** `/api/letter-types/{id}/`

Actualiza solo los campos especificados.

**Parámetros:**
- `id` (path) - ID del tipo de carta

**Body (JSON):**
```json
{
    "description": "Nuevo nombre"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "Nuevo nombre",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 15:48",
    "updated_by": 2,
    "updated_by_name": "admin",
    "updated_at": "12/11/2025 16:10"
}
```

### 6. Eliminar un tipo de carta
**DELETE** `/api/letter-types/{id}/`

Elimina un tipo de carta.

**Parámetros:**
- `id` (path) - ID del tipo de carta

**Respuesta exitosa (204 No Content)**

## Filtros y Búsqueda

### Búsqueda por descripción
```
GET /api/letter-types/?search=adelanto
```

### Filtrar por descripción exacta
```
GET /api/letter-types/?description=Adelanto%20de%20materiales
```

### Ordenamiento
```
GET /api/letter-types/?ordering=description       # Ascendente
GET /api/letter-types/?ordering=-description      # Descendente
GET /api/letter-types/?ordering=-created_at       # Por fecha de creación
```

### Paginación
```
GET /api/letter-types/?page=2
GET /api/letter-types/?page_size=10
```

## Autenticación

Todos los endpoints requieren autenticación. Usa uno de estos métodos:

### 1. Session Authentication (para el navegador)
Inicia sesión en `/api-auth/login/`

### 2. Basic Authentication (para pruebas)
```bash
curl -u username:password http://localhost:8000/api/letter-types/
```

## Ejemplos con cURL

### Listar todos los tipos de carta
```bash
curl -u test_user:testpass123 http://localhost:8000/api/letter-types/
```

### Obtener un tipo de carta específico
```bash
curl -u test_user:testpass123 http://localhost:8000/api/letter-types/1/
```

### Crear un nuevo tipo de carta
```bash
curl -u test_user:testpass123 \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"description":"Garantía de seriedad de oferta"}' \
  http://localhost:8000/api/letter-types/
```

### Actualizar un tipo de carta
```bash
curl -u test_user:testpass123 \
  -X PUT \
  -H "Content-Type: application/json" \
  -d '{"description":"Adelanto de materiales modificado"}' \
  http://localhost:8000/api/letter-types/1/
```

### Eliminar un tipo de carta
```bash
curl -u test_user:testpass123 \
  -X DELETE \
  http://localhost:8000/api/letter-types/1/
```

## Códigos de respuesta HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Eliminación exitosa
- `400 Bad Request` - Error en los datos enviados
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Interfaz Web Interactiva

Puedes probar la API directamente desde el navegador visitando:
```
http://localhost:8000/api/letter-types/
```

La interfaz web de Django REST Framework te permite:
- Ver todos los endpoints disponibles
- Probar las operaciones GET, POST, PUT, PATCH, DELETE
- Ver la documentación automática
- Hacer peticiones sin necesidad de herramientas adicionales

