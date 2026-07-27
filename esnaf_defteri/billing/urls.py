from django.urls import path
from .views import (
    OdemeTalepEtView, 
    DekontBildirView, 
    AbonelikDurumView, 
    AbonelikIptalView, 
    OdemeGecmisiView
)

urlpatterns = [
    path('odeme-talep-et/', OdemeTalepEtView.as_view(), name='odeme-talep-et'),
    path('dekont-bildir/', DekontBildirView.as_view(), name='dekont-bildir'),
    path('durum/', AbonelikDurumView.as_view(), name='abonelik-durum'),
    path('iptal/', AbonelikIptalView.as_view(), name='abonelik-iptal'),
    path('odeme-gecmisi/', OdemeGecmisiView.as_view(), name='odeme-gecmisi'),
]