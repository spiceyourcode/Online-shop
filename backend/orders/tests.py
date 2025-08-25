from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, Category
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer

User = get_user_model()

class OrderModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="testuser@example.com", password="pass123")
        self.category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(name="Test Product", price=100, category=self.category, seller=self.user)
        # Create a cart for the user
        from carts.models import Cart
        Cart.objects.create(user=self.user)

    def test_create_order_with_items(self):
        order = Order.objects.create(
            user=self.user,
            address="123 Street",
            city="Nairobi",
            postal_code="00100",
            country="Kenya"
        )
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            quantity=2,
            price=self.product.price
        )
        order.total_price = item.subtotal
        order.save()

        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.total_price, 200)
        self.assertEqual(str(order), f"Order {order.id} by {self.user.email}")

# Testing the Serializers 

User = get_user_model()

class OrderSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="testuser@example.com", password="pass123")
        self.category = Category.objects.create(name="Electronics")
        self.product = Product.objects.create(name= "laptop", price=1500, category=self.category, seller=self.user)
        # Create a cart for the user
        from carts.models import Cart
        Cart.objects.create(user=self.user)

    def _mock_request(self):
        "fake request object to inject user to serializer context"

        class DummyReq:
            user = self.user
        return DummyReq()

    def test_order_serializer_create(self):
        data = {
            "address": "123 Street",
            "city": "Nairobi",
            "postal_code": "00100",
            "country": "Kenya",
            "items": [
                {"product_id": self.product.id, "quantity": 2}
            ]
        }
        serializer = OrderSerializer(data = data , context ={"request":self._mock_request()})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        order = serializer.save()
        self.assertEqual(order.items.count(),1)
        self.assertEqual(order.total_price, 3000)
        