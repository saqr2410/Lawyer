from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        LAWYER = "LAWYER", "Lawyer"
        SECRETARY = "SECRETARY", "Secretary"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.LAWYER
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["username"]

        indexes = [
            models.Index(fields=["role"]),
            models.Index(fields=["username"]),
            models.Index(fields=["email"]),
        ]

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_lawyer(self):
        return self.role == self.Role.LAWYER

    @property
    def is_secretary(self):
        return self.role == self.Role.SECRETARY

    def __str__(self):
        return f"{self.username} - {self.role}"


class LawyerProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="lawyer_profile"
    )

    bar_number = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    specialization = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    office_name = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    address = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["user__username"]

    def __str__(self):
        return f"{self.user.username} Profile"