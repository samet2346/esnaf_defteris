from rest_framework.routers import DefaultRouter
from .views import IsKaydiViewSet

router = DefaultRouter()
router.register(r'', IsKaydiViewSet, basename='iskaydi')

urlpatterns = router.urls