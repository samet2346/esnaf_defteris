from django.urls import path
from .views import DashboardOzetView, BorclularView, AramaView, GecmisView, RaporOzetView

urlpatterns = [
    path('ozet/', DashboardOzetView.as_view()),
    path('borclular/', BorclularView.as_view()),
    path('ara/', AramaView.as_view()),
    path('gecmis/', GecmisView.as_view()),
    path('rapor/ozet/', RaporOzetView.as_view()),
]
