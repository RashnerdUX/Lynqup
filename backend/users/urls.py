from django.urls import path
from users.views import RegisterView, LoginView, EmailConfirmationView, GoogleSignInView

urlpatterns=[
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('confirm-email/<uidb64>/<token>/', EmailConfirmationView.as_view(), name='email-confirm'),
    path('auth/google/', GoogleSignInView.as_view(), name="google-sign-in"),
]