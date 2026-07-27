from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import OdemeKaydi, Abonelik

PLAN_FIYATLARI = {
    'aylik': 109.00,
    'yillik': 999.00,
}


class OdemeTalepEtView(APIView):
    def post(self, request):
        plan = request.data.get('plan', 'aylik')
        if plan not in PLAN_FIYATLARI:
            return Response({"hata": "Geçersiz plan. 'aylik' veya 'yillik' olmalı."}, status=status.HTTP_400_BAD_REQUEST)

        abonelik = request.user.abonelik
        if abonelik.durum == 'deneme' and abonelik.deneme_bitis and abonelik.deneme_bitis > timezone.now():
            kalan_gun = (abonelik.deneme_bitis - timezone.now()).days
            return Response(
                {"hata": f"Deneme süreniz hâlâ devam ediyor, {kalan_gun} gün sonra abonelik satın alabilirsiniz."},
                status=status.HTTP_400_BAD_REQUEST
            )

        kayit = OdemeKaydi.objects.create(
            user=request.user,
            tutar=PLAN_FIYATLARI[plan],
            durum='talep_edildi',
            plan_tipi=plan,
        )
        return Response({
            "odeme_kaydi_id": kayit.id,
            "mesaj": f"Talebiniz alındı, ödeme bilgileri kısa süre içinde WhatsApp numaranıza ({request.user.telefon}) gönderilecek."
        })


class DekontBildirView(APIView):
    def post(self, request):
        kayit_id = request.data.get('odeme_kaydi_id')
        try:
            kayit = OdemeKaydi.objects.get(id=kayit_id, user=request.user)
            kayit.dekont_no = request.data.get('dekont_no')
            if 'dekont_fotografi' in request.FILES:
                kayit.dekont_fotografi = request.FILES.get('dekont_fotografi')
            kayit.save()
            return Response({"mesaj": "Dekontunuz admin onayı için iletildi."})
        except OdemeKaydi.DoesNotExist:
            return Response({"hata": "Ödeme kaydı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)


class AbonelikDurumView(APIView):
    def get(self, request):
        abonelik = request.user.abonelik
        bekleyen_var_mi = OdemeKaydi.objects.filter(
            user=request.user, durum__in=['talep_edildi', 'beklemede']
        ).exists()

        return Response({
            "plan": abonelik.plan,
            "durum": abonelik.durum,
            "deneme_bitis": abonelik.deneme_bitis,
            "mevcut_donem_bitis": abonelik.mevcut_donem_bitis,
            "sonraki_odeme_tarihi": abonelik.sonraki_odeme_tarihi,
            "bekleyen_odeme_var_mi": bekleyen_var_mi,
        })


class AbonelikIptalView(APIView):
    def post(self, request):
        abonelik = request.user.abonelik
        abonelik.durum = 'iptal'
        abonelik.iptal_tarihi = timezone.now()
        abonelik.save()
        return Response({"mesaj": "Aboneliğiniz iptal edildi, mevcut dönem sonuna kadar erişiminiz devam edecek."})


class OdemeGecmisiView(APIView):
    def get(self, request):
        kayitlar = OdemeKaydi.objects.filter(user=request.user).order_by('-islem_tarihi')
        veri = [
            {
                "id": k.id,
                "tutar": str(k.tutar),
                "durum": k.durum,
                "plan_tipi": k.plan_tipi,
                "islem_tarihi": k.islem_tarihi,
            }
            for k in kayitlar
        ]
        return Response({"gecmis": veri})
