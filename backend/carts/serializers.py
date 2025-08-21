from rest_framework import serializers
from .models import Cart, CartItem 
from products.serializers import ProductSerializers

# handles each product in the cart 
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializers(read_only = True)
    product_id = serializers.IntegerField(write_only = True)

    class Meta:
        model = CartItem
        fields= ['id', 'product', 'product_id','quantity','subtotal']

# returns the cart with the items and the total price 
class CartSerializer(serializers.ModelSerializer):

    items= CartItemSerializer(many=True, read_only=True)
    class Meta:
        model = Cart
        fields = ['id','items','total_price']