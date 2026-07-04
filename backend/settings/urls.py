from rest_framework.routers import DefaultRouter

from .views import SettingsViewSet


router = DefaultRouter()

router.register(
    "",
    SettingsViewSet,
    basename="settings"
)


urlpatterns = router.urls