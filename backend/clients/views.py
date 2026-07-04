from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter

from .models import Client
from .serializers import ClientSerializer

from common.permissions import IsAdmin


class ClientViewSet(viewsets.ModelViewSet):

    serializer_class = ClientSerializer

    filter_backends = [
        SearchFilter
    ]

    search_fields = [
        "full_name",
        "phone",
        "national_id",
    ]


    def get_permissions(self):

        if self.action == "destroy":
            return [
                IsAuthenticated(),
                IsAdmin()
            ]

        return [
            IsAuthenticated()
        ]


    def get_queryset(self):

        return Client.objects.all()


    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )