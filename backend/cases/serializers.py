from rest_framework import serializers

from .models import Case


class CaseSerializer(serializers.ModelSerializer):

    client_name = serializers.CharField(
        source="client.full_name",
        read_only=True
    )

    lawyer_username = serializers.CharField(
        source="lawyer.username",
        read_only=True
    )


    class Meta:

        model = Case

        fields = [
            "id",
            "case_number",
            "title",
            "client",
            "client_name",
            "lawyer",
            "lawyer_username",
            "court_name",
            "status",
            "description",
            "start_date",
            "closed_at",
            "opponent_name",
            "opponent_lawyer",
            "claim_amount",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "lawyer",
            "created_at",
            "updated_at",
        ]


    def validate(self, attrs):

        start_date = attrs.get(
            "start_date"
        )

        closed_at = attrs.get(
            "closed_at"
        )


        if start_date and closed_at:

            if closed_at < start_date:

                raise serializers.ValidationError(
                    {
                        "closed_at":
                        "Closed date cannot be before start date."
                    }
                )


        return attrs


    def create(self, validated_data):

        request = self.context.get(
            "request"
        )

        if request:

            validated_data["lawyer"] = request.user


        return super().create(validated_data)