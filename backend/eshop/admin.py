from django.contrib import admin
from products.models import Product, Category
from carts.models import Cart, CartItem
from orders.models import Order, OrderItem
from reviews.models import Review
from payments.models import Payment

# Product Admin 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name","category","price","stock","available","created_at")
    list_filter = ("category","available","created_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug":("name",)}

#Category Admin
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name','created_at')
    search_fields = ('name',)

#Cart Admin 
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user','created_at', 'updated_at')
    inlines = [CartItemInline]

#OrderAdmin
class OrderItemInLine(admin.TabularInline):
    model = OrderItem
    extra = 1

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status','total_price','created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInLine]

#Review Admin
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product','user','rating','created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('product__name', 'user__username')

#Payment Admin 
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order','payment_method','amount','status','created_at')
    list_filter = ('status','payment_method','created_at')
    search_fields = ('order_id', 'payment_method')