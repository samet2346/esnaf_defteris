from django.conf import settings
from django.db import models
from django.db.models import Sum, Max
from decimal import Decimal


class Musteri(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="musteriler")
    musteri_no = models.PositiveIntegerField(editable=False, default=0)
    ad_soyad = models.CharField(max_length=255)
    telefon = models.CharField(max_length=20)
    adres = models.TextField(blank=True, null=True)
    not_alani = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.musteri_no:
            son = Musteri.objects.filter(user=self.user).aggregate(Max("musteri_no"))["musteri_no__max"] or 0
            self.musteri_no = son + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.ad_soyad

    @property
    def toplam_harcama(self):
        toplam = self.is_kayitlari.aggregate(total=Sum("ucret"))["total"]
        return toplam if toplam else Decimal("0.00")

    @property
    def kalan_borc(self):
        toplam_ucret = self.toplam_harcama
        toplam_odenen = self.is_kayitlari.aggregate(total=Sum("odenen_tutar"))["total"] or Decimal("0.00")
        return toplam_ucret - toplam_odenen

    @property
    def son_islem_tarihi(self):
        son_tarih = self.is_kayitlari.aggregate(son=Max("tarih"))["son"]
        return son_tarih
