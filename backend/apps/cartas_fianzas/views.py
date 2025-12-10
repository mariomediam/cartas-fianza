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
    WarrantySerializer,
    WarrantyObjectSearchSerializer,
    WarrantyHistoryDetailSerializer,
    WarrantyHistoryVigentesPorFechaSerializer
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
    - GET /api/warranty-objects/buscar/?filter_type=...&filter_value=... - Buscar objetos de garantía
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
    
    @action(detail=False, methods=['get'], url_path='buscar')
    def buscar(self, request):
        """
        Buscar objetos de garantía con filtros avanzados
        
        Parámetros:
        - filter_type: Tipo de filtro a aplicar
          * 'letter_number': Buscar por número de carta
          * 'description': Buscar por descripción del objeto de garantía
          * 'contractor_ruc': Buscar por RUC del contratista
          * 'contractor_name': Buscar por nombre del contratista
        - filter_value: Valor a buscar (se usa búsqueda con LIKE/ICONTAINS)
        
        Ejemplo:
        GET /api/warranty-objects/buscar/?filter_type=letter_number&filter_value=002-00
        
        Retorna una lista de objetos de garantía que cumplen con el filtro
        con toda la información anidada de garantías e historiales
        """
        filter_type = request.query_params.get('filter_type', None)
        filter_value = request.query_params.get('filter_value', None)
        
        # Validar que se proporcionaron ambos parámetros
        if not filter_type or not filter_value:
            return Response({
                'error': 'Se requieren los parámetros filter_type y filter_value'
            }, status=400)
        
        # Iniciar queryset base con optimización de consultas
        # Usar prefetch_related para evitar N+1 queries
        from django.db.models import Prefetch
        
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
                        ).order_by('id')
                    )
                )
            )
        )
        
        # Aplicar filtro según el tipo
        if filter_type == 'letter_number':
            # Buscar por número de carta
            # SQL: SELECT DISTINCT warranty_objects.id FROM warranty_objects
            #      INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
            #      INNER JOIN warranty_histories ON warranties.id = warranty_histories.warranty_id
            #      WHERE warranty_histories.letter_number LIKE '%valor%'
            queryset = queryset.filter(
                warranties__history__letter_number__icontains=filter_value
            ).distinct()
            
        elif filter_type == 'description':
            # Buscar por descripción del objeto de garantía
            queryset = queryset.filter(
                description__icontains=filter_value
            ).distinct()
            
        elif filter_type == 'contractor_ruc':
            # Buscar por RUC del contratista
            # SQL: SELECT DISTINCT warranty_objects.id FROM warranty_objects
            #      INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
            #      INNER JOIN contractors ON warranties.contractor_id = contractors.id
            #      WHERE contractors.ruc LIKE '%valor%'
            queryset = queryset.filter(
                warranties__contractor__ruc__icontains=filter_value
            ).distinct()
            
        elif filter_type == 'contractor_name':
            # Buscar por nombre del contratista
            # SQL: SELECT DISTINCT warranty_objects.id FROM warranty_objects
            #      INNER JOIN warranties ON warranty_objects.id = warranties.warranty_object_id
            #      INNER JOIN contractors ON warranties.contractor_id = contractors.id
            #      WHERE contractors.business_name LIKE '%valor%'
            queryset = queryset.filter(
                warranties__contractor__business_name__icontains=filter_value
            ).distinct()
            
        else:
            return Response({
                'error': 'Tipo de filtro no válido. Valores permitidos: letter_number, description, contractor_ruc, contractor_name'
            }, status=400)
        
        # Usar el serializer especial para búsqueda con información anidada
        serializer = WarrantyObjectSearchSerializer(queryset, many=True, context={'request': request})
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })


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
    
    @action(detail=False, methods=['get'], url_path='vigentes-por-fecha')
    def vigentes_por_fecha(self, request):
        """
        Busca cartas fianza vigentes a una fecha específica con filtros opcionales.
        
        GET /api/warranties/vigentes-por-fecha/
        
        Parámetros:
        - fecha (obligatorio): Fecha a la cual deben estar vigentes (formato YYYY-MM-DD)
        - financial_entity_id (opcional): ID de la entidad financiera
        - letter_type_id (opcional): ID del tipo de carta
        - contractor_id (opcional): ID del contratista
        - warranty_object_id (opcional): ID del objeto de garantía
        
        Ejemplo:
        GET /api/warranties/vigentes-por-fecha/?fecha=2025-12-09&contractor_id=1
        
        Retorna las cartas fianza donde la fecha especificada está dentro
        del rango de vigencia (validity_start <= fecha <= validity_end).
        
        Equivalente SQL:
        SELECT warranty_histories.*, warranties.*, currency_types.symbol, ...
        FROM warranty_histories
        LEFT JOIN warranties ON warranty_histories.warranty_id = warranties.id
        LEFT JOIN currency_types ON warranty_histories.currency_type_id = currency_types.id
        LEFT JOIN financial_entities ON warranty_histories.financial_entity_id = financial_entities.id
        LEFT JOIN contractors ON warranties.contractor_id = contractors.id
        LEFT JOIN letter_types ON warranties.letter_type_id = letter_types.id
        LEFT JOIN warranty_objects ON warranties.warranty_object_id = warranty_objects.id
        WHERE '2025-12-09' BETWEEN validity_start AND validity_end
        """
        from datetime import datetime
        
        # Obtener parámetros
        fecha_str = request.query_params.get('fecha', None)
        financial_entity_id = request.query_params.get('financial_entity_id', None)
        letter_type_id = request.query_params.get('letter_type_id', None)
        contractor_id = request.query_params.get('contractor_id', None)
        warranty_object_id = request.query_params.get('warranty_object_id', None)
        
        # Validar fecha obligatoria
        if not fecha_str:
            return Response({
                'error': 'El parámetro "fecha" es obligatorio (formato YYYY-MM-DD)'
            }, status=400)
        
        # Parsear la fecha
        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'El formato de fecha debe ser YYYY-MM-DD'
            }, status=400)
        
        # Construir queryset base con filtro de fecha
        # WHERE fecha BETWEEN validity_start AND validity_end
        queryset = WarrantyHistory.objects.filter(
            validity_start__lte=fecha,
            validity_end__gte=fecha
        ).select_related(
            'warranty',
            'warranty__contractor',
            'warranty__letter_type',
            'warranty__warranty_object',
            'currency_type',
            'financial_entity'
        )
        
        # Aplicar filtros opcionales
        if financial_entity_id:
            queryset = queryset.filter(financial_entity_id=financial_entity_id)
        
        if letter_type_id:
            queryset = queryset.filter(warranty__letter_type_id=letter_type_id)
        
        if contractor_id:
            queryset = queryset.filter(warranty__contractor_id=contractor_id)
        
        if warranty_object_id:
            queryset = queryset.filter(warranty__warranty_object_id=warranty_object_id)
        
        # Ordenar por número de carta
        queryset = queryset.order_by('letter_number')
        
        # Serializar resultados
        serializer = WarrantyHistoryVigentesPorFechaSerializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'fecha_consulta': fecha_str,
            'filtros_aplicados': {
                'financial_entity_id': financial_entity_id,
                'letter_type_id': letter_type_id,
                'contractor_id': contractor_id,
                'warranty_object_id': warranty_object_id
            },
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='vencidas-por-fecha')
    def vencidas_por_fecha(self, request):
        """
        Busca cartas fianza vencidas a una fecha específica con filtros opcionales.
        
        GET /api/warranties/vencidas-por-fecha/
        
        Este endpoint obtiene el ÚLTIMO historial de cada garantía y filtra
        aquellas que están vencidas (validity_end < fecha) y tienen estado activo.
        
        Parámetros:
        - fecha (obligatorio): Fecha de filtro (formato YYYY-MM-DD). 
                               Se buscan cartas vencidas antes de esta fecha.
        - financial_entity_id (opcional): ID de la entidad financiera
        - letter_type_id (opcional): ID del tipo de carta
        - contractor_id (opcional): ID del contratista
        - warranty_object_id (opcional): ID del objeto de garantía
        
        Ejemplo:
        GET /api/warranties/vencidas-por-fecha/?fecha=2026-08-27&contractor_id=1
        
        Lógica:
        1. Obtiene el último historial (max(id)) de cada garantía
        2. Filtra por estados activos (warranty_status.is_active = True)
        3. Filtra donde validity_end < fecha (vencidas)
        4. Aplica filtros opcionales
        
        Equivalente SQL:
        SELECT warranty_histories.*, warranties.*, ...
        FROM (SELECT warranty_id, MAX(id) as history_id 
              FROM warranty_histories GROUP BY warranty_id) as TMaxHistory
        LEFT JOIN warranty_histories ON TMaxHistory.history_id = warranty_histories.id
        LEFT JOIN warranty_statuses ON warranty_histories.warranty_status_id = warranty_statuses.id
        LEFT JOIN warranties ON warranty_histories.warranty_id = warranties.id
        ...
        WHERE warranty_statuses.is_active = true
        AND warranty_histories.validity_end < '2026-08-27'
        """
        from datetime import datetime
        
        # Obtener parámetros
        fecha_str = request.query_params.get('fecha', None)
        financial_entity_id = request.query_params.get('financial_entity_id', None)
        letter_type_id = request.query_params.get('letter_type_id', None)
        contractor_id = request.query_params.get('contractor_id', None)
        warranty_object_id = request.query_params.get('warranty_object_id', None)
        
        # Validar fecha obligatoria
        if not fecha_str:
            return Response({
                'error': 'El parámetro "fecha" es obligatorio (formato YYYY-MM-DD)'
            }, status=400)
        
        # Parsear la fecha
        try:
            fecha = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'El formato de fecha debe ser YYYY-MM-DD'
            }, status=400)
        
        # Subconsulta para obtener el ID del último historial de cada garantía
        # Equivalente a: SELECT warranty_id, MAX(id) FROM warranty_histories GROUP BY warranty_id
        latest_history_subquery = WarrantyHistory.objects.filter(
            warranty_id=OuterRef('warranty_id')
        ).order_by('-id').values('id')[:1]
        
        # Consulta principal: filtrar por último historial, estado activo y vencidas
        queryset = WarrantyHistory.objects.filter(
            id__in=Subquery(latest_history_subquery),
            warranty_status__is_active=True,
            validity_end__lt=fecha
        ).select_related(
            'warranty',
            'warranty__contractor',
            'warranty__letter_type',
            'warranty__warranty_object',
            'currency_type',
            'financial_entity'
        )
        
        # Aplicar filtros opcionales
        if financial_entity_id:
            queryset = queryset.filter(financial_entity_id=financial_entity_id)
        
        if letter_type_id:
            queryset = queryset.filter(warranty__letter_type_id=letter_type_id)
        
        if contractor_id:
            queryset = queryset.filter(warranty__contractor_id=contractor_id)
        
        if warranty_object_id:
            queryset = queryset.filter(warranty__warranty_object_id=warranty_object_id)
        
        # Ordenar por fecha de vencimiento (más antiguas primero)
        queryset = queryset.order_by('validity_end')
        
        # Serializar resultados
        serializer = WarrantyHistoryVigentesPorFechaSerializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'fecha_consulta': fecha_str,
            'filtros_aplicados': {
                'financial_entity_id': financial_entity_id,
                'letter_type_id': letter_type_id,
                'contractor_id': contractor_id,
                'warranty_object_id': warranty_object_id
            },
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='devueltas-por-periodo')
    def devueltas_por_periodo(self, request):
        """
        Busca cartas fianza devueltas en un período específico con filtros opcionales.
        Incluye los datos de la carta original (anterior a la devolución).
        
        GET /api/warranties/devueltas-por-periodo/
        
        Este endpoint busca todos los historiales con estado de devolución (warranty_status_id = 3)
        cuya fecha de emisión (issue_date) está dentro del período especificado, junto con
        los datos de la carta original (el historial anterior más reciente).
        
        Parámetros:
        - fecha_desde (obligatorio): Fecha de inicio del período (formato YYYY-MM-DD)
        - fecha_hasta (obligatorio): Fecha de fin del período (formato YYYY-MM-DD)
        - financial_entity_id (opcional): ID de la entidad financiera (de la carta original)
        - letter_type_id (opcional): ID del tipo de carta
        - contractor_id (opcional): ID del contratista
        - warranty_object_id (opcional): ID del objeto de garantía
        
        Ejemplo:
        GET /api/warranties/devueltas-por-periodo/?fecha_desde=2025-01-01&fecha_hasta=2025-12-31
        
        Lógica:
        1. Filtra por warranty_status_id = 3 (Devolución)
        2. Filtra por issue_date entre fecha_desde y fecha_hasta
        3. Para cada devolución, obtiene el historial original (MAX(id) WHERE id < id_devolución)
        4. Aplica filtros opcionales
        
        Campos retornados:
        - id: ID del historial de devolución
        - issue_date: Fecha de devolución
        - warranty_id: ID de la garantía
        - letter_number_orig: Número de carta original
        - validity_start_orig: Inicio vigencia original
        - validity_end_orig: Fin vigencia original
        - amount_orig: Monto original
        - currency_type_id_orig: ID tipo moneda original
        - symbol_orig: Símbolo moneda original
        - financial_entity_id_orig: ID entidad financiera original
        - financial_entity_description_orig: Descripción entidad financiera original
        - contractor_id, contractor_business_name, contractor_ruc
        - letter_type_id, letter_type_description
        - warranty_object_id, warranty_object_description, warranty_object_cui
        """
        from datetime import datetime
        
        # ID del estado de devolución
        DEVOLUCION_STATUS_ID = 3
        
        # Obtener parámetros
        fecha_desde_str = request.query_params.get('fecha_desde', None)
        fecha_hasta_str = request.query_params.get('fecha_hasta', None)
        financial_entity_id = request.query_params.get('financial_entity_id', None)
        letter_type_id = request.query_params.get('letter_type_id', None)
        contractor_id = request.query_params.get('contractor_id', None)
        warranty_object_id = request.query_params.get('warranty_object_id', None)
        
        # Validar fechas obligatorias
        if not fecha_desde_str or not fecha_hasta_str:
            return Response({
                'error': 'Los parámetros "fecha_desde" y "fecha_hasta" son obligatorios (formato YYYY-MM-DD)'
            }, status=400)
        
        # Parsear las fechas
        try:
            fecha_desde = datetime.strptime(fecha_desde_str, '%Y-%m-%d').date()
            fecha_hasta = datetime.strptime(fecha_hasta_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'El formato de fecha debe ser YYYY-MM-DD'
            }, status=400)
        
        # Validar que fecha_desde sea menor o igual a fecha_hasta
        if fecha_desde > fecha_hasta:
            return Response({
                'error': 'La fecha_desde debe ser menor o igual a fecha_hasta'
            }, status=400)
        
        # Paso 1: Obtener las devoluciones en el período
        devoluciones = WarrantyHistory.objects.filter(
            warranty_status_id=DEVOLUCION_STATUS_ID,
            issue_date__gte=fecha_desde,
            issue_date__lte=fecha_hasta
        ).select_related(
            'warranty',
            'warranty__contractor',
            'warranty__letter_type',
            'warranty__warranty_object'
        )
        
        # Aplicar filtros opcionales sobre la garantía
        if letter_type_id:
            devoluciones = devoluciones.filter(warranty__letter_type_id=letter_type_id)
        
        if contractor_id:
            devoluciones = devoluciones.filter(warranty__contractor_id=contractor_id)
        
        if warranty_object_id:
            devoluciones = devoluciones.filter(warranty__warranty_object_id=warranty_object_id)
        
        # Ordenar por fecha de emisión
        devoluciones = devoluciones.order_by('issue_date')
        
        # Paso 2: Para cada devolución, obtener el historial original y construir el resultado
        results = []
        
        for devolucion in devoluciones:
            # Obtener el historial original (el anterior más reciente a la devolución)
            # MAX(id) WHERE warranty_id = devolucion.warranty_id AND id < devolucion.id
            historial_original = WarrantyHistory.objects.filter(
                warranty_id=devolucion.warranty_id,
                id__lt=devolucion.id
            ).select_related(
                'currency_type',
                'financial_entity'
            ).order_by('-id').first()
            
            # Si hay filtro por financial_entity_id, verificar que el original coincida
            if financial_entity_id:
                if not historial_original or str(historial_original.financial_entity_id) != str(financial_entity_id):
                    continue  # Saltar esta devolución si no coincide el filtro
            
            # Construir el resultado combinando datos de devolución y original
            result = {
                # Datos de la devolución
                'id': devolucion.id,
                'issue_date': devolucion.issue_date,
                'warranty_id': devolucion.warranty_id,
                
                # Datos de la carta original
                'letter_number_orig': historial_original.letter_number if historial_original else None,
                'validity_start_orig': historial_original.validity_start if historial_original else None,
                'validity_end_orig': historial_original.validity_end if historial_original else None,
                'amount_orig': str(historial_original.amount) if historial_original and historial_original.amount else None,
                'currency_type_id_orig': historial_original.currency_type_id if historial_original else None,
                'symbol_orig': historial_original.currency_type.symbol if historial_original and historial_original.currency_type else None,
                'financial_entity_id_orig': historial_original.financial_entity_id if historial_original else None,
                'financial_entity_description_orig': historial_original.financial_entity.description if historial_original and historial_original.financial_entity else None,
                
                # Datos de la garantía (warranty)
                'contractor_id': devolucion.warranty.contractor_id,
                'contractor_business_name': devolucion.warranty.contractor.business_name,
                'contractor_ruc': devolucion.warranty.contractor.ruc,
                'letter_type_id': devolucion.warranty.letter_type_id,
                'letter_type_description': devolucion.warranty.letter_type.description,
                'warranty_object_id': devolucion.warranty.warranty_object_id,
                'warranty_object_description': devolucion.warranty.warranty_object.description,
                'warranty_object_cui': devolucion.warranty.warranty_object.cui,
            }
            
            results.append(result)
        
        return Response({
            'count': len(results),
            'periodo': {
                'fecha_desde': fecha_desde_str,
                'fecha_hasta': fecha_hasta_str
            },
            'filtros_aplicados': {
                'financial_entity_id': financial_entity_id,
                'letter_type_id': letter_type_id,
                'contractor_id': contractor_id,
                'warranty_object_id': warranty_object_id
            },
            'results': results
        })
    
    @action(detail=False, methods=['get'], url_path='ejecutadas-por-periodo')
    def ejecutadas_por_periodo(self, request):
        """
        Busca cartas fianza ejecutadas en un período específico con filtros opcionales.
        Incluye los datos de la carta original (anterior a la ejecución).
        
        GET /api/warranties/ejecutadas-por-periodo/
        
        Este endpoint busca todos los historiales con estado de ejecución (warranty_status_id = 6)
        cuya fecha de emisión (issue_date) está dentro del período especificado, junto con
        los datos de la carta original (el historial anterior más reciente).
        
        Parámetros:
        - fecha_desde (obligatorio): Fecha de inicio del período (formato YYYY-MM-DD)
        - fecha_hasta (obligatorio): Fecha de fin del período (formato YYYY-MM-DD)
        - financial_entity_id (opcional): ID de la entidad financiera (de la carta original)
        - letter_type_id (opcional): ID del tipo de carta
        - contractor_id (opcional): ID del contratista
        - warranty_object_id (opcional): ID del objeto de garantía
        
        Ejemplo:
        GET /api/warranties/ejecutadas-por-periodo/?fecha_desde=2025-01-01&fecha_hasta=2025-12-31
        
        Lógica:
        1. Filtra por warranty_status_id = 6 (Ejecución)
        2. Filtra por issue_date entre fecha_desde y fecha_hasta
        3. Para cada ejecución, obtiene el historial original (MAX(id) WHERE id < id_ejecución)
        4. Aplica filtros opcionales
        
        Campos retornados:
        - id: ID del historial de ejecución
        - issue_date: Fecha de ejecución
        - warranty_id: ID de la garantía
        - letter_number_orig: Número de carta original
        - validity_start_orig: Inicio vigencia original
        - validity_end_orig: Fin vigencia original
        - amount_orig: Monto original
        - currency_type_id_orig: ID tipo moneda original
        - symbol_orig: Símbolo moneda original
        - financial_entity_id_orig: ID entidad financiera original
        - financial_entity_description_orig: Descripción entidad financiera original
        - contractor_id, contractor_business_name, contractor_ruc
        - letter_type_id, letter_type_description
        - warranty_object_id, warranty_object_description, warranty_object_cui
        """
        from datetime import datetime
        
        # ID del estado de ejecución
        EJECUCION_STATUS_ID = 6
        
        # Obtener parámetros
        fecha_desde_str = request.query_params.get('fecha_desde', None)
        fecha_hasta_str = request.query_params.get('fecha_hasta', None)
        financial_entity_id = request.query_params.get('financial_entity_id', None)
        letter_type_id = request.query_params.get('letter_type_id', None)
        contractor_id = request.query_params.get('contractor_id', None)
        warranty_object_id = request.query_params.get('warranty_object_id', None)
        
        # Validar fechas obligatorias
        if not fecha_desde_str or not fecha_hasta_str:
            return Response({
                'error': 'Los parámetros "fecha_desde" y "fecha_hasta" son obligatorios (formato YYYY-MM-DD)'
            }, status=400)
        
        # Parsear las fechas
        try:
            fecha_desde = datetime.strptime(fecha_desde_str, '%Y-%m-%d').date()
            fecha_hasta = datetime.strptime(fecha_hasta_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'El formato de fecha debe ser YYYY-MM-DD'
            }, status=400)
        
        # Validar que fecha_desde sea menor o igual a fecha_hasta
        if fecha_desde > fecha_hasta:
            return Response({
                'error': 'La fecha_desde debe ser menor o igual a fecha_hasta'
            }, status=400)
        
        # Paso 1: Obtener las ejecuciones en el período
        ejecuciones = WarrantyHistory.objects.filter(
            warranty_status_id=EJECUCION_STATUS_ID,
            issue_date__gte=fecha_desde,
            issue_date__lte=fecha_hasta
        ).select_related(
            'warranty',
            'warranty__contractor',
            'warranty__letter_type',
            'warranty__warranty_object'
        )
        
        # Aplicar filtros opcionales sobre la garantía
        if letter_type_id:
            ejecuciones = ejecuciones.filter(warranty__letter_type_id=letter_type_id)
        
        if contractor_id:
            ejecuciones = ejecuciones.filter(warranty__contractor_id=contractor_id)
        
        if warranty_object_id:
            ejecuciones = ejecuciones.filter(warranty__warranty_object_id=warranty_object_id)
        
        # Ordenar por fecha de emisión
        ejecuciones = ejecuciones.order_by('issue_date')
        
        # Paso 2: Para cada ejecución, obtener el historial original y construir el resultado
        results = []
        
        for ejecucion in ejecuciones:
            # Obtener el historial original (el anterior más reciente a la ejecución)
            # MAX(id) WHERE warranty_id = ejecucion.warranty_id AND id < ejecucion.id
            historial_original = WarrantyHistory.objects.filter(
                warranty_id=ejecucion.warranty_id,
                id__lt=ejecucion.id
            ).select_related(
                'currency_type',
                'financial_entity'
            ).order_by('-id').first()
            
            # Si hay filtro por financial_entity_id, verificar que el original coincida
            if financial_entity_id:
                if not historial_original or str(historial_original.financial_entity_id) != str(financial_entity_id):
                    continue  # Saltar esta ejecución si no coincide el filtro
            
            # Construir el resultado combinando datos de ejecución y original
            result = {
                # Datos de la ejecución
                'id': ejecucion.id,
                'issue_date': ejecucion.issue_date,
                'warranty_id': ejecucion.warranty_id,
                
                # Datos de la carta original
                'letter_number_orig': historial_original.letter_number if historial_original else None,
                'validity_start_orig': historial_original.validity_start if historial_original else None,
                'validity_end_orig': historial_original.validity_end if historial_original else None,
                'amount_orig': str(historial_original.amount) if historial_original and historial_original.amount else None,
                'currency_type_id_orig': historial_original.currency_type_id if historial_original else None,
                'symbol_orig': historial_original.currency_type.symbol if historial_original and historial_original.currency_type else None,
                'financial_entity_id_orig': historial_original.financial_entity_id if historial_original else None,
                'financial_entity_description_orig': historial_original.financial_entity.description if historial_original and historial_original.financial_entity else None,
                
                # Datos de la garantía (warranty)
                'contractor_id': ejecucion.warranty.contractor_id,
                'contractor_business_name': ejecucion.warranty.contractor.business_name,
                'contractor_ruc': ejecucion.warranty.contractor.ruc,
                'letter_type_id': ejecucion.warranty.letter_type_id,
                'letter_type_description': ejecucion.warranty.letter_type.description,
                'warranty_object_id': ejecucion.warranty.warranty_object_id,
                'warranty_object_description': ejecucion.warranty.warranty_object.description,
                'warranty_object_cui': ejecucion.warranty.warranty_object.cui,
            }
            
            results.append(result)
        
        return Response({
            'count': len(results),
            'periodo': {
                'fecha_desde': fecha_desde_str,
                'fecha_hasta': fecha_hasta_str
            },
            'filtros_aplicados': {
                'financial_entity_id': financial_entity_id,
                'letter_type_id': letter_type_id,
                'contractor_id': contractor_id,
                'warranty_object_id': warranty_object_id
            },
            'results': results
        })


class WarrantyHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para obtener el detalle de un historial de garantía
    
    Este ViewSet proporciona endpoints de solo lectura para consultar
    el historial de garantías con toda su información relacionada.
    
    Operaciones disponibles:
    - GET /api/warranty-histories/ - Listar todos los historiales
    - GET /api/warranty-histories/{id}/ - Obtener un historial específico con toda su información
    
    La consulta optimizada incluye:
    - Información del historial de garantía
    - Datos de la garantía asociada
    - Tipo de carta
    - Entidad financiera
    - Contratista
    - Tipo de moneda
    - Archivos adjuntos
    
    Equivalente a la consulta SQL:
    SELECT * FROM warranty_histories
    INNER JOIN warranties ON warranty_histories.warranty_id = warranties.id
    LEFT JOIN letter_types ON warranties.letter_type_id = letter_types.id
    LEFT JOIN financial_entities ON warranty_histories.financial_entity_id = financial_entities.id
    LEFT JOIN contractors ON warranties.contractor_id = contractors.id
    LEFT JOIN currency_types ON warranty_histories.currency_type_id = currency_types.id
    LEFT JOIN warranty_files ON warranty_histories.id = warranty_files.warranty_history_id
    WHERE warranty_histories.id = {id}
    """
    serializer_class = WarrantyHistoryDetailSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_queryset(self):
        """
        Obtiene el queryset optimizado con select_related y prefetch_related
        para minimizar las consultas a la base de datos.
        
        Conversión de SQL a ORM de Django:
        - INNER JOIN warranties: select_related('warranty')
        - LEFT JOIN letter_types: select_related('warranty__letter_type')
        - LEFT JOIN financial_entities: select_related('financial_entity')
        - LEFT JOIN contractors: select_related('warranty__contractor')
        - LEFT JOIN currency_types: select_related('currency_type')
        - LEFT JOIN warranty_files: prefetch_related('files')
        """
        return WarrantyHistory.objects.select_related(
            # INNER JOIN con warranty
            'warranty',
            # Relaciones de warranty
            'warranty__warranty_object',
            'warranty__letter_type',
            'warranty__contractor',
            # Relaciones directas de warranty_history
            'financial_entity',
            'currency_type',
            'warranty_status',
            # Información de auditoría
            'created_by',
            'updated_by'
        ).prefetch_related(
            # LEFT JOIN con warranty_files (relación inversa)
            'files'
        )
    
    @action(detail=True, methods=['get'], url_path='is-latest')
    def is_latest(self, request, pk=None):
        """
        Verifica si un historial es el último de su garantía.
        
        GET /api/warranty-histories/{id}/is-latest/
        
        Conversión de SQL a ORM:
        SELECT warranty_id, MAX(id) AS max_history_id
        FROM warranty_histories
        WHERE warranty_histories.warranty_id = (SELECT warranty_id FROM warranty_histories WHERE id = {pk})
        GROUP BY warranty_id
        
        ORM equivalente:
        WarrantyHistory.objects.filter(
            warranty_id=history.warranty_id
        ).aggregate(max_history_id=Max('id'))
        
        Retorna:
        {
            "is_latest": true/false,
            "history_id": 7,
            "warranty_id": 2,
            "latest_history_id": 7
        }
        """
        try:
            history = self.get_object()
            warranty_id = history.warranty_id
            
            # Obtener el ID del último historial para esta garantía
            # Conversión de: SELECT MAX(id) FROM warranty_histories WHERE warranty_id = X
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).aggregate(max_id=Max('id'))
            
            latest_history_id = latest_history['max_id']
            is_latest = (history.id == latest_history_id)
            
            return Response({
                'is_latest': is_latest,
                'history_id': history.id,
                'warranty_id': warranty_id,
                'latest_history_id': latest_history_id,
                'message': 'Este es el último historial de la garantía' if is_latest else 'Este NO es el último historial de la garantía'
            })
            
        except WarrantyHistory.DoesNotExist:
            return Response(
                {'error': 'Historial de garantía no encontrado'},
                status=404
            )
    
    @action(detail=False, methods=['get'], url_path='latest-by-warranty/(?P<warranty_id>[^/.]+)')
    def latest_by_warranty(self, request, warranty_id=None):
        """
        Obtiene el último historial de una garantía específica.
        
        GET /api/warranty-histories/latest-by-warranty/{warranty_id}/
        
        Conversión de SQL a ORM:
        SELECT warranty_id, MAX(id) AS max_history_id
        FROM warranty_histories
        WHERE warranty_histories.warranty_id = {warranty_id}
        GROUP BY warranty_id
        
        ORM equivalente (Opción 1 - Solo el ID):
        WarrantyHistory.objects.filter(
            warranty_id=warranty_id
        ).aggregate(max_history_id=Max('id'))
        
        ORM equivalente (Opción 2 - Objeto completo):
        WarrantyHistory.objects.filter(
            warranty_id=warranty_id
        ).order_by('-id').first()
        
        Retorna el historial completo con toda su información.
        """
        try:
            # Obtener el último historial usando order_by('-id').first()
            # Esto es más eficiente que aggregate + get
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related(
                'files'
            ).order_by('-id').first()
            
            if not latest_history:
                return Response(
                    {'error': f'No se encontró historial para la garantía {warranty_id}'},
                    status=404
                )
            
            # Serializar el historial completo
            serializer = self.get_serializer(latest_history)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=400
            )
    
    @action(detail=False, methods=['post'], url_path='renovar')
    def renovar(self, request):
        """
        Renueva una carta fianza creando un nuevo historial.
        
        POST /api/warranty-histories/renovar/
        
        Crea un nuevo registro en warranty_histories con estado "Renovación" (o el que se indique).
        Solo se puede renovar si el último historial tiene un estado activo.
        
        Campos requeridos:
        - warranty_id: ID de la garantía a renovar
        - letter_number: Nuevo número de carta
        - financial_entity: ID de la entidad financiera
        - financial_entity_address: Dirección de la entidad
        - issue_date: Fecha de emisión (YYYY-MM-DD)
        - validity_start: Inicio de vigencia (YYYY-MM-DD)
        - validity_end: Fin de vigencia (YYYY-MM-DD)
        - currency_type: ID del tipo de moneda
        - amount: Monto de la renovación
        - warranty_status: ID del estado (normalmente "Renovación")
        
        Campos opcionales:
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF adjuntos
        
        Validaciones:
        1. El último historial debe tener estado activo (is_active=True)
        2. Las fechas deben ser válidas
        3. El monto debe ser mayor a 0
        """
        try:
            # Obtener warranty_id del request
            warranty_id = request.data.get('warranty_id')
            
            if not warranty_id:
                return Response(
                    {'error': 'El campo warranty_id es requerido'},
                    status=400
                )
            
            # Verificar que la garantía existe
            try:
                warranty = Warranty.objects.get(id=warranty_id)
            except Warranty.DoesNotExist:
                return Response(
                    {'error': f'No se encontró la garantía con ID {warranty_id}'},
                    status=404
                )
            
            # Obtener el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).select_related('warranty_status').order_by('-id').first()
            
            if not latest_history:
                return Response(
                    {'error': 'La garantía no tiene historial'},
                    status=400
                )
            
            # Validar que el último historial tenga estado activo
            if not latest_history.warranty_status.is_active:
                return Response(
                    {
                        'error': 'Solo se puede renovar una carta con estado activo',
                        'current_status': latest_history.warranty_status.description,
                        'is_active': latest_history.warranty_status.is_active
                    },
                    status=400
                )
            
            # Validar campos requeridos
            required_fields = [
                'letter_number', 'financial_entity', 'financial_entity_address',
                'issue_date', 'validity_start', 'validity_end',
                'currency_type', 'amount', 'warranty_status'
            ]
            
            missing_fields = [field for field in required_fields if not request.data.get(field)]
            if missing_fields:
                return Response(
                    {'error': f'Campos requeridos faltantes: {", ".join(missing_fields)}'},
                    status=400
                )
            
            # Validar fechas
            from datetime import datetime
            try:
                issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
                validity_start = datetime.strptime(request.data.get('validity_start'), '%Y-%m-%d').date()
                validity_end = datetime.strptime(request.data.get('validity_end'), '%Y-%m-%d').date()
                
                if validity_start > validity_end:
                    return Response(
                        {'error': 'La fecha de fin de vigencia debe ser posterior al inicio'},
                        status=400
                    )
                
                if issue_date > validity_start:
                    return Response(
                        {'error': 'La fecha de inicio debe ser posterior o igual a la fecha de emisión'},
                        status=400
                    )
            except ValueError as e:
                return Response(
                    {'error': f'Formato de fecha inválido. Use YYYY-MM-DD. Detalle: {str(e)}'},
                    status=400
                )
            
            # Validar monto
            try:
                amount = float(request.data.get('amount'))
                if amount <= 0:
                    return Response(
                        {'error': 'El monto debe ser mayor a 0'},
                        status=400
                    )
            except (ValueError, TypeError):
                return Response(
                    {'error': 'El monto debe ser un número válido'},
                    status=400
                )
            
            # Crear el nuevo historial de renovación
            new_history = WarrantyHistory.objects.create(
                warranty=warranty,
                warranty_status_id=request.data.get('warranty_status'),
                letter_number=request.data.get('letter_number'),
                financial_entity_id=request.data.get('financial_entity'),
                financial_entity_address=request.data.get('financial_entity_address'),
                issue_date=issue_date,
                validity_start=validity_start,
                validity_end=validity_end,
                currency_type_id=request.data.get('currency_type'),
                amount=amount,
                reference_document=request.data.get('reference_document', ''),
                comments=request.data.get('comments', ''),
                created_by=request.user
            )
            
            # Manejar archivos adjuntos
            files = request.FILES.getlist('files')
            for file in files:
                WarrantyFile.objects.create(
                    warranty_history=new_history,
                    file=file,
                    file_name=file.name,
                    created_by=request.user
                )
            
            # Recargar con todas las relaciones
            new_history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=new_history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(new_history)
            
            return Response(serializer.data, status=201)
            
        except Exception as e:
            return Response(
                {'error': f'Error al renovar la carta: {str(e)}'},
                status=400
            )
    
    @action(detail=False, methods=['post'], url_path='devolver')
    def devolver(self, request):
        """
        Devuelve una carta fianza creando un nuevo historial con estado "Devolución".
        
        POST /api/warranty-histories/devolver/
        
        Crea un nuevo registro en warranty_histories con estado "Devolución" (ID 3).
        Solo se puede devolver si el último historial tiene un estado activo.
        
        Campos requeridos:
        - warranty_id: ID de la garantía a devolver
        - issue_date: Fecha de devolución (YYYY-MM-DD)
        
        Campos opcionales:
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF adjuntos
        
        Campos que van en NULL:
        - letter_number, financial_entity, financial_entity_address
        - validity_start, validity_end, currency_type, amount
        
        Validaciones:
        1. El último historial debe tener estado activo (is_active=True)
        2. La fecha debe ser válida
        """
        try:
            # Obtener warranty_id del request
            warranty_id = request.data.get('warranty_id')
            
            if not warranty_id:
                return Response(
                    {'error': 'El campo warranty_id es requerido'},
                    status=400
                )
            
            # Verificar que la garantía existe
            try:
                warranty = Warranty.objects.get(id=warranty_id)
            except Warranty.DoesNotExist:
                return Response(
                    {'error': f'No se encontró la garantía con ID {warranty_id}'},
                    status=404
                )
            
            # Obtener el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).select_related('warranty_status').order_by('-id').first()
            
            if not latest_history:
                return Response(
                    {'error': 'La garantía no tiene historial'},
                    status=400
                )
            
            # Validar que el último historial tenga estado activo
            if not latest_history.warranty_status.is_active:
                return Response(
                    {
                        'error': 'Solo se puede devolver una carta con estado activo',
                        'current_status': latest_history.warranty_status.description,
                        'is_active': latest_history.warranty_status.is_active
                    },
                    status=400
                )
            
            # Validar campo requerido: issue_date
            if not request.data.get('issue_date'):
                return Response(
                    {'error': 'El campo issue_date es requerido'},
                    status=400
                )
            
            # Validar fecha
            from datetime import datetime
            try:
                issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
            except ValueError as e:
                return Response(
                    {'error': f'Formato de fecha inválido. Use YYYY-MM-DD. Detalle: {str(e)}'},
                    status=400
                )
            
            # Obtener el estado "Devolución" (ID 3)
            try:
                devolution_status = WarrantyStatus.objects.get(id=3)
            except WarrantyStatus.DoesNotExist:
                return Response(
                    {'error': 'No se encontró el estado de Devolución (ID 3)'},
                    status=400
                )
            
            # Obtener el financial_entity del último historial que lo tenga
            # Buscar en el historial más reciente con financial_entity no nulo
            history_with_financial_entity = WarrantyHistory.objects.filter(
                warranty_id=warranty_id,
                financial_entity__isnull=False
            ).order_by('-id').first()
            
            # Obtener el financial_entity del historial encontrado (o None si no hay ninguno)
            financial_entity_from_history = (
                history_with_financial_entity.financial_entity 
                if history_with_financial_entity 
                else None
            )
            
            # Crear el nuevo historial de devolución
            # Los campos no aplicables van en null, excepto financial_entity que se hereda
            new_history = WarrantyHistory.objects.create(
                warranty=warranty,
                warranty_status=devolution_status,
                letter_number=None,  # No aplica para devolución
                financial_entity=financial_entity_from_history,  # Se hereda del historial anterior
                financial_entity_address=None,  # No aplica para devolución
                issue_date=issue_date,
                validity_start=None,  # No aplica para devolución
                validity_end=None,  # No aplica para devolución
                currency_type=None,  # No aplica para devolución
                amount=None,  # No aplica para devolución
                reference_document=request.data.get('reference_document', ''),
                comments=request.data.get('comments', ''),
                created_by=request.user
            )
            
            # Manejar archivos adjuntos
            files = request.FILES.getlist('files')
            for file in files:
                WarrantyFile.objects.create(
                    warranty_history=new_history,
                    file=file,
                    file_name=file.name,
                    created_by=request.user
                )
            
            # Recargar con todas las relaciones
            new_history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=new_history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(new_history)
            
            return Response(serializer.data, status=201)
            
        except Exception as e:
            return Response(
                {'error': f'Error al devolver la carta: {str(e)}'},
                status=400
            )
    
    @action(detail=True, methods=['delete'], url_path='eliminar')
    def eliminar(self, request, pk=None):
        """
        Elimina un historial de garantía y sus archivos asociados.
        
        DELETE /api/warranty-histories/{id}/eliminar/
        
        Solo se puede eliminar el último historial de una garantía.
        Si es el único historial, también se elimina la garantía.
        
        Elimina:
        - Archivos físicos del servidor
        - Registros de warranty_files
        - Registro de warranty_history
        - Si es el único historial, también elimina la garantía (warranty)
        
        Validaciones:
        1. El historial debe existir
        2. Debe ser el último historial de la garantía
        """
        try:
            # Obtener el historial
            try:
                history = WarrantyHistory.objects.select_related(
                    'warranty',
                    'warranty_status'
                ).prefetch_related('files').get(id=pk)
            except WarrantyHistory.DoesNotExist:
                return Response(
                    {'error': f'No se encontró el historial con ID {pk}'},
                    status=404
                )
            
            warranty_id = history.warranty_id
            warranty = history.warranty
            
            # Verificar que es el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).order_by('-id').first()
            
            if latest_history.id != history.id:
                return Response(
                    {
                        'error': 'Solo se puede eliminar el último historial de la garantía',
                        'history_id': history.id,
                        'latest_history_id': latest_history.id
                    },
                    status=400
                )
            
            # Contar historiales para saber si es el único
            history_count = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).count()
            
            is_only_history = (history_count <= 1)
            
            # Eliminar archivos físicos del servidor
            for file_obj in history.files.all():
                if file_obj.file:
                    try:
                        # Eliminar archivo físico
                        file_obj.file.delete(save=False)
                    except Exception as e:
                        # Log del error pero continuar con la eliminación
                        print(f'Error al eliminar archivo físico: {e}')
            
            # Eliminar registros de archivos
            history.files.all().delete()
            
            # Guardar información para la respuesta antes de eliminar
            deleted_info = {
                'history_id': history.id,
                'warranty_id': warranty_id,
                'letter_number': history.letter_number,
                'warranty_status': history.warranty_status.description if history.warranty_status else None,
                'warranty_deleted': is_only_history
            }
            
            # Eliminar el historial
            history.delete()
            
            # Si era el único historial, eliminar también la garantía
            if is_only_history:
                warranty.delete()
                return Response({
                    'message': 'Historial y garantía eliminados correctamente',
                    'deleted': deleted_info
                }, status=200)
            
            return Response({
                'message': 'Historial eliminado correctamente',
                'deleted': deleted_info
            }, status=200)
            
        except Exception as e:
            return Response(
                {'error': f'Error al eliminar el historial: {str(e)}'},
                status=400
            )
    
    @action(detail=False, methods=['post'], url_path='ejecutar')
    def ejecutar(self, request):
        """
        Ejecuta una carta fianza creando un nuevo historial con estado "Ejecución".
        
        POST /api/warranty-histories/ejecutar/
        
        Crea un nuevo registro en warranty_histories con estado "Ejecución" (ID 6).
        Solo se puede ejecutar si el último historial tiene un estado activo.
        
        Campos requeridos:
        - warranty_id: ID de la garantía a ejecutar
        - issue_date: Fecha de ejecución (YYYY-MM-DD)
        
        Campos opcionales:
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF adjuntos
        
        Campos que van en NULL:
        - letter_number, financial_entity, financial_entity_address
        - validity_start, validity_end, currency_type, amount
        
        Validaciones:
        1. El último historial debe tener estado activo (is_active=True)
        2. La fecha debe ser válida
        """
        try:
            # Obtener warranty_id del request
            warranty_id = request.data.get('warranty_id')
            
            if not warranty_id:
                return Response(
                    {'error': 'El campo warranty_id es requerido'},
                    status=400
                )
            
            # Verificar que la garantía existe
            try:
                warranty = Warranty.objects.get(id=warranty_id)
            except Warranty.DoesNotExist:
                return Response(
                    {'error': f'No se encontró la garantía con ID {warranty_id}'},
                    status=404
                )
            
            # Obtener el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=warranty_id
            ).select_related('warranty_status').order_by('-id').first()
            
            if not latest_history:
                return Response(
                    {'error': 'La garantía no tiene historial'},
                    status=400
                )
            
            # Validar que el último historial tenga estado activo
            if not latest_history.warranty_status.is_active:
                return Response(
                    {
                        'error': 'Solo se puede ejecutar una carta con estado activo',
                        'current_status': latest_history.warranty_status.description,
                        'is_active': latest_history.warranty_status.is_active
                    },
                    status=400
                )
            
            # Validar campo requerido: issue_date
            if not request.data.get('issue_date'):
                return Response(
                    {'error': 'El campo issue_date es requerido'},
                    status=400
                )
            
            # Validar fecha
            from datetime import datetime
            try:
                issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
            except ValueError as e:
                return Response(
                    {'error': f'Formato de fecha inválido. Use YYYY-MM-DD. Detalle: {str(e)}'},
                    status=400
                )
            
            # Obtener el estado "Ejecución" (ID 6)
            try:
                execution_status = WarrantyStatus.objects.get(id=6)
            except WarrantyStatus.DoesNotExist:
                return Response(
                    {'error': 'No se encontró el estado de Ejecución (ID 6)'},
                    status=400
                )
            
            # Obtener el financial_entity del último historial que lo tenga
            # Buscar en el historial más reciente con financial_entity no nulo
            history_with_financial_entity = WarrantyHistory.objects.filter(
                warranty_id=warranty_id,
                financial_entity__isnull=False
            ).order_by('-id').first()
            
            # Obtener el financial_entity del historial encontrado (o None si no hay ninguno)
            financial_entity_from_history = (
                history_with_financial_entity.financial_entity 
                if history_with_financial_entity 
                else None
            )
            
            # Crear el nuevo historial de ejecución
            # Los campos no aplicables van en null, excepto financial_entity que se hereda
            new_history = WarrantyHistory.objects.create(
                warranty=warranty,
                warranty_status=execution_status,
                letter_number=None,  # No aplica para ejecución
                financial_entity=financial_entity_from_history,  # Se hereda del historial anterior
                financial_entity_address=None,  # No aplica para ejecución
                issue_date=issue_date,
                validity_start=None,  # No aplica para ejecución
                validity_end=None,  # No aplica para ejecución
                currency_type=None,  # No aplica para ejecución
                amount=None,  # No aplica para ejecución
                reference_document=request.data.get('reference_document', ''),
                comments=request.data.get('comments', ''),
                created_by=request.user
            )
            
            # Manejar archivos adjuntos
            files = request.FILES.getlist('files')
            for file in files:
                WarrantyFile.objects.create(
                    warranty_history=new_history,
                    file=file,
                    file_name=file.name,
                    created_by=request.user
                )
            
            # Recargar con todas las relaciones
            new_history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=new_history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(new_history)
            
            return Response(serializer.data, status=201)
            
        except Exception as e:
            return Response(
                {'error': f'Error al ejecutar la carta: {str(e)}'},
                status=400
            )
    
    @action(detail=True, methods=['post'], url_path='modificar-emision')
    def modificar_emision(self, request, pk=None):
        """
        Modifica una emisión de carta fianza (warranty_status_id = 1).
        
        POST /api/warranty-histories/{id}/modificar-emision/
        
        Permite modificar:
        - Datos de la Garantía (Warranty): letter_type, contractor
        - Datos del Historial (WarrantyHistory): letter_number, financial_entity,
          financial_entity_address, issue_date, validity_start, validity_end,
          currency_type, amount, reference_document, comments
        - Archivos (WarrantyFile): agregar nuevos y/o eliminar existentes
        
        Campos opcionales (solo se actualizan si se envían):
        - letter_type: ID del tipo de carta
        - contractor: ID del contratista
        - letter_number: Número de carta
        - financial_entity: ID de la entidad financiera
        - financial_entity_address: Dirección de la entidad
        - issue_date: Fecha de emisión (YYYY-MM-DD)
        - validity_start: Inicio de vigencia (YYYY-MM-DD)
        - validity_end: Fin de vigencia (YYYY-MM-DD)
        - currency_type: ID del tipo de moneda
        - amount: Monto
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF a agregar
        - files_to_delete: Lista de IDs de archivos a eliminar (JSON array)
        
        Validaciones:
        1. El historial debe existir
        2. El historial debe ser de tipo Emisión (warranty_status_id = 1)
        3. El historial debe ser el último de la garantía
        4. Las fechas deben ser válidas
        5. El monto debe ser mayor a 0
        """
        from datetime import datetime
        from django.db import transaction
        import json
        import os
        from django.core.files.base import ContentFile
        
        try:
            # Obtener el historial
            try:
                history = WarrantyHistory.objects.select_related(
                    'warranty',
                    'warranty_status'
                ).get(id=pk)
            except WarrantyHistory.DoesNotExist:
                return Response(
                    {'error': f'No se encontró el historial con ID {pk}'},
                    status=404
                )
            
            # Validar que es una Emisión (warranty_status_id = 1)
            if history.warranty_status_id != 1:
                return Response(
                    {
                        'error': 'Solo se puede modificar un historial de tipo Emisión',
                        'current_status': history.warranty_status.description,
                        'current_status_id': history.warranty_status_id
                    },
                    status=400
                )
            
            # Verificar que es el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=history.warranty_id
            ).aggregate(max_id=Max('id'))
            
            if history.id != latest_history['max_id']:
                return Response(
                    {
                        'error': 'Solo se puede modificar el último historial de la garantía',
                        'history_id': history.id,
                        'latest_history_id': latest_history['max_id']
                    },
                    status=400
                )
            
            # Obtener la garantía
            warranty = history.warranty
            
            # Validar fechas si se proporcionan
            issue_date = None
            validity_start = None
            validity_end = None
            
            if request.data.get('issue_date'):
                try:
                    issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para issue_date. Use YYYY-MM-DD'},
                        status=400
                    )
            
            if request.data.get('validity_start'):
                try:
                    validity_start = datetime.strptime(request.data.get('validity_start'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para validity_start. Use YYYY-MM-DD'},
                        status=400
                    )
            
            if request.data.get('validity_end'):
                try:
                    validity_end = datetime.strptime(request.data.get('validity_end'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para validity_end. Use YYYY-MM-DD'},
                        status=400
                    )
            
            # Validar coherencia de fechas
            final_issue_date = issue_date if issue_date else history.issue_date
            final_validity_start = validity_start if validity_start else history.validity_start
            final_validity_end = validity_end if validity_end else history.validity_end
            
            if final_validity_start and final_validity_end:
                if final_validity_start > final_validity_end:
                    return Response(
                        {'error': 'La fecha de fin de vigencia debe ser posterior al inicio'},
                        status=400
                    )
            
            if final_issue_date and final_validity_start:
                if final_issue_date > final_validity_start:
                    return Response(
                        {'error': 'La fecha de inicio debe ser posterior o igual a la fecha de emisión'},
                        status=400
                    )
            
            # Validar monto si se proporciona
            amount = None
            if request.data.get('amount'):
                try:
                    amount = float(request.data.get('amount'))
                    if amount <= 0:
                        return Response(
                            {'error': 'El monto debe ser mayor a 0'},
                            status=400
                        )
                except ValueError:
                    return Response(
                        {'error': 'El monto debe ser un número válido'},
                        status=400
                    )
            
            # Validar entidades FK si se proporcionan
            letter_type = None
            contractor = None
            financial_entity = None
            currency_type = None
            
            if request.data.get('letter_type'):
                try:
                    letter_type = LetterType.objects.get(id=request.data.get('letter_type'))
                except LetterType.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró el tipo de carta con ID {request.data.get("letter_type")}'},
                        status=400
                    )
            
            if request.data.get('contractor'):
                try:
                    contractor = Contractor.objects.get(id=request.data.get('contractor'))
                except Contractor.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró el contratista con ID {request.data.get("contractor")}'},
                        status=400
                    )
            
            if request.data.get('financial_entity'):
                try:
                    financial_entity = FinancialEntity.objects.get(id=request.data.get('financial_entity'))
                except FinancialEntity.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró la entidad financiera con ID {request.data.get("financial_entity")}'},
                        status=400
                    )
            
            if request.data.get('currency_type'):
                try:
                    currency_type = CurrencyType.objects.get(id=request.data.get('currency_type'))
                except CurrencyType.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró el tipo de moneda con ID {request.data.get("currency_type")}'},
                        status=400
                    )
            
            # Validar archivos PDF si se proporcionan
            files = request.FILES.getlist('files')
            for file in files:
                ext = os.path.splitext(file.name)[1].lower()
                if ext != '.pdf':
                    return Response(
                        {'error': 'Solo se permiten archivos PDF'},
                        status=400
                    )
                if file.size > 10 * 1024 * 1024:
                    return Response(
                        {'error': 'Los archivos no deben superar los 10MB'},
                        status=400
                    )
            
            # Obtener IDs de archivos a eliminar
            files_to_delete = []
            files_to_delete_raw = request.data.get('files_to_delete', '[]')
            if files_to_delete_raw:
                try:
                    if isinstance(files_to_delete_raw, str):
                        files_to_delete = json.loads(files_to_delete_raw)
                    elif isinstance(files_to_delete_raw, list):
                        files_to_delete = files_to_delete_raw
                except json.JSONDecodeError:
                    return Response(
                        {'error': 'Formato inválido para files_to_delete. Debe ser un JSON array'},
                        status=400
                    )
            
            # Validar que los archivos a eliminar pertenecen a este historial
            if files_to_delete:
                existing_file_ids = list(WarrantyFile.objects.filter(
                    warranty_history=history
                ).values_list('id', flat=True))
                
                invalid_ids = [fid for fid in files_to_delete if fid not in existing_file_ids]
                if invalid_ids:
                    return Response(
                        {
                            'error': f'Los siguientes IDs de archivos no pertenecen a este historial: {invalid_ids}',
                            'valid_file_ids': existing_file_ids
                        },
                        status=400
                    )
            
            # === INICIO DE LA TRANSACCIÓN ===
            with transaction.atomic():
                # Actualizar la Garantía (Warranty) si hay cambios
                warranty_updated = False
                if letter_type:
                    warranty.letter_type = letter_type
                    warranty_updated = True
                if contractor:
                    warranty.contractor = contractor
                    warranty_updated = True
                
                if warranty_updated:
                    warranty.updated_by = request.user
                    warranty.save()
                
                # Actualizar el Historial (WarrantyHistory)
                if request.data.get('letter_number'):
                    history.letter_number = request.data.get('letter_number')
                if financial_entity:
                    history.financial_entity = financial_entity
                if request.data.get('financial_entity_address'):
                    history.financial_entity_address = request.data.get('financial_entity_address')
                if issue_date:
                    history.issue_date = issue_date
                if validity_start:
                    history.validity_start = validity_start
                if validity_end:
                    history.validity_end = validity_end
                if currency_type:
                    history.currency_type = currency_type
                if amount:
                    history.amount = amount
                if 'reference_document' in request.data:
                    history.reference_document = request.data.get('reference_document', '')
                if 'comments' in request.data:
                    history.comments = request.data.get('comments', '')
                
                history.updated_by = request.user
                history.save()
                
                # Eliminar archivos marcados para eliminación
                if files_to_delete:
                    WarrantyFile.objects.filter(
                        id__in=files_to_delete,
                        warranty_history=history
                    ).delete()
                
                # Agregar nuevos archivos
                for file in files:
                    original_filename = os.path.splitext(file.name)[0]
                    ext = os.path.splitext(file.name)[1].lower()
                    
                    # Crear el registro SIN el archivo para obtener el ID
                    warranty_file = WarrantyFile.objects.create(
                        warranty_history=history,
                        file_name=original_filename,
                        created_by=request.user
                    )
                    
                    # Crear el nuevo nombre usando el ID
                    new_filename = f'{warranty_file.id}{ext}'
                    
                    # Leer el contenido del archivo
                    file.seek(0)
                    file_content = file.read()
                    
                    # Guardar el archivo con el ID como nombre
                    warranty_file.file.save(new_filename, ContentFile(file_content), save=True)
            
            # === FIN DE LA TRANSACCIÓN ===
            
            # Recargar el historial con todas las relaciones
            history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(
                history,
                context={'request': request}
            )
            
            return Response({
                'message': 'Emisión modificada correctamente',
                'data': serializer.data
            }, status=200)
            
        except Exception as e:
            return Response(
                {'error': f'Error al modificar la emisión: {str(e)}'},
                status=400
            )
    
    @action(detail=True, methods=['post'], url_path='modificar-renovacion')
    def modificar_renovacion(self, request, pk=None):
        """
        Modifica una renovación de carta fianza (warranty_status_id = 2).
        
        POST /api/warranty-histories/{id}/modificar-renovacion/
        
        Permite modificar:
        - Datos del Historial (WarrantyHistory): letter_number, financial_entity,
          financial_entity_address, issue_date, validity_start, validity_end,
          currency_type, amount, reference_document, comments
        - Archivos (WarrantyFile): agregar nuevos y/o eliminar existentes
        
        Campos opcionales (solo se actualizan si se envían):
        - letter_number: Número de carta
        - financial_entity: ID de la entidad financiera
        - financial_entity_address: Dirección de la entidad
        - issue_date: Fecha de emisión (YYYY-MM-DD)
        - validity_start: Inicio de vigencia (YYYY-MM-DD)
        - validity_end: Fin de vigencia (YYYY-MM-DD)
        - currency_type: ID del tipo de moneda
        - amount: Monto
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF a agregar
        - files_to_delete: Lista de IDs de archivos a eliminar (JSON array)
        
        Validaciones:
        1. El historial debe existir
        2. El historial debe ser de tipo Renovación (warranty_status_id = 2)
        3. El historial debe ser el último de la garantía
        4. Las fechas deben ser válidas
        5. El monto debe ser mayor a 0
        """
        from datetime import datetime
        from django.db import transaction
        import json
        import os
        from django.core.files.base import ContentFile
        
        try:
            # Obtener el historial
            try:
                history = WarrantyHistory.objects.select_related(
                    'warranty',
                    'warranty_status'
                ).get(id=pk)
            except WarrantyHistory.DoesNotExist:
                return Response(
                    {'error': f'No se encontró el historial con ID {pk}'},
                    status=404
                )
            
            # Validar que es una Renovación (warranty_status_id = 2)
            if history.warranty_status_id != 2:
                return Response(
                    {
                        'error': 'Solo se puede modificar un historial de tipo Renovación',
                        'current_status': history.warranty_status.description,
                        'current_status_id': history.warranty_status_id
                    },
                    status=400
                )
            
            # Verificar que es el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=history.warranty_id
            ).aggregate(max_id=Max('id'))
            
            if history.id != latest_history['max_id']:
                return Response(
                    {
                        'error': 'Solo se puede modificar el último historial de la garantía',
                        'history_id': history.id,
                        'latest_history_id': latest_history['max_id']
                    },
                    status=400
                )
            
            # Validar fechas si se proporcionan
            issue_date = None
            validity_start = None
            validity_end = None
            
            if request.data.get('issue_date'):
                try:
                    issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para issue_date. Use YYYY-MM-DD'},
                        status=400
                    )
            
            if request.data.get('validity_start'):
                try:
                    validity_start = datetime.strptime(request.data.get('validity_start'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para validity_start. Use YYYY-MM-DD'},
                        status=400
                    )
            
            if request.data.get('validity_end'):
                try:
                    validity_end = datetime.strptime(request.data.get('validity_end'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para validity_end. Use YYYY-MM-DD'},
                        status=400
                    )
            
            # Validar coherencia de fechas
            final_issue_date = issue_date if issue_date else history.issue_date
            final_validity_start = validity_start if validity_start else history.validity_start
            final_validity_end = validity_end if validity_end else history.validity_end
            
            if final_validity_start and final_validity_end:
                if final_validity_start > final_validity_end:
                    return Response(
                        {'error': 'La fecha de fin de vigencia debe ser posterior al inicio'},
                        status=400
                    )
            
            if final_issue_date and final_validity_start:
                if final_issue_date > final_validity_start:
                    return Response(
                        {'error': 'La fecha de inicio debe ser posterior o igual a la fecha de emisión'},
                        status=400
                    )
            
            # Validar monto si se proporciona
            amount = None
            if request.data.get('amount'):
                try:
                    amount = float(request.data.get('amount'))
                    if amount <= 0:
                        return Response(
                            {'error': 'El monto debe ser mayor a 0'},
                            status=400
                        )
                except ValueError:
                    return Response(
                        {'error': 'El monto debe ser un número válido'},
                        status=400
                    )
            
            # Validar entidades FK si se proporcionan
            financial_entity = None
            currency_type = None
            
            if request.data.get('financial_entity'):
                try:
                    financial_entity = FinancialEntity.objects.get(id=request.data.get('financial_entity'))
                except FinancialEntity.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró la entidad financiera con ID {request.data.get("financial_entity")}'},
                        status=400
                    )
            
            if request.data.get('currency_type'):
                try:
                    currency_type = CurrencyType.objects.get(id=request.data.get('currency_type'))
                except CurrencyType.DoesNotExist:
                    return Response(
                        {'error': f'No se encontró el tipo de moneda con ID {request.data.get("currency_type")}'},
                        status=400
                    )
            
            # Validar archivos PDF si se proporcionan
            files = request.FILES.getlist('files')
            for file in files:
                ext = os.path.splitext(file.name)[1].lower()
                if ext != '.pdf':
                    return Response(
                        {'error': 'Solo se permiten archivos PDF'},
                        status=400
                    )
                if file.size > 10 * 1024 * 1024:
                    return Response(
                        {'error': 'Los archivos no deben superar los 10MB'},
                        status=400
                    )
            
            with transaction.atomic():
                # Actualizar el Historial (WarrantyHistory)
                if request.data.get('letter_number'):
                    history.letter_number = request.data.get('letter_number')
                if financial_entity:
                    history.financial_entity = financial_entity
                if request.data.get('financial_entity_address'):
                    history.financial_entity_address = request.data.get('financial_entity_address')
                if issue_date:
                    history.issue_date = issue_date
                if validity_start:
                    history.validity_start = validity_start
                if validity_end:
                    history.validity_end = validity_end
                if currency_type:
                    history.currency_type = currency_type
                if amount:
                    history.amount = amount
                if 'reference_document' in request.data:
                    history.reference_document = request.data.get('reference_document', '')
                if 'comments' in request.data:
                    history.comments = request.data.get('comments', '')
                
                history.updated_by = request.user
                history.save()
                
                # Eliminar archivos existentes si se solicita
                files_to_delete_ids = request.data.get('files_to_delete')
                if files_to_delete_ids:
                    try:
                        if isinstance(files_to_delete_ids, str):
                            files_to_delete_ids = json.loads(files_to_delete_ids)
                        if not isinstance(files_to_delete_ids, list):
                            raise ValueError("files_to_delete debe ser un array JSON")
                        
                        files_to_delete = WarrantyFile.objects.filter(
                            id__in=files_to_delete_ids,
                            warranty_history=history
                        )
                        
                        for file_obj in files_to_delete:
                            file_obj.file.delete(save=False)
                            file_obj.delete()
                            
                    except json.JSONDecodeError:
                        return Response(
                            {'error': 'El campo files_to_delete debe ser un JSON array válido'},
                            status=400
                        )
                    except ValueError as e:
                        return Response(
                            {'error': str(e)},
                            status=400
                        )
                
                # Agregar nuevos archivos
                for file in request.FILES.getlist('files'):
                    original_filename = os.path.splitext(file.name)[0]
                    ext = os.path.splitext(file.name)[1].lower()
                    
                    warranty_file = WarrantyFile.objects.create(
                        warranty_history=history,
                        file_name=original_filename,
                        created_by=request.user
                    )
                    
                    new_filename = f'{warranty_file.id}{ext}'
                    file.seek(0)
                    file_content = file.read()
                    warranty_file.file.save(new_filename, ContentFile(file_content), save=True)
            
            # Recargar el historial con todas las relaciones
            history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(
                history,
                context={'request': request}
            )
            
            return Response({
                'message': 'Renovación modificada correctamente',
                'data': serializer.data
            }, status=200)
            
        except Exception as e:
            return Response(
                {'error': f'Error al modificar la renovación: {str(e)}'},
                status=400
            )
    
    @action(detail=True, methods=['post'], url_path='modificar-devolucion')
    def modificar_devolucion(self, request, pk=None):
        """
        Modifica una devolución de carta fianza (warranty_status_id = 3).
        
        POST /api/warranty-histories/{id}/modificar-devolucion/
        
        Permite modificar:
        - Datos del Historial (WarrantyHistory): issue_date, reference_document, comments
        - Archivos (WarrantyFile): agregar nuevos y/o eliminar existentes
        
        Campos opcionales (solo se actualizan si se envían):
        - issue_date: Fecha de devolución (YYYY-MM-DD)
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF a agregar
        - files_to_delete: Lista de IDs de archivos a eliminar (JSON array)
        
        Validaciones:
        1. El historial debe existir
        2. El historial debe ser de tipo Devolución (warranty_status_id = 3)
        3. El historial debe ser el último de la garantía
        4. La fecha debe ser válida
        """
        from datetime import datetime
        from django.db import transaction
        import json
        import os
        from django.core.files.base import ContentFile
        
        try:
            # Obtener el historial
            try:
                history = WarrantyHistory.objects.select_related(
                    'warranty',
                    'warranty_status'
                ).get(id=pk)
            except WarrantyHistory.DoesNotExist:
                return Response(
                    {'error': f'No se encontró el historial con ID {pk}'},
                    status=404
                )
            
            # Validar que es una Devolución (warranty_status_id = 3)
            if history.warranty_status_id != 3:
                return Response(
                    {
                        'error': 'Solo se puede modificar un historial de tipo Devolución',
                        'current_status': history.warranty_status.description,
                        'current_status_id': history.warranty_status_id
                    },
                    status=400
                )
            
            # Verificar que es el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=history.warranty_id
            ).aggregate(max_id=Max('id'))
            
            if history.id != latest_history['max_id']:
                return Response(
                    {
                        'error': 'Solo se puede modificar el último historial de la garantía',
                        'history_id': history.id,
                        'latest_history_id': latest_history['max_id']
                    },
                    status=400
                )
            
            # Validar fecha si se proporciona
            issue_date = None
            if request.data.get('issue_date'):
                try:
                    issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para issue_date. Use YYYY-MM-DD'},
                        status=400
                    )
            
            # Validar archivos PDF si se proporcionan
            files = request.FILES.getlist('files')
            for file in files:
                ext = os.path.splitext(file.name)[1].lower()
                if ext != '.pdf':
                    return Response(
                        {'error': 'Solo se permiten archivos PDF'},
                        status=400
                    )
                if file.size > 10 * 1024 * 1024:
                    return Response(
                        {'error': 'Los archivos no deben superar los 10MB'},
                        status=400
                    )
            
            with transaction.atomic():
                # Actualizar el Historial (WarrantyHistory)
                if issue_date:
                    history.issue_date = issue_date
                if 'reference_document' in request.data:
                    history.reference_document = request.data.get('reference_document', '')
                if 'comments' in request.data:
                    history.comments = request.data.get('comments', '')
                
                history.updated_by = request.user
                history.save()
                
                # Eliminar archivos existentes si se solicita
                files_to_delete_ids = request.data.get('files_to_delete')
                if files_to_delete_ids:
                    try:
                        if isinstance(files_to_delete_ids, str):
                            files_to_delete_ids = json.loads(files_to_delete_ids)
                        if not isinstance(files_to_delete_ids, list):
                            raise ValueError("files_to_delete debe ser un array JSON")
                        
                        files_to_delete = WarrantyFile.objects.filter(
                            id__in=files_to_delete_ids,
                            warranty_history=history
                        )
                        
                        for file_obj in files_to_delete:
                            file_obj.file.delete(save=False)
                            file_obj.delete()
                            
                    except json.JSONDecodeError:
                        return Response(
                            {'error': 'El campo files_to_delete debe ser un JSON array válido'},
                            status=400
                        )
                    except ValueError as e:
                        return Response(
                            {'error': str(e)},
                            status=400
                        )
                
                # Agregar nuevos archivos
                for file in request.FILES.getlist('files'):
                    original_filename = os.path.splitext(file.name)[0]
                    ext = os.path.splitext(file.name)[1].lower()
                    
                    warranty_file = WarrantyFile.objects.create(
                        warranty_history=history,
                        file_name=original_filename,
                        created_by=request.user
                    )
                    
                    new_filename = f'{warranty_file.id}{ext}'
                    file.seek(0)
                    file_content = file.read()
                    warranty_file.file.save(new_filename, ContentFile(file_content), save=True)
            
            # Recargar el historial con todas las relaciones
            history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(
                history,
                context={'request': request}
            )
            
            return Response({
                'message': 'Devolución modificada correctamente',
                'data': serializer.data
            }, status=200)
            
        except Exception as e:
            return Response(
                {'error': f'Error al modificar la devolución: {str(e)}'},
                status=400
            )

    @action(detail=True, methods=['post'], url_path='modificar-ejecucion')
    def modificar_ejecucion(self, request, pk=None):
        """
        Modifica una ejecución de carta fianza (warranty_status_id = 6).
        
        POST /api/warranty-histories/{id}/modificar-ejecucion/
        
        Permite modificar:
        - Datos del Historial (WarrantyHistory): issue_date, reference_document, comments
        - Archivos (WarrantyFile): agregar nuevos y/o eliminar existentes
        
        Campos opcionales (solo se actualizan si se envían):
        - issue_date: Fecha de ejecución (YYYY-MM-DD)
        - reference_document: Documento de referencia
        - comments: Observaciones
        - files: Archivos PDF a agregar
        - files_to_delete: Lista de IDs de archivos a eliminar (JSON array)
        
        Validaciones:
        1. El historial debe existir
        2. El historial debe ser de tipo Ejecución (warranty_status_id = 6)
        3. El historial debe ser el último de la garantía
        4. La fecha debe ser válida
        """
        from datetime import datetime
        from django.db import transaction
        import json
        import os
        from django.core.files.base import ContentFile
        
        try:
            # Obtener el historial
            try:
                history = WarrantyHistory.objects.select_related(
                    'warranty',
                    'warranty_status'
                ).get(id=pk)
            except WarrantyHistory.DoesNotExist:
                return Response(
                    {'error': f'No se encontró el historial con ID {pk}'},
                    status=404
                )
            
            # Validar que es una Ejecución (warranty_status_id = 6)
            if history.warranty_status_id != 6:
                return Response(
                    {
                        'error': 'Solo se puede modificar un historial de tipo Ejecución',
                        'current_status': history.warranty_status.description,
                        'current_status_id': history.warranty_status_id
                    },
                    status=400
                )
            
            # Verificar que es el último historial de la garantía
            latest_history = WarrantyHistory.objects.filter(
                warranty_id=history.warranty_id
            ).aggregate(max_id=Max('id'))
            
            if history.id != latest_history['max_id']:
                return Response(
                    {
                        'error': 'Solo se puede modificar el último historial de la garantía',
                        'history_id': history.id,
                        'latest_history_id': latest_history['max_id']
                    },
                    status=400
                )
            
            # Validar fecha si se proporciona
            issue_date = None
            if request.data.get('issue_date'):
                try:
                    issue_date = datetime.strptime(request.data.get('issue_date'), '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha inválido para issue_date. Use YYYY-MM-DD'},
                        status=400
                    )
            
            # Validar archivos PDF si se proporcionan
            files = request.FILES.getlist('files')
            for file in files:
                ext = os.path.splitext(file.name)[1].lower()
                if ext != '.pdf':
                    return Response(
                        {'error': 'Solo se permiten archivos PDF'},
                        status=400
                    )
                if file.size > 10 * 1024 * 1024:
                    return Response(
                        {'error': 'Los archivos no deben superar los 10MB'},
                        status=400
                    )
            
            with transaction.atomic():
                # Actualizar el Historial (WarrantyHistory)
                if issue_date:
                    history.issue_date = issue_date
                if 'reference_document' in request.data:
                    history.reference_document = request.data.get('reference_document', '')
                if 'comments' in request.data:
                    history.comments = request.data.get('comments', '')
                
                history.updated_by = request.user
                history.save()
                
                # Eliminar archivos existentes si se solicita
                files_to_delete_ids = request.data.get('files_to_delete')
                if files_to_delete_ids:
                    try:
                        if isinstance(files_to_delete_ids, str):
                            files_to_delete_ids = json.loads(files_to_delete_ids)
                        if not isinstance(files_to_delete_ids, list):
                            raise ValueError("files_to_delete debe ser un array JSON")
                        
                        files_to_delete = WarrantyFile.objects.filter(
                            id__in=files_to_delete_ids,
                            warranty_history=history
                        )
                        
                        for file_obj in files_to_delete:
                            file_obj.file.delete(save=False)
                            file_obj.delete()
                            
                    except json.JSONDecodeError:
                        return Response(
                            {'error': 'El campo files_to_delete debe ser un JSON array válido'},
                            status=400
                        )
                    except ValueError as e:
                        return Response(
                            {'error': str(e)},
                            status=400
                        )
                
                # Agregar nuevos archivos
                for file in request.FILES.getlist('files'):
                    original_filename = os.path.splitext(file.name)[0]
                    ext = os.path.splitext(file.name)[1].lower()
                    
                    warranty_file = WarrantyFile.objects.create(
                        warranty_history=history,
                        file_name=original_filename,
                        created_by=request.user
                    )
                    
                    new_filename = f'{warranty_file.id}{ext}'
                    file.seek(0)
                    file_content = file.read()
                    warranty_file.file.save(new_filename, ContentFile(file_content), save=True)
            
            # Recargar el historial con todas las relaciones
            history = WarrantyHistory.objects.select_related(
                'warranty',
                'warranty__warranty_object',
                'warranty__letter_type',
                'warranty__contractor',
                'financial_entity',
                'currency_type',
                'warranty_status',
                'created_by',
                'updated_by'
            ).prefetch_related('files').get(id=history.id)
            
            # Serializar la respuesta
            serializer = WarrantyHistoryDetailSerializer(
                history,
                context={'request': request}
            )
            
            return Response({
                'message': 'Ejecución modificada correctamente',
                'data': serializer.data
            }, status=200)
            
        except Exception as e:
            return Response(
                {'error': f'Error al modificar la ejecución: {str(e)}'},
                status=400
            )