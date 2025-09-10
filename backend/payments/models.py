from django.db import models
from django.conf import settings 
from orders.models import Order 

class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    stripe_payment_intent = models.CharField(max_length=255,blank=True,null=True)
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    currency = models.CharField(max_length=10, default= "ksh")
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at =models.DateTimeField(auto_now_add =True)

    def __str__(self):
        return f"payment {self.id} - {self.status}"