from rest_framework.routers import DefaultRouter

from . import views

app_name = "prompts"
router = DefaultRouter()

router.register(r"", views.PromptsViewSet, basename="prompts")

urlpatterns = router.urls
