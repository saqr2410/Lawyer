from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):

    case_number = serializers.CharField(
        source="case.case_number",
        read_only=True
    )


    uploaded_by_username = serializers.CharField(
        source="uploaded_by.username",
        read_only=True
    )


    class Meta:

        model = Document


        fields = [
            "id",
            "case",
            "case_number",
            "title",
            "file",
            "document_type",
            "description",
            "uploaded_by",
            "uploaded_by_username",
            "created_at",
            "updated_at",
        ]


        read_only_fields = [
            "uploaded_by",
            "created_at",
            "updated_at",
        ]