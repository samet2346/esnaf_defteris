from rest_framework import viewsets, decorators, response, status, exceptions
from django_filters.rest_framework import DjangoFilterBackend
from .models import IsKaydi, IsFotografi, Odeme
from .serializers import IsKaydiSerializer, IsFotografiSerializer, OdemeSerializer
import os

class IsKaydiViewSet(viewsets.ModelViewSet):
    serializer_class = IsKaydiSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['durum', 'musteri']

    def get_queryset(self):
        qs = IsKaydi.objects.filter(user=self.request.user)
        start = self.request.query_params.get('tarih_baslangic')
        end = self.request.query_params.get('tarih_bitis')
        musteri_id = self.request.query_params.get('musteri_id')
        if start: qs = qs.filter(tarih__gte=start)
        if end: qs = qs.filter(tarih__lte=end)
        if musteri_id: qs = qs.filter(musteri_id=musteri_id)
        return qs

    def perform_create(self, serializer):
        if not self.request.user.abonelik.yazma_izni_var_mi:
            raise exceptions.PermissionDenied("Deneme süreniz doldu, abonelik satın alın.")
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=['post'])
    def fotograf_ekle(self, request, pk=None):
        is_kaydi = self.get_object()
        fotograflar = request.FILES.getlist('fotograflar')

        if not fotograflar:
            return response.Response({"hata": "Lütfen en az bir fotoğraf seçin."}, status=status.HTTP_400_BAD_REQUEST)

        izin_verilen_uzantilar = ['.jpg', '.jpeg', '.png', '.webp']
        max_boyut = 5 * 1024 * 1024  # 5 MB

        # 1. Aşama: Validasyon
        for f in fotograflar:
            ext = os.path.splitext(f.name)[1].lower()
            if ext not in izin_verilen_uzantilar:
                return response.Response(
                    {"hata": f"'{f.name}' geçersiz format. Sadece JPG, PNG ve WEBP kabul edilir."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if f.size > max_boyut:
                return response.Response(
                    {"hata": f"'{f.name}' çok büyük ({(f.size/1024/1024):.1f}MB). Maksimum 5MB yükleyebilirsiniz."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 2. Aşama: Kayıt
        yuklenen_veriler = []
        for f in fotograflar:
            foto_objesi = IsFotografi.objects.create(is_kaydi=is_kaydi, fotograf=f)
            serializer = IsFotografiSerializer(foto_objesi)
            yuklenen_veriler.append(serializer.data)

        return response.Response(yuklenen_veriler, status=status.HTTP_201_CREATED)

    @decorators.action(detail=True, methods=['post'])
    def odeme_ekle(self, request, pk=None):
        is_kaydi = self.get_object()
        serializer = OdemeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        odeme = serializer.save(is_kaydi=is_kaydi)
        is_kaydi.refresh_from_db()
        return response.Response(
            {
                "odeme": OdemeSerializer(odeme).data,
                "is_kaydi": IsKaydiSerializer(is_kaydi).data,
            },
            status=status.HTTP_201_CREATED,
        )