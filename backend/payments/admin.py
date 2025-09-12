from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("user", "order", "amount" , "status","created_at")
    list_filter = ("status",)
    search_fields =("created_at","updated_at")