# Guía de Contribución

¡Gracias por tu interés en contribuir al Sistema de Gestión de Cartas Fianzas!

## Flujo de Trabajo

### 1. Configurar el Entorno de Desarrollo

Sigue las instrucciones en `INSTALL.md` para configurar tu entorno local.

### 2. Crear Modelos

Los modelos deben crearse en las apps correspondientes:

```python
# backend/apps/nombre_app/models.py
from django.db import models
from django.contrib.auth.models import User

class TuModelo(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    creado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Tu Modelo'
        verbose_name_plural = 'Tus Modelos'
        ordering = ['-creado_en']
    
    def __str__(self):
        return self.nombre
```

### 3. Crear Serializers

```python
# backend/apps/nombre_app/serializers.py
from rest_framework import serializers
from .models import TuModelo

class TuModeloSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)
    
    class Meta:
        model = TuModelo
        fields = '__all__'
        read_only_fields = ['creado_en', 'actualizado_en']
    
    def create(self, validated_data):
        validated_data['creado_por'] = self.context['request'].user
        return super().create(validated_data)
```

### 4. Crear Views

```python
# backend/apps/nombre_app/views.py
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import TuModelo
from .serializers import TuModeloSerializer

class TuModeloViewSet(viewsets.ModelViewSet):
    queryset = TuModelo.objects.all()
    serializer_class = TuModeloSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['campo1', 'campo2']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre', 'creado_en']
    ordering = ['-creado_en']
```

### 5. Configurar URLs

```python
# backend/apps/nombre_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TuModeloViewSet

router = DefaultRouter()
router.register(r'tumodelo', TuModeloViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### 6. Registrar en Admin

```python
# backend/apps/nombre_app/admin.py
from django.contrib import admin
from .models import TuModelo

@admin.register(TuModelo)
class TuModeloAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion', 'creado_en']
    list_filter = ['creado_en']
    search_fields = ['nombre', 'descripcion']
    readonly_fields = ['creado_en', 'actualizado_en', 'creado_por']
```

### 7. Agregar App en Settings

```python
# backend/config/settings.py
INSTALLED_APPS = [
    # ...
    'apps.nombre_app',
]
```

### 8. Agregar URLs en Config

```python
# backend/config/urls.py
urlpatterns = [
    # ...
    path('api/', include('apps.nombre_app.urls')),
]
```

### 9. Ejecutar Migraciones

```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

## Estándares de Código

### Python/Django

- Sigue PEP 8
- Usa nombres descriptivos para variables y funciones
- Documenta funciones complejas
- Escribe docstrings para clases y métodos públicos

### JavaScript/React

- Usa nombres descriptivos para componentes
- Un componente por archivo
- Usa hooks de React cuando sea apropiado
- Comenta código complejo

## Estructura de Commits

Usa mensajes de commit descriptivos:

```
tipo: descripción breve

Descripción más detallada si es necesario

Tipo puede ser:
- feat: Nueva característica
- fix: Corrección de bug
- docs: Cambios en documentación
- style: Cambios de formato
- refactor: Refactorización de código
- test: Añadir o modificar tests
```

Ejemplos:
```
feat: agregar modelo de Cartas Fianzas

fix: corregir cálculo de precio total en Bienes

docs: actualizar README con nuevas instrucciones
```

## Testing

Escribe tests para tus modelos y vistas:

```python
# backend/apps/nombre_app/tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from .models import TuModelo

class TuModeloTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@test.com', 'testpass')
        self.modelo = TuModelo.objects.create(
            nombre='Test',
            descripcion='Test descripción',
            creado_por=self.user
        )
    
    def test_modelo_creation(self):
        self.assertEqual(self.modelo.nombre, 'Test')
        self.assertIsNotNone(self.modelo.creado_en)
```

Ejecuta los tests:
```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py test
```

## Preguntas

Si tienes preguntas o necesitas ayuda, no dudes en preguntar.

## Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo la misma licencia del proyecto.



