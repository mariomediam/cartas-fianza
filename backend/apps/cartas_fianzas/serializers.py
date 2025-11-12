from rest_framework import serializers
from django.db import transaction
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
    WarrantyFile
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
