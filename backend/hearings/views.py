from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response


from .models import Hearing
from .serializers import HearingSerializer


from common.pagination import StandardPagination
from common.permissions import IsAdmin



class HearingViewSet(ModelViewSet):

    serializer_class = HearingSerializer

    pagination_class = StandardPagination


    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]


    filterset_fields = [
        "case",
        "status",
        "hearing_date",
        "court_name",
    ]


    search_fields = [
        "case__case_number",
        "case__title",
        "court_name",
        "judge_name",
    ]


    ordering_fields = [
        "hearing_date",
        "created_at",
    ]


    ordering = [
        "hearing_date"
    ]



    def get_permissions(self):


        if self.action in [
            "destroy",
            "delete_all"
        ]:

            return [
                IsAuthenticated(),
                IsAdmin()
            ]


        return [
            IsAuthenticated()
        ]




    def get_queryset(self):

        return Hearing.objects.select_related(
            "case"
        )





    @action(
        detail=False,
        methods=["delete"]
    )
    def delete_all(self, request):


        count, _ = self.get_queryset().delete()


        return Response(
            {
                "message": f"تم حذف {count} جلسة"
            }
        )