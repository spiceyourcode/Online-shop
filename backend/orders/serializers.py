from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializers

class OrderItemSerializer(serializers.ModelSerializer):
    product= ProductSerializers(read_only= True)
    product_id = serializers.IntegerField(write_only=True) #Allows the client to send product ID 

    class Meta:
        model = OrderItem
        fields = ["id","product", "product_id", "quantity","price", "subtotal"]
        read_only_files= ["id","subtotal","price"]

class OrderSerialzer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True) # Nested list of items 
    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "address",
            "city",
            "postal_code",
            "country",
            "total_price",
            "is_paid",
            "created_at",
            "updated_at",
            "items",
        ]
        read_only_fields = ["id", "user", "total_price", "is_paid", "created_at", "updated_at"]

        def create(self, validated_data):
            # extracting the order items 
            items_data = validated_data.pop("items")
            user = self.context["request"].user 
            order = Order.objects.create(user = user, **validated_data)
            total =0 

            for item in items_data:
                product_id = item.pop("product_id")
                quantity = item.get("quantuty", 1)
                price = item.get("price") or order.user.cart.filter(product_id= product_id).first().product.price
                order_item = OrderItem.objects.create(
                    order= order,
                    product_id= product_id, 
                    quantity= quantity, 
                    price =price,
                )
                total+=order_item.subtotal
            order.total_price = total
            order.save()
            return order
            