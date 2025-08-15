from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "phone_number", "is_seller", "is_customer", "date_joined"]

class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only= True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "name", "phone_number", "password"]
    
    def create(self, validated_data):
        password= validated_data.pop("password")
        user =User.objects.create_user(password=password, **validated_data)
        return user
    
class UpdatedProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields =[ "name", "phone_number"]

        