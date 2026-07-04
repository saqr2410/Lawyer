from django.db import models
from cases.models import Case
from django.conf import settings


class Payment(models.Model):

    PAYMENT_METHODS = (

        ('CASH', 'Cash'),
        ('TRANSFER', 'Bank Transfer'),
        ('OTHER', 'Other'),

    )


    case = models.ForeignKey(
        Case,
        on_delete=models.CASCADE,
        related_name="payments"
    )


    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )


    payment_date = models.DateField(
        auto_now_add=True
    )


    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS,
        default='CASH'
    )


    notes = models.TextField(
        blank=True,
        null=True
    )


    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="payments_created"
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )


    def __str__(self):

        return f"{self.case.case_number} - {self.amount}"