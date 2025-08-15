from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsSellerOrReadOnly(BasePermission):
    """
    Read for all; write only for authenticated users with is_seller or is_staff    
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (getattr(user, "is_seller", False) or user.is_staff))
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        # Allow sellers to edit their own products, or staff to edit any
        return bool(user and user.is_authenticated and (user.is_staff or obj.seller_id ==user.id))
    