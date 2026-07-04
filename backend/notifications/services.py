from datetime import timedelta
from django.utils import timezone
from .models import Notification


def sync_hearing_notifications(hearing):

    reminder_time = hearing.hearing_date - timedelta(days=1)

    Notification.objects.update_or_create(
        hearing=hearing,
        event=Notification.Event.HEARING_REMINDER_DAY,
        defaults={
            "user": hearing.case.lawyer,
            "type": Notification.Type.HEARING,
            "title": "تذكير بموعد جلسة",
            "message": f"جلسة بتاريخ {hearing.hearing_date:%Y-%m-%d %H:%M}",
            "scheduled_at": reminder_time,
            "is_sent": False,
            "sent_at": None,
        }
    )