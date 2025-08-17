from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Product
from django.contrib.auth import get_user_model

User = get_user_model()

class ProductAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create a user and authenticate (email-based user model)
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='testpass',
            is_seller=True  # Set is_seller=True to allow product creation
        )
        self.client.force_authenticate(user=self.user)  # DRF authentication

        # Create a category for the product
        self.category = Category.objects.create(name="Phones", slug="phones")
        
        # Create a product associated with the user
        self.product = Product.objects.create(
            category=self.category,
            name="iPhone 15",
            slug="iphone-15",
            description="Latest Apple iPhone",
            price=1200.00,
            stock=10,
            seller=self.user  # Ensure the seller is set
        )

    def test_list_products(self):
        url = reverse("product-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_product(self):
        url = reverse("product-detail", args=[self.product.slug])  # Use slug instead of id
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "iPhone 15")

    def test_create_product(self):
        url = reverse("product-list")
        data = {
            "category_id": self.category.id,  # Use category_id for write-only field
            "name": "Samsung Galaxy S24",
            "slug": "samsung-s24",
            "description": "Latest Samsung flagship",
            "price": 1000.00,
            "stock": 5
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)
