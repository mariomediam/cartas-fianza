from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    WarrantyObject,
    LetterType,
    FinancialEntity,
    Contractor,
    WarrantyStatus,
    CurrencyType,
    Warranty,
    WarrantyHistory,
    WarrantyFile
)
from .serializers import (
    LetterTypeSerializer, 
    FinancialEntitySerializer, 
    ContractorSerializer, 
    WarrantyObjectSerializer,
    WarrantyStatusSerializer
)


class LetterTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Tipos de Carta
    
    Operaciones disponibles:
    - GET /api/letter-types/ - Listar todos los tipos de carta
    - GET /api/letter-types/{id}/ - Obtener un tipo de carta específico
    - POST /api/letter-types/ - Crear un nuevo tipo de carta
    - PUT /api/letter-types/{id}/ - Actualizar un tipo de carta
    - PATCH /api/letter-types/{id}/ - Actualizar parcialmente un tipo de carta
    - DELETE /api/letter-types/{id}/ - Eliminar un tipo de carta
    """
    queryset = LetterType.objects.all()
    serializer_class = LetterTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['description']
    
    # Campos por los que se puede buscar
    search_fields = ['description']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'description', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['description']


class FinancialEntityViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Entidades Financieras
    
    Operaciones disponibles:
    - GET /api/financial-entities/ - Listar todas las entidades financieras
    - GET /api/financial-entities/{id}/ - Obtener una entidad financiera específica
    - POST /api/financial-entities/ - Crear una nueva entidad financiera
    - PUT /api/financial-entities/{id}/ - Actualizar una entidad financiera
    - PATCH /api/financial-entities/{id}/ - Actualizar parcialmente una entidad financiera
    - DELETE /api/financial-entities/{id}/ - Eliminar una entidad financiera
    """
    queryset = FinancialEntity.objects.all()
    serializer_class = FinancialEntitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['description']
    
    # Campos por los que se puede buscar
    search_fields = ['description']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'description', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['description']


class ContractorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Contratistas
    
    Operaciones disponibles:
    - GET /api/contractors/ - Listar todos los contratistas
    - GET /api/contractors/{id}/ - Obtener un contratista específico
    - POST /api/contractors/ - Crear un nuevo contratista
    - PUT /api/contractors/{id}/ - Actualizar un contratista
    - PATCH /api/contractors/{id}/ - Actualizar parcialmente un contratista
    - DELETE /api/contractors/{id}/ - Eliminar un contratista
    """
    queryset = Contractor.objects.all()
    serializer_class = ContractorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['business_name', 'ruc']
    
    # Campos por los que se puede buscar
    search_fields = ['business_name', 'ruc']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'business_name', 'ruc', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['business_name']


class WarrantyObjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Objetos de Garantía
    
    Operaciones disponibles:
    - GET /api/warranty-objects/ - Listar todos los objetos de garantía
    - GET /api/warranty-objects/{id}/ - Obtener un objeto de garantía específico
    - POST /api/warranty-objects/ - Crear un nuevo objeto de garantía
    - PUT /api/warranty-objects/{id}/ - Actualizar un objeto de garantía
    - PATCH /api/warranty-objects/{id}/ - Actualizar parcialmente un objeto de garantía
    - DELETE /api/warranty-objects/{id}/ - Eliminar un objeto de garantía
    """
    queryset = WarrantyObject.objects.all()
    serializer_class = WarrantyObjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['description', 'cui']
    
    # Campos por los que se puede buscar
    search_fields = ['description', 'cui']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'description', 'cui', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['-created_at']


class WarrantyStatusViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Estados de Garantía
    
    Operaciones disponibles:
    - GET /api/warranty-statuses/ - Listar todos los estados de garantía
    - GET /api/warranty-statuses/{id}/ - Obtener un estado de garantía específico
    - POST /api/warranty-statuses/ - Crear un nuevo estado de garantía
    - PUT /api/warranty-statuses/{id}/ - Actualizar un estado de garantía
    - PATCH /api/warranty-statuses/{id}/ - Actualizar parcialmente un estado de garantía
    - DELETE /api/warranty-statuses/{id}/ - Eliminar un estado de garantía
    """
    queryset = WarrantyStatus.objects.all()
    serializer_class = WarrantyStatusSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['description']
    
    # Campos por los que se puede buscar
    search_fields = ['description']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'description', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['description']
