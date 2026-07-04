from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Payment
from .serializers import PaymentSerializer

from common.pagination import StandardPagination


class PaymentViewSet(ModelViewSet):

    serializer_class = PaymentSerializer

    permission_classes = [
        IsAuthenticated
    ]

    pagination_class = StandardPagination

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "case",
        "payment_method",
        "payment_date",
    ]

    search_fields = [
        "case__case_number",
        "case__title",
        "notes",
    ]

    ordering_fields = [
        "payment_date",
        "amount",
        "created_at",
    ]

    ordering = [
        "-payment_date"
    ]

    def get_queryset(self):

        user = self.request.user

        queryset = Payment.objects.select_related(
            "case"
        )

        if user.role == "ADMIN":
            return queryset

        return queryset.filter(
            case__lawyer=user
        )

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )