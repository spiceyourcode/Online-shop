from django.urls import path
from .views import RegisterView, LoginView, RefreshView, ProfileView

urlpatterns = [
    path("register/",RegisterView.as_view(), name="auth-register"),
    path("login/",LoginView.as_view(), name="auth-login"),
    path("refresh/",RefreshView.as_view(), name="auth-refresh"),
    path("profile/",ProfileView.as_view(), name="auth-profile"),

]
