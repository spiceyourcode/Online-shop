from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthFlowTests(APITestCase):
    def test_register_login_profile(self):
        # register
        res = self.client.post(reverse("auth-register"), {
            "email": "test@example.com",
            "name": "Test User",
            "phone_number": "0700000000",
            "password": "Pass123456"
        }, format="json")
        self.assertEqual(res.status_code, 201)

        # login
        res = self.client.post(reverse("auth-login"), {
            "email": "test@example.com",
            "password": "Pass123456"
        }, format="json")
        self.assertEqual(res.status_code, 200)
        access = res.data["access"]

        # profile
        res = self.client.get(reverse("auth-profile"), HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["email"], "test@example.com")
