from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models  import Category,Product
from .serializers import CategorySerializer, ProductSerializers
from .permissions import IsSellerOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsSellerOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["name"]
    search_fields =["name"]
    ordering_fields =["name"]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category","seller").all()
    serializer_class = ProductSerializers
    permission_classes = [IsSellerOrReadOnly]
    parser_classes = [MultiPartParser,FormParser] #  MPP supports image upload
    lookup_field = "slug"

    filterset_fields ={
        "category__slug":["exact"],
        "brand": ["exact", "icontains"],
        "price": ["gte","lte"]
    }
    search_fields = ["name","description","brand"]
    ordering_fields = ["created_at","price","name"]

    def perform_create(self,serializer):
        serializer.save() #seller injected in serializer.create via request
    
    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx