from rest_framework.exceptions import APIException
from rest_framework import status

class RoleNotAllowedException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "role_not_allowed"

    def __init__(self, detail="Seu perfil de usuário não possui privilégios para executar operações como Sistema."):
        self.detail = detail