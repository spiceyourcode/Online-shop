from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart
    
    def list(self, request):
        cart = self.get_cart(request.user)
        serializer =CartSerializer(cart)
        return Response(serializer.data)
    
    def create(self,request):
        """ adding the product to cart """
        cart = self.get_cart(request.user)
        serializer = CartItemSerializer(data= request.data)
        if serializer.is_valid():
            product = Product.objects.get(id = serializer.validated_data['product_id'])
            item, created = CartItem.objects.get_or_create(
                cart = cart, product = product, 
                defaults= {'quantity':serializer.validated_data['quantity']}
            )
            if not created:
                item.quantity += serializer.validated_data['quantity']
                item.save()
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, pk =None):
        "updating the qquntity of the cart item "

        cart = self.get_cart(request.user)
        try:
            item= CartItem.object.get(cart= cart, pk = pk )
        except CartItem.DoesNotExist:
            return Response({"error":"Item not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CartItemSerializer(item, data = request.data, partial= True)

        if serializer.is_valid():
            serializer.save()
            return Response(CartSerializer(cart).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request , pk =None):
        "this is for removing the items  in the cart "

        cart = self.get_cart(request.user)
        try:
            item = CartItem.objects.get(cart = cart, pk = pk)
            item.delete()
            return Response(CartSerializer(cart).data)
        except CartItem.DoesNotExist:
            return Response({"error":"Item not found"}, status=status.HTTP_404_NOT_FOUND)


 