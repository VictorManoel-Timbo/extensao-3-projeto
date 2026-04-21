from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Anamnese(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='anamnese'
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

    is_previous_consultation = models.BooleanField(
        default=False
    )
    previous_consultation_objective = models.TextField(
        blank=True, null=True,
        max_length=5000,
        verbose_name="Qual era o objetivo na época?"
    )
    previous_consultation_result = models.TextField(
        blank=True, null=True, 
        max_length=5000,
        verbose_name="Obteve resultado? Se sim, qual?"
    )

    is_disease_history = models.BooleanField(
        default=False
    )
    disease_history = models.TextField(
        blank=True, null=True, 
        max_length=5000,
        verbose_name="Histórico de doenças? Se sim, quais?"
    )

    is_medication_use = models.BooleanField(
        default=False
    )
    medications = models.TextField(
        blank=True, null=True, 
        max_length=5000,
        verbose_name="Faz uso de algum medicamento? Se sim, qual?"
    )
    
    favorite_foods = models.TextField(
        max_length=5000,
        verbose_name="Alimentos que você gosta de comer e não podem faltar"
    )
    food_aversions = models.TextField(
        blank=True, null=True, 
        max_length=5000,
        verbose_name="Aversões/Tabus Alimentares/Alimentos que não gosta"
    )

    FEELING_CHOICES = [
        ('very_satisfied', 'Muito Satisfeito'),
        ('satisfied', 'Satisfeito'),
        ('indifferent', 'Indiferente'),
        ('dissatisfied', 'Insatisfeito'),
        ('very_dissatisfied', 'Muito Insatisfeito'),
    ]
    body_feeling = models.CharField(
        max_length=20,
        choices=FEELING_CHOICES,
        blank=True, null=True,
        verbose_name="Sentimento sobre o seu corpo e alimentação?"
    )

    VEGETARIAN_CHOICES = [
        ('not', 'Não'),
        ('vegetarian', 'Vegetariano(a)'),
        ('vegan', 'Vegano(a)'),
    ]
    eating_style = models.CharField(
        max_length=20,
        choices=VEGETARIAN_CHOICES,
        default='not',
        verbose_name="Estilo de alimentação"
    )

    class Meta:
        verbose_name = "Formulário de Anamnese"
        verbose_name_plural = "Formulários de Anamnese"

    def clean(self):
        super().clean()
        
        errors = {}

        if self.is_previous_consultation:
            if not self.previous_consultation_objective:
                errors['previous_consultation_objective'] = "Este campo é obrigatório pois você marcou que já houve consulta prévia."
            
        if self.is_disease_history and not self.disease_history:
            errors['disease_history'] = "Por favor, informe o histórico de doenças."

        if self.is_medication_use and not self.medications:
            errors['medications'] = "Por favor, informe quais medicamentos você utiliza."

        if errors:
            raise ValidationError(errors)

    