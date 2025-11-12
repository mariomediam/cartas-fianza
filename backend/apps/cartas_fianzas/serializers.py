from rest_framework import serializers
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
