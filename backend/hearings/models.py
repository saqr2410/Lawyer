from django.db import models

from cases.models import Case


class Hearing(models.Model):

    class HearingStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        POSTPONED = "POSTPONED", "Postponed"
        CANCELLED = "CANCELLED", "Cancelled"

    case = models.ForeignKey(
        Case,
        on_delete=models.CASCADE,
        related_name="hearings"
    )

    hearing_date = models.DateTimeField(
        db_index=True
    )

    court_name = models.CharField(
        max_length=150
    )

    status = models.CharField(
        max_length=20,
        choices=HearingStatus.choices,
        default=HearingStatus.SCHEDULED,
        db_index=True
    )

    notes = models.TextField(
        blank=True,
        null=True
    )

    result = models.TextField(
        blank=True,
        null=True
    )

    next_hearing_date = models.DateTimeField(
        blank=True,
        null=True
    )

    judge_name = models.CharField(
        max_length=150,
        blank=True
    )

    courtroom = models.CharField(
        max_length=100,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [
            "hearing_date"
        ]

        indexes = [

            models.Index(
                fields=["case"]
            ),

            models.Index(
                fields=["hearing_date"]
            ),

            models.Index(
                fields=["status"]
            ),

            models.Index(
                fields=["case", "hearing_date"]
            ),

        ]

    @property
    def is_upcoming(self):
        from django.utils import timezone
        return self.hearing_date >= timezone.now()

    @property
    def is_finished(self):
        return self.status == self.HearingStatus.COMPLETED

    @property
    def is_cancelled(self):
        return self.status == self.HearingStatus.CANCELLED

    def __str__(self):
        return (
            f"{self.case.case_number} - "
            f"{self.hearing_date:%Y-%m-%d %H:%M}"
        )