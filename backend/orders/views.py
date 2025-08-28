from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, ShippingAddress, Payment
from .serializers import OrderSerializer, ShippingAddressSerializer, PaymentSerializer

class OrderViewSet(viewsets.ModelViewSet):
    """
    Handles Order CRUD:
    - User can create & view their own orders
    - Admin can view all orders
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path="my_orders")
    def my_orders(self, request):
        """Custom endpoint for logged-in user's orders"""
        orders = Order.objects.filter(user=request.user)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_shipping(self, request, pk=None):
        order = self.get_object()
        serializer = ShippingAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=["post"])
    def add_payment(self, request, pk=None):
        order = self.get_object()
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            order.status = "PAID"
            order.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        order = self.get_object()
        if not request.user.is_staff:
            return Response({"detail": "Forbidden"}, status=403)
        new_status = request.data.get("status")
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Invalid status"}, status=400)
        order.status = new_status
        order.save()
        return Response(OrderSerializer(order).data)
