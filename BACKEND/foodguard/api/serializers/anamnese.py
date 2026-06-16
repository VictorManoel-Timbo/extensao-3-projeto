from rest_framework.serializers import ModelSerializer

from foodguard.core.models.anamnese import Anamnese
from foodguard.api.exceptions.anamnese import AnamneseObjectiveRequiredException


class AnamneseSerializer(ModelSerializer):
    class Meta:
        model = Anamnese
        fields = ['previous_consultation', 'alcohol_intake', 'smoking', 'previous_consultation_objective',
                  'previous_consultation_result', 'disease_history', 'medications', 'food_allergies',
                  'food_intolerances', 'favorite_foods', 'food_aversions', 'body_feeling', 'eating_style']

    def validate(self, attrs):
        is_previous = attrs.get(
            'previous_consultation', 
            getattr(self.instance, 'previous_consultation', False)
        )
        
        objective = attrs.get(
            'previous_consultation_objective', 
            getattr(self.instance, 'previous_consultation_objective', '')
        )
        
        if isinstance(objective, str):
            objective = objective.strip()

        if is_previous and not objective:
            raise AnamneseObjectiveRequiredException()
        
        return attrs