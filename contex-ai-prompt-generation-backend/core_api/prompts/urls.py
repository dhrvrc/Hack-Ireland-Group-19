from rest_framework.routers import DefaultRouter

from . import views

app_name = "prompts"
router = DefaultRouter()

router.register(r"prompts", views.PromptViewSet, basename="prompt")

urlpatterns = router.urls
