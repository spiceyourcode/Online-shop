from django.db import models
from django.conf import settings
from products.models import Product

User = settings.AUTH_USER_MODEL

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="revies")
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name="reviews")
    rating = models.IntegerField(default=1)
    comment= models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user","product") # 1 review per user per product 
    
    def __str__(self):
        return f"{self.product.name}-{self.rating}/5"