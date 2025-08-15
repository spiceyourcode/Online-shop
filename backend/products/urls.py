from rest_framework.routers import DefaultRouter 
from .views import CategoryViewSet , ProductViewSet

router = DefaultRouter()
router.register(r"categories",CategoryViewSet,basename="category")
router.register(r"products",ProductViewSet,basename="product")

urlpatterns = router.urls
