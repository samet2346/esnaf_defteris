from django.db import models
from django.conf import settings
from django.utils import timezone

class OdemeKaydi(models.Model):
    DURUM_CHOICES = [
        ('talep_edildi', 'Talep Edildi'),
        ('beklemede', 'Beklemede'),
        ('basarili', 'Başarılı'),
        ('basarisiz', 'Başarısız'),
        ('iade', 'İade'),
    ]

    # related_name eklendi, böylece CustomUser ile diğer OdemeKaydi modelleri çakışmaz
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='billing_odemeler'
    )
    
    tutar = models.DecimalField(max_digits=10, decimal_places=2)
    odeme_yontemi = models.CharField(max_length=20, default='whatsapp_iban')
    durum = models.CharField(max_length=20, choices=DURUM_CHOICES, default='talep_edildi')
    
    dekont_no = models.CharField(max_length=100, null=True, blank=True)
    dekont_fotografi = models.ImageField(upload_to='dekontlar/', null=True, blank=True)
    
    onaylayan_admin = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='onaylanan_odemeler', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    onay_tarihi = models.DateTimeField(null=True, blank=True)
    islem_tarihi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.tutar} - {self.durum}"# --- 6. ABONELIK MODEL ---

class Abonelik(models.Model):
    PLAN_CHOICES = [
        ('aylik', 'Aylık'),
        ('yillik', 'Yıllık'),
    ]
    DURUM_CHOICES = [
        ('deneme', 'Deneme'),
        ('aktif', 'Aktif'),
        ('pasif', 'Pasif'),
        ('suresi_doldu', 'Süresi Doldu'),
        ('iptal', 'İptal'),
    ]
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='abonelik')
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, blank=True, null=True)
    durum = models.CharField(max_length=20, choices=DURUM_CHOICES, default='deneme')
    
    deneme_baslangic = models.DateTimeField(blank=True, null=True)
    deneme_bitis = models.DateTimeField(blank=True, null=True)
    mevcut_donem_baslangic = models.DateTimeField(blank=True, null=True)
    mevcut_donem_bitis = models.DateTimeField(blank=True, null=True)
    sonraki_odeme_tarihi = models.DateField(blank=True, null=True)
    iptal_tarihi = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.telefon} - {self.durum}"

    @property
    def yazma_izni_var_mi(self):
        simdi = timezone.now()
        
        # 1. Durum 'deneme' ise süreye bak
        if self.durum == 'deneme' and self.deneme_bitis and self.deneme_bitis > simdi:
            return True
            
        # 2. Durum 'aktif' ise süreye bakmaksızın izin ver (Veya süresi varsa izin ver)
        if self.durum == 'aktif':
            return True
            
        return False
