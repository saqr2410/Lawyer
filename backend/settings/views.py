from rest_framework import viewsets

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from accounts.models import LawyerProfile

from .serializers import SettingsSerializer





class SettingsViewSet(viewsets.ViewSet):


    permission_classes = [
        IsAuthenticated
    ]




    def get_object(self,request):


        LawyerProfile.objects.get_or_create(
            user=request.user
        )


        return request.user






    def list(self,request):


        user = self.get_object(request)



        serializer = SettingsSerializer(
            user
        )


        return Response(
            serializer.data
        )






    def partial_update(self,request,pk=None):


        user = self.get_object(request)



        serializer = SettingsSerializer(

            user,

            data=request.data,

            partial=True

        )



        serializer.is_valid(
            raise_exception=True
        )


        serializer.save()



        return Response(
            serializer.data
        )





    def update(self,request,pk=None):

        return self.partial_update(
            request,
            pk
        )