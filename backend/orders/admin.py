from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user","address","total_price","created_at")
    list_filter = ("is_paid","created_at")
    search_fields =("user__email",)
    inlines  = [OrderItemInline]