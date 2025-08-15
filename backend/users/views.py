from django.contrib.auth import get_user_model
# provides basic views for common tasks & control who can access certain views
from rest_framework import generics, permissions 
from rest_framework.response import Response
# package for handling login and refreshing tokens.
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import RegisterSerializer, UserSerializer, UpdatedProfileSerializer
from .auth import EmailTokenObtainPairSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()

class LoginView(TokenObtainPairView):
    serializer_class =EmailTokenObtainPairSerializer
   
class RefreshView(TokenRefreshView):
    pass

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args , **kwargs):
        return Response(UserSerializer(request.user).data)
    
    def put(self, request, *args , **kwargs):
        serializer =UpdatedProfileSerializer(instance =request.user, data = request.data,partial = False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)
    
    def patch(self, request, *args , **kwargs):
        serializer =UpdatedProfileSerializer(instance =request.user, data = request.data,partial = False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user).data)
    