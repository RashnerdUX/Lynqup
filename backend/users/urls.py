from django.urls import path
from rest_framework import routers

from users.views import RegisterView, LoginView, EmailConfirmationView, GoogleSignInView, UserProfileView


router = routers.DefaultRouter()
router.register(r'profile',UserProfileView, basename="user-profile")

urlpatterns=[
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('confirm-email/<uidb64>/<token>/', EmailConfirmationView.as_view(), name='email-confirm'),
    path('auth/google/', GoogleSignInView.as_view(), name="google-sign-in"),
]

#Add the url patterns to the application
urlpatterns += router.urls