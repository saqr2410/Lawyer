from django.db import models
from accounts.models import User



class Client(models.Model):

    full_name = models.CharField(
        max_length=150
    )


    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )


    email = models.EmailField(
        blank=True,
        null=True
    )


    national_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True
    )


    address = models.TextField(
        blank=True,
        null=True
    )


    notes = models.TextField(
        blank=True,
        null=True
    )


    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="clients"
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    updated_at = models.DateTimeField(
        auto_now=True
    )



    class Meta:

        ordering = [
            "-created_at"
        ]



    def __str__(self):

        return self.full_name