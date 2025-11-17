from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Max, Subquery, OuterRef, F
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
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
    WarrantyStatusSerializer,
    CurrencyTypeSerializer,
    WarrantySerializer
)


def calcular_tiempo_vencido(fecha_vencimiento, fecha_actual=None):
    """
    Calcula el tiempo transcurrido entre una fecha de vencimiento y la fecha actual.
    
    Args:
        fecha_vencimiento (date): Fecha de vencimiento de la carta fianza
        fecha_actual (date, optional): Fecha actual. Si no se proporciona, usa date.today()
    
    Returns:
        dict: Diccionario con la información del tiempo vencido:
            - days_expired (int): Total de días vencidos
            - years (int): Años completos transcurridos
            - months (int): Meses completos transcurridos (después de restar años)
            - days (int): Días transcurridos (después de restar años y meses)
            - time_expired (str): Representación en texto legible
    
    Ejemplo:
        >>> calcular_tiempo_vencido(date(2024, 12, 31), date(2025, 11, 17))
        {
            'days_expired': 321,
            'years': 0,
            'months': 10,
            'days': 17,
            'time_expired': '10 meses, 17 días'
        }
    """
    if fecha_actual is None:
        fecha_actual = date.today()
    
    # Calcular la diferencia total en días
    days_expired = (fecha_actual - fecha_vencimiento).days
    
    # Usar relativedelta para calcular la diferencia exacta en años, meses y días
    diferencia = relativedelta(fecha_actual, fecha_vencimiento)
    years = diferencia.years
    months = diferencia.months
    days = diferencia.days
    
    # Construir el texto descriptivo
    time_parts = []
    if years > 0:
        time_parts.append(f"{years} año{'s' if years > 1 else ''}")
    if months > 0:
        time_parts.append(f"{months} mes{'es' if months > 1 else ''}")
    if days > 0:
        time_parts.append(f"{days} día{'s' if days > 1 else ''}")
    
    time_expired = ", ".join(time_parts) if time_parts else "Menos de un día"
    
    return {
        'days_expired': days_expired,
        'years': years,
        'months': months,
        'days': days,
        'time_expired': time_expired
    }


def calcular_tiempo_restante(fecha_vencimiento, fecha_actual=None):
    """
    Calcula el tiempo restante hasta una fecha de vencimiento desde la fecha actual.
    
    Args:
        fecha_vencimiento (date): Fecha de vencimiento de la carta fianza
        fecha_actual (date, optional): Fecha actual. Si no se proporciona, usa date.today()
    
    Returns:
        dict: Diccionario con la información del tiempo restante:
            - days_remaining (int): Total de días restantes hasta el vencimiento
            - years (int): Años completos restantes
            - months (int): Meses completos restantes (después de restar años)
            - days (int): Días restantes (después de restar años y meses)
            - time_remaining (str): Representación en texto legible
    
    Ejemplo:
        >>> calcular_tiempo_restante(date(2025, 12, 5), date(2025, 11, 20))
        {
            'days_remaining': 15,
            'years': 0,
            'months': 0,
            'days': 15,
            'time_remaining': '15 días'
        }
    """
    if fecha_actual is None:
        fecha_actual = date.today()
    
    # Calcular la diferencia total en días
    days_remaining = (fecha_vencimiento - fecha_actual).days
    
    # Usar relativedelta para calcular la diferencia exacta en años, meses y días
    diferencia = relativedelta(fecha_vencimiento, fecha_actual)
    years = diferencia.years
    months = diferencia.months
    days = diferencia.days
    
    # Construir el texto descriptivo
    time_parts = []
    if years > 0:
        time_parts.append(f"{years} año{'s' if years > 1 else ''}")
    if months > 0:
        time_parts.append(f"{months} mes{'es' if months > 1 else ''}")
    if days > 0:
        time_parts.append(f"{days} día{'s' if days > 1 else ''}")
    
    time_remaining = ", ".join(time_parts) if time_parts else "Menos de un día"
    
    return {
        'days_remaining': days_remaining,
        'years': years,
        'months': months,
        'days': days,
        'time_remaining': time_remaining
    }


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


class CurrencyTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Tipos de Moneda
    
    Operaciones disponibles:
    - GET /api/currency-types/ - Listar todos los tipos de moneda
    - GET /api/currency-types/{id}/ - Obtener un tipo de moneda específico
    - POST /api/currency-types/ - Crear un nuevo tipo de moneda
    - PUT /api/currency-types/{id}/ - Actualizar un tipo de moneda
    - PATCH /api/currency-types/{id}/ - Actualizar parcialmente un tipo de moneda
    - DELETE /api/currency-types/{id}/ - Eliminar un tipo de moneda
    """
    queryset = CurrencyType.objects.all()
    serializer_class = CurrencyTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = ['description', 'code']
    
    # Campos por los que se puede buscar
    search_fields = ['description', 'code', 'symbol']
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'description', 'code', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto
    ordering = ['description']


class WarrantyViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar Garantías (Cartas Fianza)
    
    Al crear una garantía, se debe proporcionar el primer historial en el campo 'initial_history'.
    Este historial puede incluir archivos PDF opcionales.
    
    Operaciones disponibles:
    - GET /api/warranties/ - Listar todas las garantías
    - GET /api/warranties/{id}/ - Obtener una garantía específica con su historial
    - POST /api/warranties/ - Crear una nueva garantía con su primer historial
    - PUT /api/warranties/{id}/ - Actualizar una garantía
    - PATCH /api/warranties/{id}/ - Actualizar parcialmente una garantía
    - DELETE /api/warranties/{id}/ - Eliminar una garantía
    """
    queryset = Warranty.objects.all().select_related(
        'warranty_object',
        'letter_type',
        'contractor',
        'created_by',
        'updated_by'
    ).prefetch_related(
        'history',
        'history__files',
        'history__warranty_status',
        'history__financial_entity',
        'history__currency_type'
    )
    serializer_class = WarrantySerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Campos por los que se puede filtrar
    filterset_fields = [
        'warranty_object',
        'letter_type',
        'contractor',
        'warranty_object__cui'
    ]
    
    # Campos por los que se puede buscar
    search_fields = [
        'warranty_object__description',
        'warranty_object__cui',
        'contractor__business_name',
        'contractor__ruc',
        'history__letter_number'
    ]
    
    # Campos por los que se puede ordenar
    ordering_fields = ['id', 'created_at', 'updated_at']
    
    # Ordenamiento por defecto (más recientes primero)
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'], url_path='vencidas')
    def cartas_vencidas(self, request):
        """
        Endpoint para obtener el listado de cartas fianza vencidas.
        
        GET /api/warranties/vencidas/
        
        Basado en la consulta SQL que obtiene el último historial de cada garantía
        y filtra por estado activo y fecha de vencimiento.
        
        Filtra por:
        - warranty_status.is_active = True (excluye Devolución y Ejecución)
        - validity_end < fecha actual (vencidas)
        """
        today = date.today()
        
        # Subconsulta para obtener el ID del último historial de cada garantía
        latest_history_subquery = WarrantyHistory.objects.filter(
            warranty_id=OuterRef('warranty_id')
        ).order_by('-id').values('id')[:1]
        
        # Consulta principal: historiales que son los más recientes de cada garantía
        expired_warranties = WarrantyHistory.objects.filter(
            id__in=Subquery(latest_history_subquery)
        ).filter(
            warranty_status__is_active=True  # Solo estados activos
        ).filter(
            validity_end__lt=today  # Vencidas
        ).select_related(
            'warranty',
            'warranty__warranty_object',
            'warranty__letter_type',
            'warranty_status'
        ).annotate(
            max_warranty_history=F('id'),
            warranty_object_id=F('warranty__warranty_object_id'),
            letter_type_id=F('warranty__letter_type_id'),
            warranty_object_description=F('warranty__warranty_object__description'),
            letter_type_description=F('warranty__letter_type__description'),
            warranty_status_description=F('warranty_status__description')
        ).values(
            'max_warranty_history',
            'warranty_id',
            'warranty_object_id',
            'warranty_object_description',
            'letter_type_id',
            'letter_type_description',
            'warranty_status_id',
            'warranty_status_description',
            'letter_number',
            'validity_end'
        ).order_by('validity_end')  # Ordenar por fecha de vencimiento (más antiguas primero)
        
        # Calcular días vencidos para cada carta usando la función calcular_tiempo_vencido
        results = []
        for warranty in expired_warranties:
            # Calcular el tiempo vencido usando la función auxiliar
            tiempo_vencido = calcular_tiempo_vencido(warranty['validity_end'], today)
            
            results.append({
                'max_warranty_history': warranty['max_warranty_history'],
                'warranty_id': warranty['warranty_id'],
                'warranty_object_id': warranty['warranty_object_id'],
                'warranty_object_description': warranty['warranty_object_description'],
                'letter_type_id': warranty['letter_type_id'],
                'letter_type_description': warranty['letter_type_description'],
                'warranty_status_id': warranty['warranty_status_id'],
                'warranty_status_description': warranty['warranty_status_description'],
                'letter_number': warranty['letter_number'],
                'validity_end': warranty['validity_end'],
                'days_expired': tiempo_vencido['days_expired'],
                'time_expired': tiempo_vencido['time_expired'],
                'time_expired_years': tiempo_vencido['years'],
                'time_expired_months': tiempo_vencido['months'],
                'time_expired_days': tiempo_vencido['days']
            })
        
        return Response({
            'count': len(results),
            'results': results
        })
    
    @action(detail=False, methods=['get'], url_path='por-vencer')
    def cartas_por_vencer(self, request):
        """
        Lista las cartas fianza que están por vencer (de 1 a 15 días).
        
        GET /api/warranties/por-vencer/
        
        Similar a cartas_vencidas pero para cartas cuya fecha de vencimiento
        está entre mañana y 15 días desde hoy.
        
        Filtra por:
        - warranty_status.is_active = True (excluye Devolución y Ejecución)
        - validity_end > fecha actual (no vencidas aún)
        - validity_end <= fecha actual + 15 días (próximas a vencer)
        """
        today = date.today()
        max_days_ahead = today + timedelta(days=15)
        
        # Subconsulta para obtener el ID del último historial de cada garantía
        latest_history_subquery = WarrantyHistory.objects.filter(
            warranty_id=OuterRef('warranty_id')
        ).order_by('-id').values('id')[:1]
        
        # Consulta principal: historiales que son los más recientes de cada garantía
        soon_to_expire_warranties = WarrantyHistory.objects.filter(
            id__in=Subquery(latest_history_subquery)
        ).filter(
            warranty_status__is_active=True  # Solo estados activos
        ).filter(
            validity_end__gt=today  # No vencidas aún (mayor que hoy)
        ).filter(
            validity_end__lte=max_days_ahead  # Vencen en los próximos 15 días
        ).select_related(
            'warranty',
            'warranty__warranty_object',
            'warranty__letter_type',
            'warranty_status'
        ).annotate(
            max_warranty_history=F('id'),
            warranty_object_id=F('warranty__warranty_object_id'),
            letter_type_id=F('warranty__letter_type_id'),
            warranty_object_description=F('warranty__warranty_object__description'),
            letter_type_description=F('warranty__letter_type__description'),
            warranty_status_description=F('warranty_status__description')
        ).values(
            'max_warranty_history',
            'warranty_id',
            'warranty_object_id',
            'warranty_object_description',
            'letter_type_id',
            'letter_type_description',
            'warranty_status_id',
            'warranty_status_description',
            'letter_number',
            'validity_end'
        ).order_by('validity_end')  # Ordenar por fecha de vencimiento (más próximas primero)
        
        # Calcular días restantes para cada carta usando la función calcular_tiempo_restante
        results = []
        for warranty in soon_to_expire_warranties:
            # Calcular el tiempo restante usando la función auxiliar
            tiempo_restante = calcular_tiempo_restante(warranty['validity_end'], today)
            
            results.append({
                'max_warranty_history': warranty['max_warranty_history'],
                'warranty_id': warranty['warranty_id'],
                'warranty_object_id': warranty['warranty_object_id'],
                'warranty_object_description': warranty['warranty_object_description'],
                'letter_type_id': warranty['letter_type_id'],
                'letter_type_description': warranty['letter_type_description'],
                'warranty_status_id': warranty['warranty_status_id'],
                'warranty_status_description': warranty['warranty_status_description'],
                'letter_number': warranty['letter_number'],
                'validity_end': warranty['validity_end'],
                'days_remaining': tiempo_restante['days_remaining'],
                'time_remaining': tiempo_restante['time_remaining'],
                'time_remaining_years': tiempo_restante['years'],
                'time_remaining_months': tiempo_restante['months'],
                'time_remaining_days': tiempo_restante['days']
            })
        
        return Response({
            'count': len(results),
            'results': results
        })
    
    @action(detail=False, methods=['get'], url_path='vigentes')
    def cartas_vigentes(self, request):
        """
        Retorna el conteo de cartas fianza vigentes (vencen en más de 15 días).
        
        GET /api/warranties/vigentes/
        
        Cartas cuya fecha de vencimiento es mayor a 15 días desde hoy.
        No retorna el listado completo, solo el total para optimización.
        
        Filtra por:
        - warranty_status.is_active = True (excluye Devolución y Ejecución)
        - validity_end > fecha actual + 15 días (vigentes con tiempo suficiente)
        """
        today = date.today()
        min_days_ahead = today + timedelta(days=15)
        
        # Subconsulta para obtener el ID del último historial de cada garantía
        latest_history_subquery = WarrantyHistory.objects.filter(
            warranty_id=OuterRef('warranty_id')
        ).order_by('-id').values('id')[:1]
        
        # Consulta principal: contar historiales que son los más recientes de cada garantía
        # y que vencen en más de 15 días
        count = WarrantyHistory.objects.filter(
            id__in=Subquery(latest_history_subquery)
        ).filter(
            warranty_status__is_active=True  # Solo estados activos
        ).filter(
            validity_end__gt=min_days_ahead  # Vencen en más de 15 días
        ).count()
        
        return Response({
            'count': count
        })
