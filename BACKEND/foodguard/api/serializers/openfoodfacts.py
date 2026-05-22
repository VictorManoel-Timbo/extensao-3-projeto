from rest_framework import serializers


class IngredientSerializer(serializers.Serializer):
    id = serializers.CharField()
    is_in_taxonomy = serializers.IntegerField()
    percent_estimate = serializers.FloatField()
    percent_max = serializers.FloatField()
    percent_min = serializers.FloatField()
    text = serializers.CharField()


class OpenFoodFactsProductSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    additives_tags = serializers.ListField(child=serializers.CharField(), default=list)
    allergens_tags = serializers.ListField(child=serializers.CharField(), default=list)
    ingredients = IngredientSerializer(many=True, default=list)


class OpenFoodFactsSerializer(serializers.Serializer):
    code = serializers.CharField()
    product = OpenFoodFactsProductSerializer()
    status = serializers.IntegerField()
    status_verbose = serializers.CharField()
