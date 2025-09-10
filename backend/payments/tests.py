from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from orders.models import Order
from products.models import Category, Product
from .models import Payment
from unittest.mock import patch, MagicMock

User = get_user_model()

class PaymentAPITest(TestCase):

    def setUp(self):
        self.client = APIClient()

        #creating a user and login 
        self.user = User.objects.create_user(
            email = "test@example.com", password = "testpass"
        )
        # Removed client.login() because JWT token is used for authentication
        # self.client.login(email="test@example.com",password = "testpass")
    
        #creating order and product 
        self.category = Category.objects.create(name= "phones", slug = "phones")
        self.product = Product.objects.create(
            category = self.category,
            name = "Samsung A13",
            slug = "Samsung A13",
            description = "Best camera Ever",
            price = 20000,
            stock = 20, 
            seller = self.user
        )
        self.order = Order.objects.create(
            user=self.user,
            total_price=20000,
            address="123 Test St",
            city="Test City",
            postal_code="12345",
            country="Test Country"
        )
        # Obtain JWT token for the user and set it in the client credentials
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
    
    
    @patch('payments.views.stripe.PaymentIntent.create')
    def test_create_payment(self, mock_payment_intent_create):
        # Mock the stripe.PaymentIntent.create response
        mock_intent = MagicMock()
        mock_intent.id = "pi_12345"
        mock_intent.client_secret = "secret_12345"
        mock_payment_intent_create.return_value = {
            "id": mock_intent.id,
            "client_secret": mock_intent.client_secret
        }

        url= reverse("payment-list")
        data = {"order_id":self.order.id}
        response = self.client.post(url, data, format= "json")

        # Assert Equal ensures that the values in the parameters are equal 
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("client_secret", response.data)
        self.assertEqual(Payment.objects.count(),1)
    
    def test_payment_status(self):
        #first create payment
        payment = Payment.objects.create(
            order = self.order, user = self.user, amount= 1200, status= "created"
        )
        url = reverse("payment-detail", args = [payment.id])
        data = {"status":"paid"}
        response = self.client.put(url, data, format= "json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payment.refresh_from_db()
        self.assertEqual(payment.status, "paid")
