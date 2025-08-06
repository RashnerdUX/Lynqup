from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import authenticate
from django.conf import settings
from typing import Dict

from rest_framework_simplejwt.tokens import RefreshToken
from mentorship.models import Skills

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
    #Role of User
    MENTOR = "mentor"
    MENTEE = "mentee"
    ROLE_CHOICES = {
        MENTOR: "MENTOR",
        MENTEE:"MENTEE",
    }

    #Experience level
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    EXPERT = "expert"
    EXPERIENCE_LEVELS ={
        BEGINNER : "BEGINNER",
        INTERMEDIATE: "INTERMEDIATE",
        EXPERT: "EXPERT"
    }

    # Industry Choices
    TECH = "tech"
    DESIGN = "design"
    BUSINESS = "business"
    MARKETING = "marketing"
    FINANCE = "finance"
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    LEGAL = "legal"
    ENGINEERING = "engineering"
    ARTS = "arts"
    OTHER = "other"
    INDUSTRIES = {
        TECH: "Tech",
        DESIGN: "Design",
        BUSINESS: "Business",
        MARKETING: "Marketing",
        FINANCE: "Finance",
        EDUCATION: "Education",
        HEALTHCARE: "Healthcare",
        LEGAL: "Legal",
        ENGINEERING: "Engineering",
        ARTS: "Arts",
        OTHER: "Other",
    }

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, help_text="Tell us a little bit about yourself")
    title = models.CharField(max_length=100, help_text="What's the user's current job title?")
    career_summary = models.TextField(blank=True, null=True, help_text="What has this user done over the course of their career?")
    experience_level = models.CharField(max_length=15, choices=EXPERIENCE_LEVELS)
    career_goal = models.CharField(max_length=500, help_text="Where does the user want to be in 5 years?")
    industry = models.CharField(max_length=50, choices=INDUSTRIES, help_text="Where does this user work or intend to work")
    role = models.CharField(max_length=6, choices=ROLE_CHOICES, blank=True, help_text="Is the user a mentor or mentee?")
    country = models.CharField(max_length=100, blank=True)


    # Skills
    skills = models.ManyToManyField(to=Skills, blank=True, related_name="skills_list")

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

        