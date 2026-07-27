from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('telefon', 'ad_soyad', 'is_staff', 'is_active', 'created_at')
    search_fields = ('telefon', 'ad_soyad')
