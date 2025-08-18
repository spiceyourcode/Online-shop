from django.db import models
from django.conf import settings
from products.models import Product

User = settings.AUTH_USER_MODEL

#  This is the cart model - one per user 
class Cart(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"cart of {self.user.username}"

    @property
    def total_price(self):
        # calculating the total price
        return sum(item.subtotal for item in self.items.all())
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "product") #this is to avoid duplicate items

    def  __str__(self):
        return f"{self.quantity} x {self.product.name}"
    
    @property 
    def subtotal(self):
        #calculating the subtotal p * q
        return self.product.price *self.quantity
    


