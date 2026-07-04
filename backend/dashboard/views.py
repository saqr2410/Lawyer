from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from clients.models import Client
from cases.models import Case
from hearings.models import Hearing
from payments.models import Payment
from notifications.models import Notification


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):

        user = request.user
        tomorrow = timezone.localdate() + timedelta(days=1)

        # لو Admin يشوف كل البيانات
        if user.is_admin:

            clients = Client.objects.count()

            cases = Case.objects.count()

            hearings = Hearing.objects.filter(
                hearing_date__date=tomorrow
            ).count()

            payments = (
                Payment.objects.aggregate(
                    total=Sum("amount")
                )["total"] or 0
            )

            notifications = Notification.objects.filter(
                is_read=False
            ).count()

        # أي مستخدم تاني يشوف بياناته فقط
        else:

            clients = Client.objects.filter(
                created_by=user
            ).count()

            cases = Case.objects.filter(
                lawyer=user
            ).count()

            hearings = Hearing.objects.filter(
                case__lawyer=user,
                hearing_date__date=tomorrow
            ).count()

            payments = 0

            notifications = Notification.objects.filter(
                user=user,
                is_read=False
            ).count()

        return Response({
            "clients": clients,
            "cases": cases,
            "hearings_tomorrow": hearings,
            "payments": payments,
            "notifications": notifications,
        })