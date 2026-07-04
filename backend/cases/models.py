from django.db import models

from accounts.models import User
from clients.models import Client


class Case(models.Model):

    class CaseStatus(models.TextChoices):
        OPEN = "OPEN", "Open"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        POSTPONED = "POSTPONED", "Postponed"
        WON = "WON", "Won"
        LOST = "LOST", "Lost"
        CLOSED = "CLOSED", "Closed"

    case_number = models.CharField(
        max_length=100,
        unique=True
    )

    title = models.CharField(
        max_length=200
    )

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="cases"
    )

    lawyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cases"
    )

    court_name = models.CharField(
        max_length=150
    )

    status = models.CharField(
        max_length=20,
        choices=CaseStatus.choices,
        default=CaseStatus.OPEN
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    start_date = models.DateField(
        null=True,
        blank=True
    )

    closed_at = models.DateField(
        null=True,
        blank=True
    )

    opponent_name = models.CharField(
        max_length=255,
        blank=True
    )

    opponent_lawyer = models.CharField(
        max_length=255,
        blank=True
    )

    claim_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["case_number"]),
            models.Index(fields=["status"]),
            models.Index(fields=["lawyer"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.case_number} - {self.title}"

    @property
    def is_closed(self):
        return self.status in [
            self.CaseStatus.CLOSED,
            self.CaseStatus.WON,
            self.CaseStatus.LOST,
        ]