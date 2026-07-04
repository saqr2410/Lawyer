from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend


from .models import Document
from .serializers import DocumentSerializer


from common.pagination import StandardPagination
from common.permissions import IsAdmin



class DocumentViewSet(ModelViewSet):

    serializer_class = DocumentSerializer


    pagination_class = StandardPagination


    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]


    filterset_fields = [
        "document_type",
        "case",
    ]


    search_fields = [
        "title",
        "case__case_number",
        "case__title",
    ]


    ordering_fields = [
        "created_at",
        "title",
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

        return Document.objects.select_related(
            "case",
            "uploaded_by"
        )



    def perform_create(self, serializer):

        serializer.save(
            uploaded_by=self.request.user
        )