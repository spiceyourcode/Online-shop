from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsBuyerOrReadOnly

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsBuyerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product']

    def get_queryset(self):
        return Review.objects.all().order_by("created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
