from django.contrib import admin
from django.urls import path, include
from django.conf import settings # Ekle
from django.conf.urls.static import static # Ekle

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/musteriler/', include('customers.urls')),
    path('api/is-kayitlari/', include('jobs.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/abonelik/', include('billing.urls')),
]

# BU KISMI EKLİYORUZ:
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns += [path('api/health/', health_check)]
