from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, Category
from .models import Cart, CartItem

User = get_user_model()

class CartModelTest(TestCase):
    def setUp(self):
        # Creating a test user 
        self.user = User.objects.create_user(
            email='testuser@example.com',
            password='password123',
            is_seller=True
        )
        
        # Create a category first
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        
        # creating a test product 
        self.product = Product.objects.create(
            name="laptop",
            price=1000,
            category=self.category,
            seller=self.user
        )
        
        # create a cart for user 
        self.cart = Cart.objects.create(user=self.user)

    def test_add_cart_item(self):
        # add product to cart 
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        self.assertEqual(item.subtotal, 2000)
        self.assertEqual(self.cart.total_price, 2000)

    def test_unique_cart_item(self):
        # add the items once
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)
        # attempt duplicate
        with self.assertRaises(Exception):
            CartItem.objects.create(cart=self.cart, product=self.product, quantity=3)
