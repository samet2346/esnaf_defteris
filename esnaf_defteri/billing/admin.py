from django.contrib import admin
from .models import OdemeKaydi, Abonelik
from .services import abonelik_aktif_et


@admin.register(OdemeKaydi)
class OdemeKaydiAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_user_telefon', 'tutar', 'durum', 'dekont_no', 'islem_tarihi')
    list_filter = ('durum',)
    actions = ['iban_gonderildi_isaretle', 'odemeyi_onayla', 'reddet']

    def get_user_telefon(self, obj):
        return obj.user.telefon
    get_user_telefon.short_description = 'Telefon'

    @admin.action(description="IBAN gönderildi işaretle (Beklemeye al)")
    def iban_gonderildi_isaretle(self, request, queryset):
        queryset.update(durum='beklemede')

    @admin.action(description="Ödemeyi onayla (Aktif et)")
    def odemeyi_onayla(self, request, queryset):
        for kayit in queryset:
            abonelik_aktif_et(kayit, request.user)

    @admin.action(description="Reddet")
    def reddet(self, request, queryset):
        queryset.update(durum='basarisiz')


@admin.register(Abonelik)
class AbonelikAdmin(admin.ModelAdmin):
    list_display = ('user', 'durum', 'plan', 'deneme_bitis', 'mevcut_donem_bitis', 'yazma_izni_var_mi_goster')

    def yazma_izni_var_mi_goster(self, obj):
        return obj.yazma_izni_var_mi
    yazma_izni_var_mi_goster.boolean = True
    yazma_izni_var_mi_goster.short_description = "Yazma İzni"