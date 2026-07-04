from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RegisterViewSet,
    ProfileViewSet,
    UsersViewSet,
    LoginView,
    RefreshView
)

# =========================
# ROUTER
# =========================
router = DefaultRouter()

router.register("register", RegisterViewSet, basename="register")
router.register("profile", ProfileViewSet, basename="profile")
router.register("users", UsersViewSet, basename="users")


# =========================
# URL PATTERNS
# =========================
urlpatterns = [

    # =====================
    # AUTH (JWT)
    # =====================
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="token_refresh"),

    # =====================
    # APP ROUTES
    # =====================
    path("", include(router.urls)),
]