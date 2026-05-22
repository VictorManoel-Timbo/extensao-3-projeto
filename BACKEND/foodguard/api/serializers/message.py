from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import UUIDField

from foodguard.core.models.message import Message
from foodguard.api.serializers.openfoodfacts import OpenFoodFactsSerializer


class MessageSerializer(ModelSerializer):
    chat_id = UUIDField(source='chat.id', read_only=True)
    food_data = OpenFoodFactsSerializer(write_only=True, required=False)

    class Meta:
        model = Message
        fields = ['chat_id', 'role', 'content', 'created_at', 'food_data']

    def create(self, validated_data):
        validated_data.pop('food_data', None)
        return super().create(validated_data)