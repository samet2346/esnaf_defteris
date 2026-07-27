from django.contrib import admin
from .models import IsKaydi, IsFotografi, Odeme


class IsFotografiInline(admin.TabularInline):
    model = IsFotografi
    extra = 1


class OdemeInline(admin.TabularInline):
    model = Odeme
    extra = 1


@admin.register(IsKaydi)
class IsKaydiAdmin(admin.ModelAdmin):
    list_display = ('talep_no', 'musteri', 'ucret', 'odenen_tutar', 'odeme_durumu', 'durum', 'tarih')
    list_filter = ('durum', 'odeme_durumu', 'tarih')
    search_fields = ('talep_no', 'musteri__ad_soyad', 'yapilan_is')
    readonly_fields = ('talep_no', 'odeme_durumu')
    inlines = [IsFotografiInline, OdemeInline]


admin.site.register(Odeme)
admin.site.register(IsFotografi)