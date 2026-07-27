from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, ProfileView, ChangePasswordView, ResetPasswordView
from .excel_views import ExcelExportView, ExcelImportView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("excel/export/", ExcelExportView.as_view(), name="excel_export"),
    path("excel/import/", ExcelImportView.as_view(), name="excel_import"),
]
