from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Hearing
from notifications.services import sync_hearing_notifications


@receiver(post_save, sender=Hearing)
def hearing_signal(sender, instance, created, **kwargs):

    # مهم جدًا: نشتغل فقط عند إنشاء الجلسة لأول مرة
    if not created:
        return

    sync_hearing_notifications(instance)