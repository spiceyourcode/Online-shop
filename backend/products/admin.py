from django.contrib import admin
from .models import Category , Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name","slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "brand", "price", "stock", "category", "seller", "created_at")
    list_filter =("category", "brand", "created_at")
    search_fields = ("name", "brand", "description")
    autocomplete_fields =("category", "seller")
    readonly_fields = ("created_at", "updated_at")
    