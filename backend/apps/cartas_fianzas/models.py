from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal


class BaseModel(models.Model):
    """
    Modelo base abstracto que incluye campos de auditoría
    para registrar usuario y fecha de creación/modificación
    """
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name='Creado por'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creación'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        verbose_name='Actualizado por'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Fecha de actualización'
    )

    class Meta:
        abstract = True


class WarrantyObject(BaseModel):
    """
    Objeto de garantía (Bienes, Servicios, Obras, etc.)
    """
    description = models.CharField(
        max_length=512,
        verbose_name='Descripción',
        help_text='Ejemplo: MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL'
    )
    cui = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name='CUI',
        help_text='Código Único de Inversión (Opcional)'
    )

    class Meta:
        db_table = 'warranty_objects'
        verbose_name = 'Objeto de Garantía'
        verbose_name_plural = 'Objetos de Garantía'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.cui} - {self.description[:50]}"


class LetterType(BaseModel):
    """
    Tipo de carta fianza
    """
    description = models.CharField(
        max_length=50,
        verbose_name='Descripción',
        help_text='Ejemplo: Adelanto de materiales, adelanto directo'
    )

    class Meta:
        db_table = 'letter_types'
        verbose_name = 'Tipo de Carta'
        verbose_name_plural = 'Tipos de Carta'
        ordering = ['description']

    def __str__(self):
        return self.description


class FinancialEntity(BaseModel):
    """
    Entidad financiera emisora de cartas fianza
    """
    description = models.CharField(
        max_length=50,
        verbose_name='Descripción',
        help_text='Ejemplo: SCOTIABANK PERU, NACION'
    )

    class Meta:
        db_table = 'financial_entities'
        verbose_name = 'Entidad Financiera'
        verbose_name_plural = 'Entidades Financieras'
        ordering = ['description']

    def __str__(self):
        return self.description


class Contractor(BaseModel):
    """
    Contratista
    """
    business_name = models.CharField(
        max_length=255,
        verbose_name='Razón Social / Nombre'
    )
    ruc = models.CharField(
        max_length=11,
        unique=True,
        verbose_name='RUC',
        help_text='Registro Único de Contribuyentes'
    )

    class Meta:
        db_table = 'contractors'
        verbose_name = 'Contratista'
        verbose_name_plural = 'Contratistas'
        ordering = ['business_name']

    def __str__(self):
        return f"{self.business_name} - {self.ruc}"


class WarrantyStatus(BaseModel):
    """
    Estado de garantía (emisión, renovación, devolución)
    """
    description = models.CharField(
        max_length=50,
        verbose_name='Descripción',
        help_text='Ejemplo: Emisión, renovación, devolución'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo',
        help_text='Indica si el estado está activo para considerar en reportes de vencimiento'
    )

    class Meta:
        db_table = 'warranty_statuses'
        verbose_name = 'Estado de Garantía'
        verbose_name_plural = 'Estados de Garantía'
        ordering = ['description']

    def __str__(self):
        return self.description


class CurrencyType(BaseModel):
    """
    Tipo de moneda
    """
    description = models.CharField(
        max_length=50,
        verbose_name='Descripción',
        help_text='Ejemplo: Nuevos soles, dólares'
    )
    code = models.CharField(
        max_length=3,
        unique=True,
        verbose_name='Código',
        help_text='Ejemplo: PEN, USD'
    )
    symbol = models.CharField(
        max_length=5,
        verbose_name='Símbolo',
        help_text='Ejemplo: S/., $'
    )

    class Meta:
        db_table = 'currency_types'
        verbose_name = 'Tipo de Moneda'
        verbose_name_plural = 'Tipos de Moneda'
        ordering = ['description']

    def __str__(self):
        return f"{self.description} ({self.code})"


class Warranty(BaseModel):
    """
    Garantías (Carta Fianza)
    """
    warranty_object = models.ForeignKey(
        WarrantyObject,
        on_delete=models.PROTECT,
        related_name='warranties',
        verbose_name='Objeto de Garantía'
    )
    letter_type = models.ForeignKey(
        LetterType,
        on_delete=models.PROTECT,
        related_name='warranties',
        verbose_name='Tipo de Carta'
    )
    contractor = models.ForeignKey(
        Contractor,
        on_delete=models.PROTECT,
        related_name='warranties',
        verbose_name='Contratista'
    )

    class Meta:
        db_table = 'warranties'
        verbose_name = 'Garantía'
        verbose_name_plural = 'Garantías'
        ordering = ['-created_at']

    def __str__(self):
        return f"Garantía {self.id} - {self.warranty_object.cui} - {self.contractor.business_name}"


class WarrantyHistory(BaseModel):
    """
    Historial de garantías (movimientos de cada carta fianza)
    """
    warranty = models.ForeignKey(
        Warranty,
        on_delete=models.CASCADE,
        related_name='history',
        verbose_name='Garantía'
    )
    warranty_status = models.ForeignKey(
        WarrantyStatus,
        on_delete=models.PROTECT,
        related_name='warranty_histories',
        verbose_name='Estado de Garantía'
    )
    letter_number = models.CharField(
        max_length=50,
        verbose_name='Número de Carta',
        help_text='Ejemplo: 010079913-000'
    )
    financial_entity = models.ForeignKey(
        FinancialEntity,
        on_delete=models.PROTECT,
        related_name='warranty_histories',
        verbose_name='Entidad Financiera'
    )
    financial_entity_address = models.CharField(
        max_length=50,
        verbose_name='Dirección de Entidad Financiera'
    )
    issue_date = models.DateField(
        verbose_name='Fecha de Emisión'
    )
    validity_start = models.DateField(
        verbose_name='Inicio de Vigencia'
    )
    validity_end = models.DateField(
        verbose_name='Fin de Vigencia'
    )
    currency_type = models.ForeignKey(
        CurrencyType,
        on_delete=models.PROTECT,
        related_name='warranty_histories',
        verbose_name='Tipo de Moneda'
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name='Monto'
    )
    reference_document = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Documento de Referencia',
        help_text='Ejemplo: INFORME 3595-2008-DO-OI/MPP 30.09.08'
    )
    comments = models.TextField(
        max_length=1024,
        blank=True,
        verbose_name='Comentarios',
        help_text='Observaciones adicionales sobre el movimiento'
    )

    class Meta:
        db_table = 'warranty_histories'
        verbose_name = 'Historial de Garantía'
        verbose_name_plural = 'Historiales de Garantía'
        ordering = ['-issue_date', '-created_at']

    def __str__(self):
        return f"{self.letter_number} - {self.warranty_status.description}"


class WarrantyFile(BaseModel):
    """
    Archivos adjuntos al historial de garantías
    """
    warranty_history = models.ForeignKey(
        WarrantyHistory,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Historial de Garantía'
    )
    file_name = models.CharField(
        max_length=128,
        verbose_name='Nombre de Archivo'
    )
    file = models.FileField(
        upload_to='warranty_files/',
        verbose_name='Archivo',
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'warranty_files'
        verbose_name = 'Archivo de Garantía'
        verbose_name_plural = 'Archivos de Garantía'
        ordering = ['-created_at']

    def __str__(self):
        return self.file_name

