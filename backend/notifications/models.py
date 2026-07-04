from django.db import models
from django.conf import settings


class Notification(models.Model):

    class Type(models.TextChoices):
        HEARING = "HEARING", "Hearing"
        PAYMENT = "PAYMENT", "Payment"
        SYSTEM = "SYSTEM", "System"

    class Event(models.TextChoices):
        HEARING_CREATED = "HEARING_CREATED", "Hearing Created"
        HEARING_REMINDER_DAY = "HEARING_REMINDER_DAY", "Reminder Before One Day"
        PAYMENT_CREATED = "PAYMENT_CREATED", "Payment Created"
        PAYMENT_REMINDER = "PAYMENT_REMINDER", "Payment Reminder"
        SYSTEM_MESSAGE = "SYSTEM_MESSAGE", "System Message"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        db_index=True
    )

    hearing = models.ForeignKey(
        "hearings.Hearing",
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        db_index=True
    )

    event = models.CharField(
        max_length=50,
        choices=Event.choices,
        default=Event.HEARING_CREATED,
        db_index=True
    )

    title = models.CharField(
        max_length=255
    )

    message = models.TextField()

    scheduled_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        help_text="وقت ظهور الإشعار"
    )

    is_sent = models.BooleanField(
        default=False,
        db_index=True,
        help_text="هل تم إرسال إشعار سطح المكتب؟"
    )

    sent_at = models.DateTimeField(
        null=True,
        blank=True
    )

    is_read = models.BooleanField(
        default=False,
        db_index=True,
        help_text="هل قرأ المستخدم الإشعار؟"
    )

    read_at = models.DateTimeField(
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

        ordering = [
            "-scheduled_at",
            "-created_at"
        ]

        indexes = [

            models.Index(
                fields=["user"]
            ),

            models.Index(
                fields=["scheduled_at"]
            ),

            models.Index(
                fields=["user", "is_sent"]
            ),

            models.Index(
                fields=["user", "is_read"]
            ),

            models.Index(
                fields=["user", "scheduled_at"]
            ),

            models.Index(
                fields=["type"]
            ),

            models.Index(
                fields=["event"]
            ),
        ]

        constraints = [

            models.UniqueConstraint(
                fields=[
                    "hearing",
                    "event"
                ],
                condition=models.Q(
                    hearing__isnull=False
                ),
                name="unique_hearing_notification"
            )
        ]

    def mark_as_sent(self):

        if not self.is_sent:
            from django.utils import timezone

            self.is_sent = True
            self.sent_at = timezone.now()

            self.save(
                update_fields=[
                    "is_sent",
                    "sent_at"
                ]
            )

    def mark_as_read(self):

        if not self.is_read:
            from django.utils import timezone

            self.is_read = True
            self.read_at = timezone.now()

            self.save(
                update_fields=[
                    "is_read",
                    "read_at"
                ]
            )

    @property
    def is_pending(self):
        return not self.is_sent

    def __str__(self):
        return f"{self.title} - {self.user.username}"