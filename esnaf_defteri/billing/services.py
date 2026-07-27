from django.utils import timezone
from datetime import timedelta


def abonelik_aktif_et(odeme_kaydi, admin_user):
    abonelik = odeme_kaydi.user.abonelik

    # plan_tipi, OdemeKaydi üzerinde tutuluyor (kullanıcı hangi planı seçmiş)
    plan_gun = 365 if odeme_kaydi.plan_tipi == 'yillik' else 30

    now = timezone.now()
    abonelik.plan = odeme_kaydi.plan_tipi
    abonelik.durum = 'aktif'
    abonelik.mevcut_donem_baslangic = now
    abonelik.mevcut_donem_bitis = now + timedelta(days=plan_gun)
    abonelik.sonraki_odeme_tarihi = abonelik.mevcut_donem_bitis
    abonelik.save()

    odeme_kaydi.durum = 'basarili'
    odeme_kaydi.onaylayan_admin = admin_user
    odeme_kaydi.onay_tarihi = now
    odeme_kaydi.save()