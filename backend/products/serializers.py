from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id","name", "slug"]

class ProductSerializers(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id= serializers.PrimaryKeyRelatedField(
        source = "category", queryset= Category.objects.all(),write_only=True
    )
    
    class Meta:
        model = Product
        fields =["id", "name","slug","brand","description","price", "stock","image","rating", "num_reviews","category","category_id","seller","created_at","updated_at"]
        read_only_fields =["slug","seller","rating","num_reviews","created_at", "updated_at"]
    
    def create(self,validated_data):
        # seller = request.user
        request = self.context.get("request")
        validated_data["seller"] = request.user
        return super().create(validated_data)
    