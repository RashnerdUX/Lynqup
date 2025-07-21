from django.db.models.signals import post_save
from django.dispatch import receiver

from .utils import notify_user
from .models import Notification

@receiver(post_save, sender=Notification)
def realtime_notification_signal(sender, instance, created, **kwargs):
    if created:
        notification_content = {
            "message": instance.content,
            "link": instance.link,
            "notification_object": instance.related_type
        }
        notify_user(username=instance.user.username, content=notification_content)
        