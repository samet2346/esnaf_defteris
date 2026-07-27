from rest_framework import viewsets, filters, decorators, response
from .models import Musteri
from .serializers import MusteriSerializer
from jobs.serializers import IsKaydiSerializer

class MusteriViewSet(viewsets.ModelViewSet):
    serializer_class = MusteriSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['ad_soyad', 'telefon']

    def get_queryset(self):
        return Musteri.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=['get'])
    def ozet(self, request, pk=None):
        musteri = self.get_object()
        is_kayitlari = musteri.is_kayitlari.all()
        return response.Response({
            "musteri": MusteriSerializer(musteri).data,
            "gecmis": IsKaydiSerializer(is_kayitlari, many=True).data
        })