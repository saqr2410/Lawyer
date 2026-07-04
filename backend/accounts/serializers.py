from rest_framework import serializers

from .models import User, LawyerProfile



class LawyerProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = LawyerProfile

        fields = [
            "bar_number",
            "specialization",
            "address",
            "office_name",
        ]



class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )


    class Meta:

        model = User

        fields = [
            "username",
            "email",
            "password",
            "phone",
            "role",
        ]



    def create(self, validated_data):

        user = User.objects.create_user(

            username=validated_data["username"],

            email=validated_data.get(
                "email"
            ),

            phone=validated_data.get(
                "phone"
            ),

            role=validated_data.get(
                "role",
                User.Role.LAWYER
            ),

            password=validated_data["password"]

        )


        if user.role == User.Role.LAWYER:

            LawyerProfile.objects.create(
                user=user
            )


        return user





class UserSerializer(serializers.ModelSerializer):


    lawyer_profile = serializers.SerializerMethodField()



    class Meta:

        model = User


        fields = [

            "id",
            "username",
            "email",
            "phone",
            "role",
            "lawyer_profile",

        ]



    def get_lawyer_profile(self, obj):

        try:

            profile = obj.lawyer_profile

            return LawyerProfileSerializer(
                profile
            ).data


        except LawyerProfile.DoesNotExist:

            return None