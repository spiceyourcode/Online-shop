from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsBuyerOrReadOnly(BasePermission):
    """
    Read for all; write only for authenticated users with is_customer (buyers)
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and getattr(user, "is_customer", False))
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        # Allow buyers to edit their own reviews, or staff to edit any
        return bool(user and user.is_authenticated and (user.is_staff or obj.user_id == user.id))
