from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import HearingViewSet


router = DefaultRouter()

router.register(
    "",
    HearingViewSet,
    basename="hearings"
)

urlpatterns = [
    path("", include(router.urls)),
]