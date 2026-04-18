from django.db import models
from django.conf import settings

class Anamnese(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='anamneses'
    )
    previous_consultation = models.BooleanField(
        default=False, 
        verbose_name="Já fez consulta prévia com nutricionista?"
    )
    alcohol_intake = models.BooleanField(
        default=False, 
        verbose_name="Ingestão de Álcool"
    )
    smoking = models.BooleanField(
        default=False, 
        verbose_name="Fumo"
    )

    previous_consultation_objective = models.TextField(
        blank=True, null=True, 
        verbose_name="Qual era o objetivo na época?"
    )
    previous_consultation_result = models.TextField(
        blank=True, null=True, 
        verbose_name="Obteve resultado? Se sim, qual?"
    )
    disease_history = models.TextField(
        blank=True, null=True, 
        verbose_name="Histórico de doenças? Se sim, quais?"
    )
    medications = models.TextField(
        blank=True, null=True, 
        verbose_name="Faz uso de algum medicamento? Se sim, qual?"
    )
    favorite_foods = models.TextField(
        blank=True, null=True, 
        verbose_name="Alimentos que você gosta de comer e não podem faltar"
    )
    food_aversions = models.TextField(
        blank=True, null=True, 
        verbose_name="Aversões/Tabus Alimentares/Alimentos que não gosta"
    )

    SENTIMENTO_CHOICES = [
        ('muito_satisfeito', 'Muito Satisfeito'),
        ('satisfeito', 'Satisfeito'),
        ('indiferente', 'Indiferente'),
        ('insatisfeito', 'Insatisfeito'),
        ('muito_insatisfeito', 'Muito Insatisfeito'),
    ]
    body_feeling = models.CharField(
        max_length=20,
        choices=SENTIMENTO_CHOICES,
        blank=True, null=True,
        verbose_name="Sentimento sobre o seu corpo e alimentação?"
    )

    VEGETARIANO_CHOICES = [
        ('nao', 'Não'),
        ('vegetariano', 'Vegetariano(a)'),
        ('vegano', 'Vegano(a)'),
    ]
    eating_style = models.CharField(
        max_length=20,
        choices=VEGETARIANO_CHOICES,
        default='nao',
        verbose_name="Vegetariano"
    )

    class Meta:
        verbose_name = "Anamnese Nutricional"
        verbose_name_plural = "Anamneses Nutricionais"