import stripe
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY 

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = IsAuthenticated

    def create(self, request, *args, **kwargs):
        try:
            order_id = request.data.get("order_id")
            order = order.objects.get(id = order_id, user = request.user)

            #creating the paymentIntent 
            intent = stripe.PaymentIntent.create(
                amount = int(order.total_amount * 100), #convert to cents
                currency= "ksh",
                metadata= {"order_id":order.id}
            )
            payment = payment.objects.create(
                order = order, 
                user = request.user , 
                stripe_payment_intent = intent["id"],
                amount = order.total_amount,
                currency = "ksh",
                status = "created"
            )

            return Response({
                "client_secret": intent["clinet_secret"],
                "payment":PaymentSerializer(payment).data
            }, status = status.HTTP_201_CREATED)

        except Order.DoesNotExist:
            return Response({"error":"Order not found or not yours"}, status=404)
    
    def update(self, request ,*args, **kwargs):
        """ Webhook or client confirmation updates payment status."""
        instance = self.get_object()
        status_val = request.data.get("status")

        if status_val:
            instance.status = status_val
            instance.save()
        return Response(PaymentSerializer(instance).data)