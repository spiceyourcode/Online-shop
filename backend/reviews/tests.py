from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from products.models import Product, Category
from reviews.models import Review

User = get_user_model()

class ReviewTests(APITestCase):

    def setUp(self):
        # Buyer
        self.buyer = User.objects.create_user(
            email="buyer2@example.com",
            password="testpass123",
            is_customer=True
        )
        buyer_refresh = RefreshToken.for_user(self.buyer)
        self.buyer_access_token = str(buyer_refresh.access_token)

        # Seller
        self.seller = User.objects.create_user(
            email="seller2@example.com",
            password="testpass123",
            is_seller=True,
            is_customer=False
        )
        seller_refresh = RefreshToken.for_user(self.seller)
        self.seller_access_token = str(seller_refresh.access_token)

        # Category + Product
        self.category = Category.objects.create(name="Smartphones")
        self.product = Product.objects.create(
            name="Samsung Galaxy S23",
            description="High-end Android",
            price=800,
            stock=15,
            seller=self.seller,
            category=self.category
        )

    def test_add_review(self):
        """Test buyer can add review to product"""
        url = reverse("reviews-list")
        payload = {
            "product": self.product.id,
            "rating": 5,
            "comment": "Amazing phone!"
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_access_token}')
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)

    def test_view_reviews_per_product(self):
        """Test reviews are listed for a product"""
        Review.objects.create(product=self.product, user=self.buyer, rating=4, comment="Good phone")
        url = reverse("reviews-list")
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.buyer_access_token}')
        response = self.client.get(url, {"product": self.product.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle paginated response
        if 'results' in response.data:
            self.assertEqual(len(response.data['results']), 1)
        else:
            self.assertEqual(len(response.data), 1)

    def test_review_permission(self):
        """Ensure only buyers can review"""
        url = reverse("reviews-list")
        payload = {
            "product": self.product.id,
            "rating": 3,
            "comment": "Trying to review as seller"
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.seller_access_token}')
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
