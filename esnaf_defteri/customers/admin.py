from django.contrib import admin
from .models import Musteri


@admin.register(Musteri)
class MusteriAdmin(admin.ModelAdmin):
    list_display = ('ad_soyad', 'telefon', 'toplam_harcama_goster', 'kalan_borc_goster', 'son_islem_tarihi', 'created_at')
    search_fields = ('ad_soyad', 'telefon')

    def toplam_harcama_goster(self, obj):
        return f"{obj.toplam_harcama} TL"
    toplam_harcama_goster.short_description = "Toplam Harcama"

    def kalan_borc_goster(self, obj):
        return f"{obj.kalan_borc} TL"
    kalan_borc_goster.short_description = "Kalan Borç"