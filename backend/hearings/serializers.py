from rest_framework import serializers
from .models import Hearing


class HearingSerializer(serializers.ModelSerializer):

    case_number = serializers.CharField(
        source="case.case_number",
        read_only=True
    )

    case_title = serializers.CharField(
        source="case.title",
        read_only=True
    )

    class Meta:

        model = Hearing

        fields = [
            "id",
            "case",
            "case_number",
            "case_title",
            "hearing_date",
            "court_name",
            "status",
            "notes",
            "result",
            "next_hearing_date",
            "judge_name",
            "courtroom",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        hearing_date = attrs.get("hearing_date")
        next_hearing_date = attrs.get("next_hearing_date")

        if hearing_date and next_hearing_date:

            if next_hearing_date <= hearing_date:
                raise serializers.ValidationError({
                    "next_hearing_date":
                    "Next hearing date must be after hearing date."
                })

        return attrs