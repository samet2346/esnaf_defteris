from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import CustomUser
from customers.models import Musteri
from jobs.models import IsKaydi


class JobsApiTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            telefon="5557778899",
            ad_soyad="Test Usta",
            password="GucluSifre123!",
        )
        self.client.force_authenticate(self.user)
        self.musteri = Musteri.objects.create(
            user=self.user,
            ad_soyad="Musteri Bir",
            telefon="5550001122",
        )

    def test_job_detail_serializes_payments_under_odemeler(self):
        is_kaydi = IsKaydi.objects.create(
            user=self.user,
            musteri=self.musteri,
            yapilan_is="Kombi bakimi",
            ucret=Decimal("750.00"),
        )
        is_kaydi.ademeler.create(tutar=Decimal("250.00"))

        response = self.client.get(f"/api/is-kayitlari/{is_kaydi.pk}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["odemeler"]), 1)
        self.assertEqual(response.data["kalan_tutar"], Decimal("500.00"))

    def test_add_payment_returns_created_payment_and_updated_job(self):
        is_kaydi = IsKaydi.objects.create(
            user=self.user,
            musteri=self.musteri,
            yapilan_is="Tesisat onarimi",
            ucret=Decimal("500.00"),
        )

        response = self.client.post(
            f"/api/is-kayitlari/{is_kaydi.pk}/odeme_ekle/",
            {"tutar": "200.00", "tarih": "2026-07-08"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["odeme"]["tutar"], "200.00")
        self.assertEqual(response.data["is_kaydi"]["odenen_tutar"], "200.00")
        self.assertEqual(response.data["is_kaydi"]["odeme_durumu"], "kismi_odendi")

    def test_add_payment_works_without_explicit_date(self):
        is_kaydi = IsKaydi.objects.create(
            user=self.user,
            musteri=self.musteri,
            yapilan_is="Boya isi",
            ucret=Decimal("300.00"),
        )

        response = self.client.post(
            f"/api/is-kayitlari/{is_kaydi.pk}/odeme_ekle/",
            {"tutar": "100.00"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tarih", response.data["odeme"])

    def test_job_list_supports_musteri_id_filter_alias(self):
        IsKaydi.objects.create(
            user=self.user,
            musteri=self.musteri,
            yapilan_is="Klima bakimi",
            ucret=Decimal("300.00"),
        )
        diger_musteri = Musteri.objects.create(
            user=self.user,
            ad_soyad="Musteri Iki",
            telefon="5550003344",
        )
        IsKaydi.objects.create(
            user=self.user,
            musteri=diger_musteri,
            yapilan_is="Elektrik onarimi",
            ucret=Decimal("400.00"),
        )

        response = self.client.get(f"/api/is-kayitlari/?musteri_id={self.musteri.pk}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["musteri"], self.musteri.pk)
