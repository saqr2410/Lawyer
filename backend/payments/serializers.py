from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):


    case_number = serializers.CharField(
        source="case.case_number",
        read_only=True
    )


    created_by_username = serializers.CharField(
        source="created_by.username",
        read_only=True
    )


    class Meta:

        model = Payment


        fields = [

            "id",
            "case",
            "case_number",
            "amount",
            "payment_date",
            "payment_method",
            "notes",
            "created_by",
            "created_by_username",
            "created_at",
            "updated_at",

        ]


        read_only_fields = [

            "created_by",
            "payment_date",
            "created_at",
            "updated_at",

        ]



    def validate_amount(self, value):

        if value <= 0:

            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )


        return value