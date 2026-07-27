from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        ad_soyad = request.data.get("ad_soyad")
        telefon = request.data.get("telefon")
        email = request.data.get("email")

        if ad_soyad is not None:
            user.ad_soyad = ad_soyad
        if telefon is not None:
            user.telefon = telefon
        if email is not None:
            user.email = email or None
        user.save()

        return Response(UserSerializer(user).data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"detail": "Mevcut ve yeni sifre zorunlu."}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(old_password):
            return Response({"detail": "Mevcut sifre hatali."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({"detail": "Yeni sifre en az 6 karakter olmali."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Sifre basariyla guncellendi."})


class ResetPasswordView(APIView):
    """Şifre sıfırlama talebi — e-posta altyapısı yoksa güvenli genel yanıt döner."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        telefon = (request.data.get("telefon") or "").strip()

        if not email and not telefon:
            return Response(
                {"detail": "E-posta veya telefon numarası gerekli."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Enumeration koruması: kullanıcı varsa/yoksa aynı mesaj
        if email:
            CustomUser.objects.filter(email__iexact=email).exists()
        if telefon:
            CustomUser.objects.filter(telefon=telefon).exists()

        return Response({
            "detail": (
                "Sifre sifirlama talebiniz alindi. "
                "Kayitli bir hesap varsa destek ekibimiz sizinle iletisime gececektir."
            )
        })
