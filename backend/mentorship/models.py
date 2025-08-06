from django.db import models
from django.conf import settings
from django.db.models import Q

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

class Mentorship(models.Model):
    """
    This is the model that contains all user matches. If a mentor is considered best for a user and the user sends a MentorShip Request then a Mentorship entry is created in the DB with status of PENDING. Once the mentor accepts the request, the status becomes ACTIVE. If revoked by the mentor then the request becomes CANCELLED and it's deleted for space issues. 
    """

    PENDING = "PE"
    ACTIVE = "AC"
    CANCELLED = "CN"
    COMPLETED = "CM"

    status_choices = {
        PENDING: "pending",
        ACTIVE: "active",
        CANCELLED: "cancelled",
        COMPLETED: "completed"
    }
    mentor = models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name="mentor_matches", on_delete=models.CASCADE)
    mentee = models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name="mentee_matches", on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=status_choices, help_text="Used to monitor matches between mentor and mentee")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.mentee.username} wants to be mentored by {self.mentor.username}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["mentor", "mentee"], 
                condition=Q(status="AC"), 
                name="unique_active_match"
            )
        ]
    
    def activate_mentorship(self):
        if self.status == self.PENDING:
            self.status = self.ACTIVE
            self.save()
            return True
        return False
    
    def end_mentorship(self):
        if self.status == self.ACTIVE:
            self.status = self.COMPLETED
            return True
        return False

    def cancel_mentorship(self):
        if self.status == self.ACTIVE:
            self.status = self.CANCELLED
            self.save()
            #TODO: Might delete the match too but let's keep to find out why the mentorship had to end
            return True
        return False
    

class MentorshipRequest(models.Model):
    PENDING = "P"
    ACCEPTED = "A"
    DECLINED = "D"

    STATUS_UPDATE = [
    (PENDING, "Pending"),
    (ACCEPTED, "Accepted"),
    (DECLINED, "Declined"),
    ]

    mentee = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="sent_mentor_requests",on_delete=models.CASCADE)
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="received_mentor_requests",on_delete=models.CASCADE)
    message = models.CharField(max_length=255, help_text="The reason why the mentee intends to match with the mentor", blank=True, null=True)
    status = models.CharField(max_length=1, choices=STATUS_UPDATE, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.mentee.username} would like {self.mentor.username} to be their mentor"
    
    def accept_request(self):
        if self.status == self.PENDING:
            self.status = self.ACCEPTED
            #Once the request has been accepted, update the Match object that was created when a request was sent
            match = Mentorship.objects.get_or_create(mentor=self.mentor, mentee=self.mentee, status=Mentorship.PENDING)
            #Get the mentorship object that's created and change its status to "ACTIVE"
            match[0].activate_mentorship()
            self.save()
            return True 
        return False
    
    def deny_request(self):
        if self.status == self.PENDING:
            self.status = self.DECLINED
            self.save()
            return True
        return False
    
    def revoke_request(self, sender):
        if self.status == self.PENDING and self.mentee == sender:
            self.delete()
            return True
        return False

