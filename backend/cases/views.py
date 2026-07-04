from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Case
from .serializers import CaseSerializer

from common.permissions import IsAdmin


class CaseViewSet(ModelViewSet):

    serializer_class = CaseSerializer


    filter_backends = [
        SearchFilter,
        OrderingFilter,
    ]


    search_fields = [
        "case_number",
        "title",
        "court_name",
        "client__full_name",
    ]


    ordering_fields = [
        "created_at",
        "case_number",
        "status",
    ]


    ordering = [
        "-created_at"
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

        return Case.objects.select_related(
            "client",
            "lawyer"
        )


    def perform_create(self, serializer):

        serializer.save(
            lawyer=self.request.user
        )