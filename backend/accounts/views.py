from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .serializers import RegisterSerializer, UserSerializer
from common.permissions import IsAdmin


# =========================
# LOGIN (JWT)
# =========================
class LoginView(TokenObtainPairView):
    """
    Returns:
    {
        "access": "...",
        "refresh": "..."
    }
    """
    permission_classes = [AllowAny]


# =========================
# REFRESH TOKEN
# =========================
class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]


# =========================
# REGISTER
# =========================
class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {
                "message": "User created successfully",
                "data": response.data
            },
            status=status.HTTP_201_CREATED
        )


# =========================
# PROFILE (CURRENT USER)
# =========================
class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# =========================
# USERS (ADMIN ONLY)
# =========================
class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return User.objects.all()


# =========================
# SAFE REGISTER (OPTIONAL)
# =========================
class SafeRegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]