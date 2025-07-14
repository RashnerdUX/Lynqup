from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import authenticate
from django.conf import settings
from typing import Dict

from rest_framework_simplejwt.tokens import RefreshToken

class CustomUser(AbstractUser):
    email = models.EmailField(
        "email address",
        unique=True,
        blank=False,
        error_messages={"unique": "A user with that email already exists."}
    )

    username = models.CharField(
        max_length=150,
        unique=True,
        blank=False,
        error_messages={"unique": "A user with that username already exists."}
    )

    auth_provider = models.CharField(
        max_length=255,
        blank=False,
        null=False,
        default=settings.AUTH_PROVIDERS.get('email')
    )

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    def get_user_auth_token(self) -> Dict[str, str]:
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def is_in_group(self, group_name):
        return self.groups.filter(name=group_name).exists()

    @property
    def is_mentor(self):
        return self.is_in_group("Mentor")

    @property
    def is_mentee(self):
        return self.is_in_group("Mentee")

#Refactored User model to make matching easier
class UserProfile(models.Model):
    MENTOR = "mentor"
    MENTEE = "mentee"
    ROLE_CHOICES = {
        MENTOR: "MENTOR",
        MENTEE:"MENTEE",
    }

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # Skills
    skills = models.ManyToManyField("Skill", blank=True)

    # Avatar
    profile_image = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Socials
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    dribble_url = models.URLField(blank=True, null=True)
    behance_url = models.URLField(blank=True, null=True)
    portfolio_site = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

        