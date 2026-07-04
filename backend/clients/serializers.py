from rest_framework import serializers

from .models import Client


class ClientSerializer(serializers.ModelSerializer):

    created_by = serializers.StringRelatedField(
        read_only=True
    )


    class Meta:

        model = Client

        fields = [
            "id",
            "full_name",
            "phone",
            "email",
            "national_id",
            "address",
            "notes",
            "created_by",
            "created_at",
            "updated_at",
        ]


    def validate_national_id(self, value):

        if value:

            clients = Client.objects.filter(
                national_id=value
            )


            if self.instance:

                clients = clients.exclude(
                    id=self.instance.id
                )


            if clients.exists():

                raise serializers.ValidationError(
                    "National ID already exists"
                )


        return value