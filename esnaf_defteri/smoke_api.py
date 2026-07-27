import os
import random

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from rest_framework.test import APIClient


def _as_json(response):
    try:
        return response.json()
    except Exception:
        try:
            return response.data
        except Exception:
            return None


def main():
    client = APIClient()

    phone = f"55{random.randint(100000000, 999999999)}"
    payload = {
        "ad_soyad": "Smoke Test Kullanici",
        "telefon": phone,
        "password": "Test1234!",
    }

    register_res = client.post("/api/auth/register/", payload, format="json")
    print("REGISTER:", register_res.status_code, _as_json(register_res))
    auth_json = _as_json(register_res) or {}
    access = auth_json.get("access")
    if not access:
        raise SystemExit("Register access token missing.")

    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    dashboard_res = client.get("/api/dashboard/ozet/")
    print("DASHBOARD OZET:", dashboard_res.status_code, _as_json(dashboard_res))

    customer_res = client.post(
        "/api/musteriler/",
        {"ad_soyad": "Ahmet Yılmaz", "telefon": "5559876543", "adres": "Test Mah.", "not_alani": "test notu"},
        format="json",
    )
    print("MUSTERI EKLE:", customer_res.status_code, _as_json(customer_res))
    musteri_json = _as_json(customer_res) or {}
    musteri_id = musteri_json.get("id")
    if not musteri_id:
        raise SystemExit("Musteri id missing.")

    job_payload = {
        "musteri": musteri_id,
        "yapilan_is": "Klima bakımı",
        "ucret": "500.00",
        "durum": "tamamlandi",
        "tarih": "2026-07-05",
    }
    job_res = client.post("/api/is-kayitlari/", job_payload, format="json")
    print("IS KAYDI EKLE:", job_res.status_code, _as_json(job_res))

    borclular_res = client.get("/api/dashboard/borclular/")
    print("BORCLULAR:", borclular_res.status_code, _as_json(borclular_res))

    sub_durum_res = client.get("/api/abonelik/durum/")
    print("ABONELIK DURUM:", sub_durum_res.status_code, _as_json(sub_durum_res))

    odeme_talep_res = client.post("/api/abonelik/odeme-talep-et/", {"plan": "aylik"}, format="json")
    print("ODEME TALEP:", odeme_talep_res.status_code, _as_json(odeme_talep_res))

    iptal_res = client.post("/api/abonelik/iptal/", {}, format="json")
    print("ABONELIK IPTAL:", iptal_res.status_code, _as_json(iptal_res))


if __name__ == "__main__":
    main()

