from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import CustomUser


class AuthApiTests(APITestCase):
    def test_register_returns_tokens_and_user_and_creates_subscription(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "ad_soyad": "Test Kullanici",
                "telefon": "5551112233",
                "password": "GucluSifre123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["telefon"], "5551112233")

        user = CustomUser.objects.get(telefon="5551112233")
        self.assertTrue(hasattr(user, "abonelik"))

    def test_login_returns_tokens_and_user_payload(self):
        CustomUser.objects.create_user(
            telefon="5553334455",
            ad_soyad="Giris Kullanici",
            password="GucluSifre123!",
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "5553334455",
                "password": "GucluSifre123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["telefon"], "5553334455")

    def test_reset_password_accepts_email(self):
        response = self.client.post(
            "/api/auth/reset-password/",
            {"email": "ornek@mail.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.data)
