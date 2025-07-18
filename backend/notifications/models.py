from django.db import models

from users.models import CustomUser

# Create your models here.
class Notification(models.Model):
    """
    Use this to create a notification for the following resources in the database
    - Mentorship request
    - Mentorship acceptance
    - New Mentorship recommendation
    """
    #Below are the lists of notifications for the app
    MENTORSHIP_REQUESTED = "mentorship_requested"
    REQUEST_ACCEPTED = "request_accepted"
    MENTORSHIP_RECOMMENDATION = "mentorship_recommendation"
    #This is a growing list

    RELATED_TYPE_CHOICES = [
        (MENTORSHIP_REQUESTED, 'Mentorship Requested'),
        (REQUEST_ACCEPTED, 'Request Accepted'),
        (MENTORSHIP_RECOMMENDATION, 'Mentorship Recommendation'),
    ]
        
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    related_to_id = models.IntegerField(help_text="This is the id number of the object for which the notification was created")
    related_type = models.CharField(max_length=50, choices=RELATED_TYPE_CHOICES, help_text="This refers to the type of notification")
    content = models.TextField(help_text="This is the actual message being sent with the notification")
    link = models.URLField(blank=True, null=True, help_text="This is a routing link to take user to where they'll take an action based on the notification")
    is_read = models.BooleanField(default=False, help_text="Determines if the notification has been seen by the user")
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the notification was created")

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['related_type', 'related_to_id']),
        ]

    def __str__(self):
        return f"Notification to {self.user.username}"
    
    def mark_as_read(self):
        self.is_read = True
        self.save()
        return True

class NotificationPreference(models.Model):
    """
    This class determines the type of notifications that the user will receive 
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notification_preferences")
    notification_type = models.CharField(max_length=50, choices=Notification.RELATED_TYPE_CHOICES)
    enabled = models.BooleanField(default=True)

    class Meta:
        unique_together = ("user", "notification_type")

    def __str__(self):
        return f"{self.user.username} would like to reecive notifications pertaining to this - {self.notification_type}"