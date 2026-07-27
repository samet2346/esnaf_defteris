from rest_framework import serializers
from .models import Musteri

class MusteriSerializer(serializers.ModelSerializer):
    toplam_harcama = serializers.ReadOnlyField()
    kalan_borc = serializers.ReadOnlyField()
    son_islem_tarihi = serializers.ReadOnlyField()

    class Meta:
        model = Musteri
        # user alanını 'fields' içine koyma, serializer ona dokunmasın
        exclude = ['user']