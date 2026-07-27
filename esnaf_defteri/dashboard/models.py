from django.db import models
from accounts.models import CustomUser  # Kullanıcıyı accounts'tan çekiyoruz

class Musteri(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ad_soyad = models.CharField(max_length=100)
    telefon = models.CharField(max_length=20)
    
    def __str__(self):
        return self.ad_soyad

    @property
    def kalan_borc(self):
        # Örnek: IsKaydi üzerinden borç hesabı
        return self.is_kayitlari.aggregate(models.Sum('borc'))['borc__sum'] or 0

class IsKaydi(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    musteri = models.ForeignKey(Musteri, on_delete=models.CASCADE, related_name='is_kayitlari')
    talep_no = models.CharField(max_length=50)
    yapilan_is = models.CharField(max_length=255)
    tarih = models.DateTimeField(auto_now_add=True)
    durum = models.CharField(max_length=20, choices=[
        ('bekliyor', 'Bekliyor'),
        ('devam_ediyor', 'Devam Ediyor'),
        ('tamampylandi', 'Tamamlandı')
    ])
    odenen_tutar = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    borc = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.talep_no} - {self.musteri.ad_soyad}"