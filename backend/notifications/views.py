from django.utils import timezone
from django.db.models import Q

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(ModelViewSet):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    http_method_names = [
        "get",
        "post",
        "put",
        "patch",
        "delete",
        "head",
        "options"
    ]

    # ==========================
    # QUERYSET WITH ADMIN ACCESS
    # ==========================
    def get_queryset(self):

        user = self.request.user

        if not user or not user.is_authenticated:
            return Notification.objects.none()

        # Admin / Superuser
        if user.is_superuser or user.is_staff:
            return Notification.objects.all().order_by(
                "-scheduled_at",
                "-created_at"
            )

        # Normal User
        return Notification.objects.filter(
            user=user
        ).order_by(
            "-scheduled_at",
            "-created_at"
        )


    # ==========================
    # Desktop Notifications
    # ==========================
    @action(detail=False, methods=["get"])
    def desktop(self, request):

        qs = self.get_queryset()

        notifications = qs.filter(
            is_sent=False
        ).filter(
            Q(scheduled_at__isnull=True) |
            Q(scheduled_at__lte=timezone.now())
        )

        serializer = self.get_serializer(
            notifications,
            many=True
        )

        return Response(serializer.data)


    # ==========================
    # Unread Notifications
    # ==========================
    @action(detail=False, methods=["get"])
    def unread(self, request):

        notifications = self.get_queryset().filter(
            is_read=False
        )

        serializer = self.get_serializer(
            notifications,
            many=True
        )

        return Response(serializer.data)


    # ==========================
    # Unread Count
    # ==========================
    @action(detail=False, methods=["get"])
    def unread_count(self, request):

        count = self.get_queryset().filter(
            is_read=False
        ).count()

        return Response({
            "count": count
        })


    # ==========================
    # Mark As Sent
    # ==========================
    @action(detail=True, methods=["post"])
    def mark_as_sent(self, request, pk=None):

        notification = self.get_object()

        notification.mark_as_sent()

        return Response({
            "message": "Notification marked as sent."
        })


    # ==========================
    # Mark As Read
    # ==========================
    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):

        notification = self.get_object()

        notification.mark_as_read()

        return Response({
            "message": "Notification marked as read."
        })


    # ==========================
    # Mark All As Read
    # ==========================
    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):

        now = timezone.now()

        self.get_queryset().filter(
            is_read=False
        ).update(
            is_read=True,
            read_at=now
        )

        return Response({
            "message": "All notifications marked as read."
        })


    # ==========================
    # Delete All
    # ==========================
    @action(detail=False, methods=["delete"])
    def delete_all(self, request):

        deleted, _ = self.get_queryset().delete()

        return Response({
            "message": "Notifications deleted successfully.",
            "deleted": deleted
        })


    # ==========================
    # Recent Notifications
    # ==========================
    @action(detail=False, methods=["get"])
    def recent(self, request):

        notifications = self.get_queryset()[:10]

        serializer = self.get_serializer(
            notifications,
            many=True
        )

        return Response(serializer.data)