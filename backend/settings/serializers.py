from rest_framework import serializers

from accounts.models import User, LawyerProfile



class LawyerProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = LawyerProfile

        fields = [

            "bar_number",
            "specialization",
            "office_name",
            "address",

        ]

        extra_kwargs = {

            "bar_number":{
                "required":False,
                "allow_blank":True
            },

            "specialization":{
                "required":False,
                "allow_blank":True
            },

            "office_name":{
                "required":False,
                "allow_blank":True
            },

            "address":{
                "required":False,
                "allow_blank":True
            }

        }





class SettingsSerializer(serializers.ModelSerializer):


    lawyer_profile = LawyerProfileSerializer(
        required=False
    )



    class Meta:


        model = User


        fields = [

            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "lawyer_profile",

        ]



        read_only_fields = [

            "username"

        ]





    def update(self,instance,validated_data):


        profile_data = validated_data.pop(
            "lawyer_profile",
            None
        )



        for key,value in validated_data.items():

            setattr(
                instance,
                key,
                value
            )



        instance.save()



        if profile_data:


            profile,created = LawyerProfile.objects.get_or_create(
                user=instance
            )



            for key,value in profile_data.items():

                setattr(
                    profile,
                    key,
                    value
                )



            profile.save()



        return instance