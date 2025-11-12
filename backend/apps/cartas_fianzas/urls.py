from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LetterTypeViewSet, 
    FinancialEntityViewSet, 
    ContractorViewSet, 
    WarrantyObjectViewSet,
    WarrantyStatusViewSet
)
from .auth_views import LoginView, LogoutView, UserInfoView

# Crear el router
router = DefaultRouter()

# Registrar los ViewSets
router.register(r'letter-types', LetterTypeViewSet, basename='letter-type')
router.register(r'financial-entities', FinancialEntityViewSet, basename='financial-entity')
router.register(r'contractors', ContractorViewSet, basename='contractor')
router.register(r'warranty-objects', WarrantyObjectViewSet, basename='warranty-object')
router.register(r'warranty-statuses', WarrantyStatusViewSet, basename='warranty-status')

# URLs de la app
urlpatterns = [
    # URLs del router (CRUD endpoints)
    path('', include(router.urls)),
    
    # URLs de autenticación
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', UserInfoView.as_view(), name='user-info'),
]

