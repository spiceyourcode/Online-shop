from django.test import TestCase
from django.contrib.auth import get_user_model
from products.models import Product, Category
from .models import Cart, CartItem
from decimal import Decimal

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

    # Additional comprehensive tests
    def test_cart_item_str(self):
        """Test string representation of Cart item"""
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        self.assertEqual(str(item), f"{item.quantity} x {self.product.name}")

    def test_cart_item_belongs_to_user(self):
        """Ensure cart item is linked to correct user"""
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)
        self.assertEqual(item.cart.user.email, "testuser@example.com")

    def test_cart_item_total_price(self):
        """Check that total price is calculated correctly"""
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        expected_total = Decimal("2000.00")  # 2 x 1000.00
        self.assertEqual(item.subtotal, expected_total)

    def test_add_more_quantity(self):
        """Ensure quantity updates correctly"""
        item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        item.quantity += 1
        item.save()
        self.assertEqual(item.quantity, 3)

    def test_cart_item_deletes_when_user_deleted(self):
        """Ensure cart items are removed if user is deleted"""
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)
        self.assertEqual(CartItem.objects.count(), 1)
        self.user.delete()
        self.assertEqual(CartItem.objects.count(), 0)

    def test_cart_item_deletes_when_product_deleted(self):
        """Ensure cart items are removed if product is deleted"""
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=1)
        self.assertEqual(CartItem.objects.count(), 1)
        self.product.delete()
        self.assertEqual(CartItem.objects.count(), 0)

    def test_cart_multiple_items_total(self):
        """Ensure multiple cart items can calculate total"""
        # Create second product
        product2 = Product.objects.create(
            name="Phone",
            price=500,
            category=self.category,
            seller=self.user
        )
        
        # Create cart items
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        CartItem.objects.create(cart=self.cart, product=product2, quantity=3)
        
        total = self.cart.total_price
        expected_total = Decimal("3500.00")  # 2000 + 1500
        self.assertEqual(total, expected_total)

    def test_cart_empty_total(self):
        """Test that empty cart has zero total"""
        self.assertEqual(self.cart.total_price, 0)

    def test_cart_item_subtotal_with_decimal(self):
        """Test subtotal calculation with decimal prices"""
        product = Product.objects.create(
            name="Mouse",
            price=Decimal("29.99"),
            category=self.category,
            seller=self.user
        )
        item = CartItem.objects.create(cart=self.cart, product=product, quantity=3)
        expected_subtotal = Decimal("89.97")  # 29.99 * 3
        self.assertEqual(item.subtotal, expected_subtotal)
