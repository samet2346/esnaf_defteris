from rest_framework import serializers
from .models import IsKaydi, IsFotografi, Odeme
from customers.models import Musteri


class IsFotografiSerializer(serializers.ModelSerializer):
    class Meta:
        model = IsFotografi
        fields = '__all__'


class OdemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Odeme
        fields = '__all__'
        read_only_fields = ['is_kaydi']


class IsKaydiSerializer(serializers.ModelSerializer):
    fotograflar = IsFotografiSerializer(many=True, read_only=True)
    odemeler = OdemeSerializer(many=True, read_only=True, source='ademeler')
    kalan_tutar = serializers.SerializerMethodField()

    musteri = serializers.PrimaryKeyRelatedField(read_only=True)
    musteri_adi_goster = serializers.CharField(source='musteri.ad_soyad', read_only=True)
    musteri_telefon_goster = serializers.CharField(source='musteri.telefon', read_only=True)

    musteri_adi = serializers.CharField(write_only=True)
    musteri_telefon = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = IsKaydi
        fields = '__all__'
        read_only_fields = ['talep_no', 'odeme_durumu', 'odenen_tutar', 'user']

    def get_kalan_tutar(self, obj):
        return obj.ucret - obj.odenen_tutar

    def create(self, validated_data):
        musteri_adi = validated_data.pop('musteri_adi')
        musteri_telefon = validated_data.pop('musteri_telefon', '')
        user = validated_data.get('user')

        musteri, _ = Musteri.objects.get_or_create(
            user=user,
            ad_soyad=musteri_adi,
            defaults={'telefon': musteri_telefon},
        )
        validated_data['musteri'] = musteri
        return super().create(validated_data)
