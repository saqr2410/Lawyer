from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)

# =========================
# HEALTH CHECK
# =========================
def ping(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [

    # =========================
    # ADMIN
    # =========================
    path("admin/", admin.site.urls),

    # =========================
    # API APPS
    # =========================
    path("api/accounts/", include("accounts.urls")),
    path("api/clients/", include("clients.urls")),
    path("api/cases/", include("cases.urls")),
    path("api/hearings/", include("hearings.urls")),
    path("api/documents/", include("documents.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/settings/", include("settings.urls")),
    path("api/dashboard/", include("dashboard.urls")),

    # =========================
    # HEALTH CHECK (ELECTRON)
    # =========================
    path("api/ping/", ping),
    path("api/health/", ping),

    # =========================
    # API SCHEMA (DRF SPECTACULAR FIXED)
    # =========================
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]