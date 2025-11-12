from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate


class LoginView(APIView):
    """
    Vista para autenticación y obtención de token
    
    POST /api/auth/login/
    Body: {"username": "usuario", "password": "contraseña"}
    
    Retorna: {"token": "abc123...", "user_id": 1, "username": "usuario"}
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Se requieren username y password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Obtener o crear el token del usuario
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    """
    Vista para cerrar sesión y eliminar token
    
    POST /api/auth/logout/
    Headers: Authorization: Token abc123...
    
    Retorna: {"message": "Sesión cerrada exitosamente"}
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Eliminar el token del usuario
        try:
            request.user.auth_token.delete()
            return Response(
                {'message': 'Sesión cerrada exitosamente'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserInfoView(APIView):
    """
    Vista para obtener información del usuario actual
    
    GET /api/auth/me/
    Headers: Authorization: Token abc123...
    
    Retorna información del usuario autenticado
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        }, status=status.HTTP_200_OK)

