from django.db import models

from cases.models import Case
from accounts.models import User


class Document(models.Model):

    class DocumentType(models.TextChoices):
        CONTRACT = "CONTRACT", "Contract"
        COURT = "COURT", "Court Document"
        ID = "ID", "ID Copy"
        OTHER = "OTHER", "Other"

    case = models.ForeignKey(
        Case,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    title = models.CharField(
        max_length=200
    )

    file = models.FileField(
        upload_to="documents/"
    )

    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.OTHER
    )

    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="uploaded_documents"
    )

    description = models.TextField(
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
        ordering = ["-created_at"]

        indexes = [
            models.Index(fields=["document_type"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.title