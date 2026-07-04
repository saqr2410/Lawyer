from django.core.management.base import BaseCommand
from notifications.services import generate_tomorrow_notifications


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        generate_tomorrow_notifications()
        self.stdout.write(self.style.SUCCESS("Notifications generated successfully"))