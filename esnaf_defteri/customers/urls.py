from rest_framework.routers import DefaultRouter
from .views import MusteriViewSet

router = DefaultRouter()
router.register(r'', MusteriViewSet, basename='musteri')

urlpatterns = router.urls