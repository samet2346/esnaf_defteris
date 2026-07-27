from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, telefon, ad_soyad, email=None, password=None, **extra_fields):
        if not telefon:
            raise ValueError('Kullanıcıların bir telefon numarası olmalıdır.')
        email = self.normalize_email(email) if email else None
        user = self.model(telefon=telefon, ad_soyad=ad_soyad, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        from billing.models import Abonelik
        Abonelik.objects.get_or_create(
            user=user,
            defaults={
                'durum': 'deneme',
                'deneme_baslangic': timezone.now(),
                'deneme_bitis': timezone.now() + timezone.timedelta(days=14)
            }
        )
        return user

    def create_superuser(self, telefon, ad_soyad, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(telefon, ad_soyad, email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    telefon = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    ad_soyad = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'telefon'
    REQUIRED_FIELDS = ['ad_soyad']

    @property
    def username(self):
        return self.telefon

    def __str__(self):
        return f"{self.ad_soyad} ({self.telefon})"
