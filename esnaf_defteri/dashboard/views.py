from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from customers.models import Musteri
from jobs.models import IsKaydi
from customers.serializers import MusteriSerializer
from jobs.serializers import IsKaydiSerializer

class DashboardOzetView(APIView):
    def get(self, request):
        user = request.user
        musteriler = Musteri.objects.filter(user=user)
        isler = IsKaydi.objects.filter(user=user)
        
        toplam_alacak = sum(m.kalan_borc for m in musteriler)
        bu_ay = timezone.now().month
        bu_ay_is = isler.filter(tarih__month=bu_ay)
        bugunku_isler = isler.filter(tarih__date=timezone.now().date())
        
        return Response({
            "toplam_musteri": musteriler.count(),
            "toplam_is": isler.count(),
            "toplam_alacak": float(toplam_alacak),
            "bu_ay_is_sayisi": bu_ay_is.count(),
            "bugunku_isler": IsKaydiSerializer(bugunku_isler, many=True).data,
            "borclu_musteri_sayisi": len([m for m in musteriler if m.kalan_borc > 0])
        })

class BorclularView(APIView):
    def get(self, request):
        borclular = [m for m in Musteri.objects.filter(user=request.user) if m.kalan_borc > 0]
        borclular.sort(key=lambda x: x.kalan_borc, reverse=True)
        data = [{
            "id": m.id,
            "ad_soyad": m.ad_soyad, 
            "telefon": m.telefon, 
            "kalan_borc": float(m.kalan_borc), 
            "son_islem_tarihi": m.son_islem_tarihi
        } for m in borclular]
        return Response(data)

class AramaView(APIView):
    def get(self, request):
        q = request.query_params.get('q', '')
        if not q: return Response([])
        
        # Hem müşteri, hem talep no, hem de "yapılan iş" (Tesisat vb.) içinde arama yap
        musteriler = Musteri.objects.filter(user=request.user).filter(
            Q(ad_soyad__icontains=q) | 
            Q(telefon__icontains=q) | 
            Q(is_kayitlari__talep_no__icontains=q) |
            Q(is_kayitlari__yapilan_is__icontains=q)  # BU SATIR EKLENDİ
        ).distinct()
        
        data = []
        for m in musteriler:
            isler = IsKaydi.objects.filter(musteri=m).order_by('-tarih')
            data.append({
                "id": m.id,
                "ad_soyad": m.ad_soyad,
                "telefon": m.telefon,
                "kalan_borc": float(m.kalan_borc),
                "is_gecmisi": IsKaydiSerializer(isler, many=True).data
            })
        return Response(data)
class GecmisView(APIView):
    def get(self, request):
        qs = IsKaydi.objects.filter(user=request.user)
        
        # Tüm filtreler eksiksiz eklendi
        durum = request.query_params.get('durum')
        musteri_id = request.query_params.get('musteri_id')
        tarih_baslangic = request.query_params.get('tarih_baslangic')
        tarih_bitis = request.query_params.get('tarih_bitis')

        if durum: 
            qs = qs.filter(durum=durum)
        if musteri_id: 
            qs = qs.filter(musteri_id=musteri_id)
        if tarih_baslangic: 
            qs = qs.filter(tarih__gte=tarih_baslangic)
        if tarih_bitis: 
            qs = qs.filter(tarih__lte=tarih_bitis)
        
        return Response(IsKaydiSerializer(qs.order_by('-tarih'), many=True).data)

class RaporOzetView(APIView):
    def get(self, request):
        user = request.user
        isler = IsKaydi.objects.filter(user=user)
        musteriler = Musteri.objects.filter(user=user)
        
        toplam_gelir = isler.aggregate(Sum('odenen_tutar'))['odenen_tutar__sum'] or 0
        toplam_alacak = sum(m.kalan_borc for m in musteriler)
        bu_ay = timezone.now().month
        
        return Response({
            "toplam_gelir": float(toplam_gelir),
            "toplam_alacak": float(toplam_alacak),
            "bu_ay_is_sayisi": isler.filter(tarih__month=bu_ay).count(),
            "tamamlanan_is_sayisi": isler.filter(durum='tamamlandi').count(),
            "bekleyen_is_sayisi": isler.filter(durum='bekliyor').count(),
            "devam_eden_is_sayisi": isler.filter(durum='devam_ediyor').count(),
        })