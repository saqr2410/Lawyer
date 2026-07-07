from django.db.models import Sum, Q
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

        today = timezone.localdate()
        tomorrow = today + timedelta(days=1)


        # =========================
        # تحديد الصلاحيات
        # =========================

        is_admin = getattr(user, "is_admin", False)


        if is_admin:

            client_qs = Client.objects.all()
            case_qs = Case.objects.all()
            hearing_qs = Hearing.objects.all()
            payment_qs = Payment.objects.all()
            notification_qs = Notification.objects.all()

        else:

            client_qs = Client.objects.filter(
                created_by=user
            )

            case_qs = Case.objects.filter(
                lawyer=user
            )

            hearing_qs = Hearing.objects.filter(
                case__lawyer=user
            )

            payment_qs = Payment.objects.filter(
                case__lawyer=user
            )

            notification_qs = Notification.objects.filter(
                user=user
            )



        # =========================
        # الكروت الأساسية
        # =========================

        clients = client_qs.count()


        cases = case_qs.count()


        hearings_tomorrow = hearing_qs.filter(
            hearing_date__date=tomorrow
        ).count()


        payments = payment_qs.aggregate(
            total=Sum("amount")
        )["total"] or 0


        notifications = notification_qs.filter(
            is_read=False
        ).count()



        # =========================
        # تفاصيل القضايا
        # =========================

        open_cases = case_qs.filter(
            status=Case.CaseStatus.OPEN
        ).count()


        in_progress_cases = case_qs.filter(
            status=Case.CaseStatus.IN_PROGRESS
        ).count()


        closed_cases = case_qs.filter(
            status=Case.CaseStatus.CLOSED
        ).count()


        won_cases = case_qs.filter(
            status=Case.CaseStatus.WON
        ).count()


        lost_cases = case_qs.filter(
            status=Case.CaseStatus.LOST
        ).count()



        # =========================
        # تفاصيل العملاء
        # =========================

        new_clients = client_qs.filter(
            created_at__date=today
        ).count()


        month_start = today.replace(day=1)


        month_clients = client_qs.filter(
            created_at__date__gte=month_start
        ).count()


        clients_with_cases = client_qs.filter(
            cases__isnull=False
        ).distinct().count()


        clients_without_cases = client_qs.filter(
            cases__isnull=True
        ).count()


        clients_with_phone = client_qs.filter(
            Q(phone__isnull=False) &
            ~Q(phone="")
        ).count()


        clients_without_phone = client_qs.filter(
            Q(phone__isnull=True) |
            Q(phone="")
        ).count()



        # =========================
        # تفاصيل الجلسات
        # =========================

        today_hearings = hearing_qs.filter(
            hearing_date__date=today
        ).count()


        tomorrow_hearings = hearing_qs.filter(
            hearing_date__date=tomorrow
        ).count()


        upcoming_hearings = hearing_qs.filter(
            hearing_date__date__gt=tomorrow
        ).count()



        # =========================
        # تفاصيل المدفوعات
        # =========================

        payments_count = payment_qs.count()


        today_payments = payment_qs.filter(
            created_at__date=today
        ).aggregate(
            total=Sum("amount")
        )["total"] or 0



        # =========================
        # تفاصيل الإشعارات
        # =========================

        unread_notifications = notification_qs.filter(
            is_read=False
        ).count()


        sent_notifications = notification_qs.filter(
            is_sent=True
        ).count()


        pending_notifications = notification_qs.filter(
            is_sent=False
        ).count()


        today_notifications = notification_qs.filter(
            created_at__date=today
        ).count()



        # =========================
        # Response
        # =========================

        return Response({

            # =================
            # الكروت العلوية
            # =================

            "clients": clients,

            "cases": cases,

            "hearings_tomorrow": hearings_tomorrow,

            "payments": payments,

            "notifications": notifications,



            # =================
            # القضايا
            # =================

            "open_cases": open_cases,

            "in_progress_cases": in_progress_cases,

            "closed_cases": closed_cases,

            "won_cases": won_cases,

            "lost_cases": lost_cases,



            # =================
            # العملاء
            # =================

            "new_clients": new_clients,

            "month_clients": month_clients,

            "clients_with_cases": clients_with_cases,

            "clients_without_cases": clients_without_cases,

            "clients_with_phone": clients_with_phone,

            "clients_without_phone": clients_without_phone,



            # =================
            # الجلسات
            # =================

            "today_hearings": today_hearings,

            "tomorrow_hearings": tomorrow_hearings,

            "upcoming_hearings": upcoming_hearings,



            # =================
            # المدفوعات
            # =================

            "payments_count": payments_count,

            "today_payments": today_payments,



            # =================
            # الإشعارات
            # =================

            "unread_notifications": unread_notifications,

            "sent_notifications": sent_notifications,

            "pending_notifications": pending_notifications,

            "today_notifications": today_notifications,

        })