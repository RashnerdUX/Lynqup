from django.db import models
from django.conf import settings

#Get the user
User = settings.AUTH_USER_MODEL

# Create your models here.
class SkillCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Skill Categories"

    def __str__(self):
        return self.name
    
class Skills(models.Model):
    name = models.CharField(max_length=255, unique=True)
    category = models.ForeignKey(to=SkillCategory, on_delete=models.CASCADE, related_name="skills")

    def __str__(self):
        return f"{self.name}"
    
class UserSkills(models.Model):
    BEGINNER = "BE"
    INTERMEDIATE = "IN"
    EXPERT = "EX"
    proficiency_levels = {
        BEGINNER: "Beginner",
        INTERMEDIATE: "Intermediate",
        EXPERT: "Expert"
    }

    user = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="skills")
    skill = models.ForeignKey(to=Skills, on_delete=models.CASCADE, related_name="user_skills")
    proficiency = models.CharField(max_length=2, choices=proficiency_levels,help_text="Pick from beginner, intermediate or expert") #Consider using text although it would affect the matching algo
    is_offered = models.BooleanField(help_text="Tick as True if user can help someone with this")
    is_sought = models.BooleanField(help_text="Tick if the user wants to learn this skill more")

    def __str__(self):
        return f"{self.user} can use {self.skill.name} at this level - {self.proficiency}"

class Matches(models.Model):
    PENDING = "PE"
    ACTIVE = "AC"
    CANCELLED = "CN"
    COMPLETED = "CM"

    status_choices = {
        PENDING: "Pending",
        ACTIVE: "Active",
        CANCELLED: "Cancelled",
        COMPLETED: "Completed"
    }
    mentor_id = models.ForeignKey(to=User, related_name="mentor_matches", on_delete=models.CASCADE)
    mentee_id = models.ForeignKey(to=User, related_name="mentee_matches", on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=status_choices, help_text="Used to monitor matches between mentor and mentee")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
