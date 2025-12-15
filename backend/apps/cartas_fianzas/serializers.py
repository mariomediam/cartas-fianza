from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User
from decimal import Decimal
import os
from .models import (
    WarrantyObject,
    LetterType,
    FinancialEntity,
    Contractor,
    WarrantyStatus,
    CurrencyType,
    Warranty,
    WarrantyHistory,
    WarrantyFile,
    UserProfile
)


class LetterTypeSerializer(serializers.ModelSerializer):
    """
    Serializer para Tipo de Carta
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = LetterType
        fields = [
            'id',
            'description',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class FinancialEntitySerializer(serializers.ModelSerializer):
    """
    Serializer para Entidad Financiera
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = FinancialEntity
        fields = [
            'id',
            'description',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class WarrantyObjectSerializer(serializers.ModelSerializer):
    """
    Serializer para Objeto de Garantía
    
    Nota: El campo 'cui' (Código Único de Inversión) es opcional
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = WarrantyObject
        fields = [
            'id',
            'description',
            'cui',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        extra_kwargs = {
            'cui': {'required': False, 'allow_blank': True, 'allow_null': True}
        }
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class WarrantyStatusSerializer(serializers.ModelSerializer):
    """
    Serializer para Estado de Garantía
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = WarrantyStatus
        fields = [
            'id',
            'description',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class CurrencyTypeSerializer(serializers.ModelSerializer):
    """
    Serializer para Tipo de Moneda
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = CurrencyType
        fields = [
            'id',
            'description',
            'code',
            'symbol',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        
    def validate_code(self, value):
        """Validar que el código esté en mayúsculas y tenga 3 caracteres"""
        if len(value) != 3:
            raise serializers.ValidationError("El código debe tener exactamente 3 caracteres")
        return value.upper()
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class ContractorSerializer(serializers.ModelSerializer):
    """
    Serializer para Contratista
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = Contractor
        fields = [
            'id',
            'business_name',
            'ruc',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']
        
    def validate_ruc(self, value):
        """Validar que el RUC tenga exactamente 11 dígitos"""
        if not value.isdigit():
            raise serializers.ValidationError("El RUC debe contener solo números")
        if len(value) != 11:
            raise serializers.ValidationError("El RUC debe tener exactamente 11 dígitos")
        return value
        
    def create(self, validated_data):
        """Asignar el usuario que crea el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Asignar el usuario que actualiza el registro"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        return super().update(instance, validated_data)


class WarrantyFileSerializer(serializers.ModelSerializer):
    """
    Serializer para Archivos de Garantía
    Solo se permiten archivos PDF
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = WarrantyFile
        fields = [
            'id',
            'file_name',
            'file',
            'file_url',
            'created_by',
            'created_by_name',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'created_by_name', 'file_url']
        extra_kwargs = {
            'file': {'required': False, 'allow_null': True}
        }
    
    def get_file_url(self, obj):
        """Obtener la URL completa del archivo"""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
    
    def validate_file(self, value):
        """Validar que el archivo sea PDF"""
        if value:
            # Validar extensión
            ext = os.path.splitext(value.name)[1].lower()
            if ext != '.pdf':
                raise serializers.ValidationError("Solo se permiten archivos PDF")
            
            # Validar tipo MIME
            if hasattr(value, 'content_type'):
                if value.content_type not in ['application/pdf']:
                    raise serializers.ValidationError("El archivo debe ser un PDF válido")
            
            # Validar tamaño (máximo 10MB)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("El archivo no debe superar los 10MB")
        
        return value


class WarrantyHistorySerializer(serializers.ModelSerializer):
    """
    Serializer para Historial de Garantía
    Incluye archivos opcionales
    """
    files = WarrantyFileSerializer(many=True, required=False)
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    # Campos adicionales para mostrar información relacionada
    warranty_status_description = serializers.CharField(
        source='warranty_status.description',
        read_only=True
    )
    financial_entity_description = serializers.CharField(
        source='financial_entity.description',
        read_only=True
    )
    currency_type_description = serializers.CharField(
        source='currency_type.description',
        read_only=True
    )
    currency_type_code = serializers.CharField(
        source='currency_type.code',
        read_only=True
    )
    currency_type_symbol = serializers.CharField(
        source='currency_type.symbol',
        read_only=True
    )
    
    class Meta:
        model = WarrantyHistory
        fields = [
            'id',
            'warranty_status',
            'warranty_status_description',
            'letter_number',
            'financial_entity',
            'financial_entity_description',
            'financial_entity_address',
            'issue_date',
            'validity_start',
            'validity_end',
            'currency_type',
            'currency_type_description',
            'currency_type_code',
            'currency_type_symbol',
            'amount',
            'reference_document',
            'comments',
            'files',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'warranty_status_description',
            'financial_entity_description',
            'currency_type_code',
            'currency_type_symbol',
            'created_at',
            'updated_at',
            'created_by_name',
            'updated_by_name'
        ]
    
    def validate_amount(self, value):
        """Validar que el monto sea positivo"""
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")
        return value
    
    def validate(self, data):
        """Validar fechas"""
        if 'validity_start' in data and 'validity_end' in data:
            if data['validity_start'] > data['validity_end']:
                raise serializers.ValidationError({
                    "validity_end": "La fecha de fin de vigencia debe ser posterior a la fecha de inicio"
                })
        
        if 'issue_date' in data and 'validity_start' in data:
            if data['issue_date'] > data['validity_start']:
                raise serializers.ValidationError({
                    "validity_start": "La fecha de inicio de vigencia debe ser posterior o igual a la fecha de emisión"
                })
        
        return data


class WarrantySerializer(serializers.ModelSerializer):
    """
    Serializer para Garantía (Carta Fianza)
    Al crear una garantía, se crea automáticamente el primer historial
    
    Los campos del historial se envían directamente (sin initial_history[...])
    Los archivos se envían como lista simple 'files'
    """
    # Campos del historial que se aceptan directamente
    warranty_status = serializers.IntegerField(write_only=True)
    letter_number = serializers.CharField(max_length=50, write_only=True)
    financial_entity = serializers.IntegerField(write_only=True)
    financial_entity_address = serializers.CharField(max_length=50, write_only=True)
    issue_date = serializers.DateField(write_only=True)
    validity_start = serializers.DateField(write_only=True)
    validity_end = serializers.DateField(write_only=True)
    currency_type = serializers.IntegerField(write_only=True)
    amount = serializers.DecimalField(max_digits=18, decimal_places=2, write_only=True)
    reference_document = serializers.CharField(max_length=50, required=False, allow_blank=True, write_only=True)
    comments = serializers.CharField(max_length=1024, required=False, allow_blank=True, write_only=True)
    
    # Archivos como lista simple
    files = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        allow_empty=True,
        write_only=True
    )
    
    # Campos de solo lectura para mostrar el historial completo
    history = WarrantyHistorySerializer(many=True, read_only=True)
    
    # Campos adicionales para mostrar información relacionada
    warranty_object_description = serializers.CharField(
        source='warranty_object.description',
        read_only=True
    )
    warranty_object_cui = serializers.CharField(
        source='warranty_object.cui',
        read_only=True
    )
    letter_type_description = serializers.CharField(
        source='letter_type.description',
        read_only=True
    )
    contractor_business_name = serializers.CharField(
        source='contractor.business_name',
        read_only=True
    )
    contractor_ruc = serializers.CharField(
        source='contractor.ruc',
        read_only=True
    )
    
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    
    class Meta:
        model = Warranty
        fields = [
            'id',
            'warranty_object',
            'warranty_object_description',
            'warranty_object_cui',
            'letter_type',
            'letter_type_description',
            'contractor',
            'contractor_business_name',
            'contractor_ruc',
            # Campos del historial (write_only)
            'warranty_status',
            'letter_number',
            'financial_entity',
            'financial_entity_address',
            'issue_date',
            'validity_start',
            'validity_end',
            'currency_type',
            'amount',
            'reference_document',
            'comments',
            'files',
            # Campo de lectura
            'history',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'warranty_object_description',
            'warranty_object_cui',
            'letter_type_description',
            'contractor_business_name',
            'contractor_ruc',
            'history',
            'created_at',
            'updated_at',
            'created_by_name',
            'updated_by_name'
        ]
    
    def validate(self, data):
        """Validar fechas del historial"""
        if 'validity_start' in data and 'validity_end' in data:
            if data['validity_start'] > data['validity_end']:
                raise serializers.ValidationError({
                    "validity_end": "La fecha de fin de vigencia debe ser posterior a la fecha de inicio"
                })
        
        if 'issue_date' in data and 'validity_start' in data:
            if data['issue_date'] > data['validity_start']:
                raise serializers.ValidationError({
                    "validity_start": "La fecha de inicio de vigencia debe ser posterior o igual a la fecha de emisión"
                })
        
        # Validar monto
        if 'amount' in data and data['amount'] <= 0:
            raise serializers.ValidationError({
                "amount": "El monto debe ser mayor a 0"
            })
        
        # Validar archivos PDF
        if 'files' in data:
            for uploaded_file in data['files']:
                ext = os.path.splitext(uploaded_file.name)[1].lower()
                if ext != '.pdf':
                    raise serializers.ValidationError({
                        "files": "Solo se permiten archivos PDF"
                    })
                if uploaded_file.size > 10 * 1024 * 1024:
                    raise serializers.ValidationError({
                        "files": "Los archivos no deben superar los 10MB"
                    })
        
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """
        Crear garantía con su primer historial y archivos opcionales
        Todo dentro de una transacción
        
        Los campos del historial vienen directamente en validated_data
        Los archivos vienen como lista simple en 'files'
        """
        import os
        from django.core.files.base import ContentFile
        
        # Extraer campos del historial (vienen directamente)
        history_fields = {
            'warranty_status_id': validated_data.pop('warranty_status'),
            'letter_number': validated_data.pop('letter_number'),
            'financial_entity_id': validated_data.pop('financial_entity'),
            'financial_entity_address': validated_data.pop('financial_entity_address'),
            'issue_date': validated_data.pop('issue_date'),
            'validity_start': validated_data.pop('validity_start'),
            'validity_end': validated_data.pop('validity_end'),
            'currency_type_id': validated_data.pop('currency_type'),
            'amount': validated_data.pop('amount'),
            'reference_document': validated_data.pop('reference_document', ''),
            'comments': validated_data.pop('comments', ''),
        }
        
        # Extraer archivos (lista simple)
        uploaded_files = validated_data.pop('files', [])
        
        # Obtener el usuario de la petición
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None
        
        # Crear la garantía
        if user:
            validated_data['created_by'] = user
        warranty = Warranty.objects.create(**validated_data)
        
        # Crear el historial inicial
        if user:
            history_fields['created_by'] = user
        history_fields['warranty'] = warranty
        history = WarrantyHistory.objects.create(**history_fields)
        
        # Crear los archivos opcionales
        for uploaded_file in uploaded_files:
            # Obtener nombre original del archivo (sin extensión)
            original_filename = os.path.splitext(uploaded_file.name)[0]
            ext = os.path.splitext(uploaded_file.name)[1].lower()
            
            # 1. Crear el registro SIN el archivo para obtener el ID
            warranty_file = WarrantyFile.objects.create(
                warranty_history=history,
                file_name=original_filename,
                created_by=user
            )
            
            # 2. Crear el nuevo nombre usando el ID
            new_filename = f'{warranty_file.id}{ext}'
            
            # 3. Leer el contenido del archivo
            uploaded_file.seek(0)  # Asegurar que estamos al inicio del archivo
            file_content = uploaded_file.read()
            
            # 4. Guardar el archivo con el ID como nombre
            warranty_file.file.save(new_filename, ContentFile(file_content), save=True)
        
        return warranty
    
    def update(self, instance, validated_data):
        """
        Actualizar solo los datos de la garantía
        El historial NO se puede actualizar por este endpoint
        """
        # Remover campos del historial si vienen en la actualización (no se deben usar)
        history_fields = [
            'warranty_status', 'letter_number', 'financial_entity', 
            'financial_entity_address', 'issue_date', 'validity_start', 
            'validity_end', 'currency_type', 'amount', 'reference_document', 
            'comments', 'files'
        ]
        for field in history_fields:
            validated_data.pop(field, None)
        
        # Asignar el usuario que actualiza
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['updated_by'] = request.user
        
        return super().update(instance, validated_data)


# ========== Serializers para Búsqueda Anidada ==========

class WarrantyHistoryNestedSerializer(serializers.ModelSerializer):
    """
    Serializer anidado para Historial de Garantías (solo lectura para búsquedas)
    """
    warranty_status_id = serializers.IntegerField(source='warranty_status.id', read_only=True)
    warranty_status_description = serializers.CharField(source='warranty_status.description', read_only=True)
    warranty_status_is_active = serializers.BooleanField(source='warranty_status.is_active', read_only=True)
    currency_type_id = serializers.IntegerField(source='currency_type.id', read_only=True)
    currency_type_description = serializers.CharField(source='currency_type.description', read_only=True)
    currency_type_symbol = serializers.CharField(source='currency_type.symbol', read_only=True)
    financial_entity_id = serializers.IntegerField(source='financial_entity.id', read_only=True)
    financial_entity_description = serializers.CharField(source='financial_entity.description', read_only=True)
    
    class Meta:
        model = WarrantyHistory
        fields = [
            'id',
            'warranty_status_id',
            'warranty_status_description',
            'warranty_status_is_active',
            'letter_number',
            'validity_start',
            'validity_end',
            'reference_document',
            'issue_date',
            'currency_type_id',
            'currency_type_description',
            'currency_type_symbol',
            'amount',
            'financial_entity_id',
            'financial_entity_description',
            'financial_entity_address',
            'comments'
        ]


class WarrantyNestedSerializer(serializers.ModelSerializer):
    """
    Serializer anidado para Garantías (solo lectura para búsquedas)
    """
    letter_type_id = serializers.IntegerField(source='letter_type.id', read_only=True)
    letter_type_description = serializers.CharField(source='letter_type.description', read_only=True)
    contractor_id = serializers.IntegerField(source='contractor.id', read_only=True)
    contractor_business_name = serializers.CharField(source='contractor.business_name', read_only=True)
    contractor_ruc = serializers.CharField(source='contractor.ruc', read_only=True)
    warranty_histories = WarrantyHistoryNestedSerializer(source='history', many=True, read_only=True)
    
    class Meta:
        model = Warranty
        fields = [
            'id',
            'letter_type_id',
            'letter_type_description',
            'contractor_id',
            'contractor_business_name',
            'contractor_ruc',
            'warranty_histories'
        ]


class WarrantyObjectSearchSerializer(serializers.ModelSerializer):
    """
    Serializer para búsqueda de Objetos de Garantía con información anidada completa
    """
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    updated_by_name = serializers.CharField(
        source='updated_by.username',
        read_only=True
    )
    warranties = WarrantyNestedSerializer(many=True, read_only=True)
    
    class Meta:
        model = WarrantyObject
        fields = [
            'id',
            'description',
            'cui',
            'created_by',
            'created_by_name',
            'created_at',
            'updated_by',
            'updated_by_name',
            'updated_at',
            'warranties'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name', 'updated_by_name']


# ========== Serializer para Detalle de Historial ==========

class WarrantyHistoryDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para el detalle de un historial de garantía
    Incluye toda la información relacionada de la garantía, tipo de carta,
    entidad financiera, contratista, moneda y archivos.
    
    Equivalente a la consulta SQL:
    SELECT * FROM warranty_histories
    INNER JOIN warranties ON warranty_histories.warranty_id = warranties.id
    LEFT JOIN letter_types ON warranties.letter_type_id = letter_types.id
    LEFT JOIN financial_entities ON warranty_histories.financial_entity_id = financial_entities.id
    LEFT JOIN contractors ON warranties.contractor_id = contractors.id
    LEFT JOIN currency_types ON warranty_histories.currency_type_id = currency_types.id
    LEFT JOIN warranty_files ON warranty_histories.id = warranty_files.warranty_history_id
    """
    # Archivos relacionados
    files = WarrantyFileSerializer(many=True, read_only=True)
    
    # Información del estado de la garantía
    warranty_status_id = serializers.IntegerField(source='warranty_status.id', read_only=True)
    warranty_status_description = serializers.CharField(source='warranty_status.description', read_only=True)
    warranty_status_is_active = serializers.BooleanField(source='warranty_status.is_active', read_only=True)
    
    # Información de la entidad financiera
    financial_entity_id = serializers.IntegerField(source='financial_entity.id', read_only=True)
    financial_entity_description = serializers.CharField(source='financial_entity.description', read_only=True)
    
    # Información del tipo de moneda
    currency_type_id = serializers.IntegerField(source='currency_type.id', read_only=True)
    currency_type_description = serializers.CharField(source='currency_type.description', read_only=True)
    currency_type_code = serializers.CharField(source='currency_type.code', read_only=True)
    currency_type_symbol = serializers.CharField(source='currency_type.symbol', read_only=True)
    
    # Información de la garantía (warranty)
    warranty_id = serializers.IntegerField(source='warranty.id', read_only=True)
    warranty_object_id = serializers.IntegerField(source='warranty.warranty_object.id', read_only=True)
    warranty_object_description = serializers.CharField(source='warranty.warranty_object.description', read_only=True)
    warranty_object_cui = serializers.CharField(source='warranty.warranty_object.cui', read_only=True)
    
    # Información del tipo de carta
    letter_type_id = serializers.IntegerField(source='warranty.letter_type.id', read_only=True)
    letter_type_description = serializers.CharField(source='warranty.letter_type.description', read_only=True)
    
    # Información del contratista
    contractor_id = serializers.IntegerField(source='warranty.contractor.id', read_only=True)
    contractor_business_name = serializers.CharField(source='warranty.contractor.business_name', read_only=True)
    contractor_ruc = serializers.CharField(source='warranty.contractor.ruc', read_only=True)
    
    # Información de auditoría
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    updated_by_id = serializers.IntegerField(source='updated_by.id', read_only=True, allow_null=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True, allow_null=True)
    
    class Meta:
        model = WarrantyHistory
        fields = [
            # Campos del historial
            'id',
            'letter_number',
            'financial_entity_address',
            'issue_date',
            'validity_start',
            'validity_end',
            'amount',
            'reference_document',
            'comments',
            
            # Estado de garantía
            'warranty_status_id',
            'warranty_status_description',
            'warranty_status_is_active',
            
            # Entidad financiera
            'financial_entity_id',
            'financial_entity_description',
            
            # Tipo de moneda
            'currency_type_id',
            'currency_type_description',
            'currency_type_code',
            'currency_type_symbol',
            
            # Información de la garantía
            'warranty_id',
            'warranty_object_id',
            'warranty_object_description',
            'warranty_object_cui',
            
            # Tipo de carta
            'letter_type_id',
            'letter_type_description',
            
            # Contratista
            'contractor_id',
            'contractor_business_name',
            'contractor_ruc',
            
            # Archivos
            'files',
            
            # Auditoría
            'created_by_id',
            'created_by_username',
            'created_at',
            'updated_by_id',
            'updated_by_username',
            'updated_at',
        ]
        read_only_fields = fields  # Todos son de solo lectura para el GET


# ========== Serializer para Búsqueda de Vigentes por Fecha ==========

class WarrantyHistoryVigentesPorFechaSerializer(serializers.ModelSerializer):
    """
    Serializer para la búsqueda de cartas fianza vigentes por fecha.
    
    Retorna la información de warranty_histories con los datos relacionados
    de warranties, currency_types, financial_entities, contractors, 
    letter_types y warranty_objects.
    
    Equivalente a la consulta SQL:
    SELECT warranty_histories.id, warranty_histories.letter_number, ...
    FROM warranty_histories
    LEFT JOIN warranties ON warranty_histories.warranty_id = warranties.id
    LEFT JOIN currency_types ON warranty_histories.currency_type_id = currency_types.id
    LEFT JOIN financial_entities ON warranty_histories.financial_entity_id = financial_entities.id
    LEFT JOIN contractors ON warranties.contractor_id = contractors.id
    LEFT JOIN letter_types ON warranties.letter_type_id = letter_types.id
    LEFT JOIN warranty_objects ON warranties.warranty_object_id = warranty_objects.id
    WHERE '2025-12-09' BETWEEN validity_start AND validity_end
    """
    # Campos de warranty_histories
    warranty_id = serializers.IntegerField(source='warranty.id', read_only=True)
    
    # Campos de currency_types
    currency_type_symbol = serializers.CharField(source='currency_type.symbol', read_only=True)
    
    # Campos de financial_entities
    financial_entity_description = serializers.CharField(
        source='financial_entity.description', 
        read_only=True
    )
    
    # Campos de contractors
    contractor_id = serializers.IntegerField(source='warranty.contractor.id', read_only=True)
    contractor_business_name = serializers.CharField(
        source='warranty.contractor.business_name', 
        read_only=True
    )
    contractor_ruc = serializers.CharField(source='warranty.contractor.ruc', read_only=True)
    
    # Campos de letter_types
    letter_type_id = serializers.IntegerField(source='warranty.letter_type.id', read_only=True)
    letter_type_description = serializers.CharField(
        source='warranty.letter_type.description', 
        read_only=True
    )
    
    # Campos de warranty_objects
    warranty_object_id = serializers.IntegerField(
        source='warranty.warranty_object.id', 
        read_only=True
    )
    warranty_object_description = serializers.CharField(
        source='warranty.warranty_object.description', 
        read_only=True
    )
    warranty_object_cui = serializers.CharField(
        source='warranty.warranty_object.cui', 
        read_only=True
    )
    
    class Meta:
        model = WarrantyHistory
        fields = [
            # Campos del historial
            'id',
            'letter_number',
            'issue_date',
            'validity_start',
            'validity_end',
            'amount',
            'currency_type_id',
            'financial_entity_id',
            'warranty_id',
            
            # Campos relacionados de warranty
            'contractor_id',
            'letter_type_id',
            'warranty_object_id',
            
            # Descripciones y datos adicionales
            'currency_type_symbol',
            'financial_entity_description',
            'contractor_business_name',
            'contractor_ruc',
            'letter_type_description',
            'warranty_object_description',
            'warranty_object_cui',
        ]
        read_only_fields = fields


# ==================== SERIALIZERS DE USUARIO ====================

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil de usuario
    """
    class Meta:
        model = UserProfile
        fields = ['can_manage_users']


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer para listar usuarios (sin password)
    """
    can_manage_users = serializers.BooleanField(
        source='profile.can_manage_users',
        read_only=True
    )
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'date_joined',
            'last_login',
            'can_manage_users'
        ]
        read_only_fields = fields


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear usuarios
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    can_manage_users = serializers.BooleanField(
        required=False,
        default=False
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'can_manage_users'
        ]
    
    def validate_username(self, value):
        """Validar que el username no sea django_admin"""
        if value.lower() == 'django_admin':
            raise serializers.ValidationError(
                'Este nombre de usuario está reservado para el sistema.'
            )
        return value
    
    def validate(self, data):
        """Validar que las contraseñas coincidan"""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden.'
            })
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        """Crear usuario con perfil"""
        can_manage_users = validated_data.pop('can_manage_users', False)
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        
        # Crear usuario con is_staff=False y is_superuser=False
        user = User.objects.create(
            **validated_data,
            is_staff=False,
            is_superuser=False
        )
        user.set_password(password)
        user.save()
        
        # Crear o actualizar perfil
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.can_manage_users = can_manage_users
        profile.save()
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar usuarios (sin password obligatorio)
    """
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        allow_blank=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        style={'input_type': 'password'}
    )
    can_manage_users = serializers.BooleanField(
        required=False
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
            'is_active',
            'can_manage_users'
        ]
    
    def validate_username(self, value):
        """Validar que el username no sea django_admin"""
        if value.lower() == 'django_admin':
            raise serializers.ValidationError(
                'Este nombre de usuario está reservado para el sistema.'
            )
        return value
    
    def validate(self, data):
        """Validar que las contraseñas coincidan si se proporcionan"""
        password = data.get('password', '')
        password_confirm = data.get('password_confirm', '')
        
        if password or password_confirm:
            if password != password_confirm:
                raise serializers.ValidationError({
                    'password_confirm': 'Las contraseñas no coinciden.'
                })
        return data
    
    @transaction.atomic
    def update(self, instance, validated_data):
        """Actualizar usuario y perfil"""
        can_manage_users = validated_data.pop('can_manage_users', None)
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password', None)
        
        # Actualizar campos del usuario
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Actualizar password si se proporciona
        if password:
            instance.set_password(password)
        
        # Asegurar que is_staff e is_superuser sean False
        instance.is_staff = False
        instance.is_superuser = False
        instance.save()
        
        # Actualizar perfil si se proporciona can_manage_users
        if can_manage_users is not None:
            profile, created = UserProfile.objects.get_or_create(user=instance)
            profile.can_manage_users = can_manage_users
            profile.save()
        
        return instance