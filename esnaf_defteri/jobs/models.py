from django.conf import settings
from django.db import models
from django.db.models import Sum, Max
from django.utils import timezone
from decimal import Decimal
from customers.models import Musteri

# --- 3. IS KAYDI MODEL ---

class IsKaydi(models.Model):
    DURUM_CHOICES = [
        ('bekliyor', 'Bekliyor'),
        ('devam_ediyor', 'Devam Ediyor'),
        ('tamamlandi', 'Tamamlandı'),
    ]
    ODEME_DURUMU_CHOICES = [
        ('odendi', 'Ödendi'),
        ('kismi_odendi', 'Kısmi Ödendi'),
        ('odenmedi', 'Ödenmedi'),
    ]

    talep_no = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='is_kayitlari')
    musteri = models.ForeignKey(Musteri, on_delete=models.CASCADE, related_name='is_kayitlari')
    tarih = models.DateTimeField(default=timezone.now) # DateTimeField oldu
    yapilan_is = models.TextField()
    ucret = models.DecimalField(max_digits=10, decimal_places=2)
    durum = models.CharField(max_length=20, choices=DURUM_CHOICES, default='bekliyor')
    odenen_tutar = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    odeme_durumu = models.CharField(max_length=20, choices=ODEME_DURUMU_CHOICES, default='odenmedi', editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.odenen_tutar >= self.ucret:
            self.odeme_durumu = 'odendi'
        elif self.odenen_tutar > 0:
            self.odeme_durumu = 'kismi_odendi'
        else:
            self.odeme_durumu = 'odenmedi'
        
        super().save(*args, **kwargs)
        if not self.talep_no.startswith("TLP-"):
            self.talep_no = f"TLP-{self.id:06d}"
            super().save(update_fields=['talep_no'])

# --- 4. IS FOTOGRAFI MODEL ---

class IsFotografi(models.Model):
    FOTO_TIPI_CHOICES = [
        ('oncesi', 'Öncesi'),
        ('sonrasi', 'Sonrası'),
        ('teslim', 'Teslim'),
        ('ariza', 'Arıza'),
        ('diger', 'Diğer'),
    ]
    is_kaydi = models.ForeignKey(IsKaydi, on_delete=models.CASCADE, related_name='fotograflar')
    fotograf = models.ImageField(upload_to='is_fotograflari/%Y/%m/%d/')
    foto_tipi = models.CharField(max_length=20, choices=FOTO_TIPI_CHOICES, default='diger')
    yuklenme_tarihi = models.DateTimeField(auto_now_add=True)


# --- 5. ODEME MODEL ---

class Odeme(models.Model):
    is_kaydi = models.ForeignKey(IsKaydi, on_delete=models.CASCADE, related_name='ademeler')
    tutar = models.DecimalField(max_digits=10, decimal_places=2)
    tarih = models.DateField(default=timezone.localdate)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.is_kaydi.talep_no} - {self.tutar} TL"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        toplam_odenen = Odeme.objects.filter(is_kaydi=self.is_kaydi).aggregate(total=Sum('tutar'))['total'] or Decimal('0.00')
        self.is_kaydi.odenen_tutar = toplam_odenen
        self.is_kaydi.save()


