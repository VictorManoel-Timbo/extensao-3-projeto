from drf_spectacular.utils import extend_schema
from rest_framework.generics import CreateAPIView
from rest_framework.generics import RetrieveUpdateAPIView
from django.shortcuts import get_object_or_404

from foodguard.api.serializers.anamnese import AnamneseSerializer
from foodguard.core.models.anamnese import Anamnese
from foodguard.api.exceptions.anamnese import AnamneseHasAlreadyBeenCreatedException

@extend_schema(summary="Cria uma anamnese para o usuário")
class AnamneseCreateView(CreateAPIView):
    serializer_class = AnamneseSerializer

    def perform_create(self, serializer):
        if Anamnese.objects.filter(user=self.request.user).exists():
            raise AnamneseHasAlreadyBeenCreatedException()
        serializer.save(user=self.request.user)

@extend_schema(summary="Recupera ou atualiza a anamnese do usuário")
class AnamneseGetUpdateView(RetrieveUpdateAPIView):
    serializer_class = AnamneseSerializer
    http_method_names = ['get', 'patch', 'options']

    def get_object(self):
        return get_object_or_404(Anamnese, user=self.request.user)