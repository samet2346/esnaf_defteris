from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'ad_soyad', 'telefon', 'email']
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['ad_soyad', 'telefon', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            telefon=validated_data['telefon'],
            ad_soyad=validated_data['ad_soyad'],
            email=validated_data.get('email') or None,
            password=validated_data['password'],
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.username_field in self.fields:
            del self.fields[self.username_field]
        self.fields['username'] = serializers.CharField()

    def validate(self, attrs):
        identifier = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=identifier,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError('Telefon/e-posta veya şifre hatalı.')

        self.user = user
        refresh = self.get_token(self.user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(self.user).data,
        }
