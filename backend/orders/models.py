from django.db import models
from django.conf import settings
from products.models import Product

# orders model 

class Order(models.Model):
    STATUS_CHOICES =[
        ('PENDING','pending'),
        ('PAID','paid'),
        ('SHIPPED','shipped'),
        ('DELIVERED','delivered'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete= models.CASCADE,
        related_name="orders"
    )
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    total_price = models.DecimalField(max_digits=10,decimal_places=2, default=0.00)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"
    
    # order item model 
class OrderItem(models.Model):
    order = models.ForeignKey(
       Order,
       on_delete=models.CASCADE,
       related_name="items"
    )
    product = models.ForeignKey(
        Product, 
        on_delete= models.CASCADE
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}" 
    
    @property
    def subtotal(self):
        return self.quantity * self.price
    
class ShippingAddress(models.Model):
    order= models.OneToOneField(Order, on_delete=models.CASCADE,related_name="shipping_address")
    full_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    city= models.CharField(max_length=100)
    postal_code= models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone= models.CharField(max_length=20)
    
    def __str__(self):
        return f"Shipping for Order {self.order.id}"

class Payment(models.Model):
    # made a change here 
    Order= models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment_order")
    provider = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100,unique=True)
    status = models.CharField(max_length=50, default="INITIATED")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.status}"