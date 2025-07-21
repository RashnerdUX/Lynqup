from django.db.models.signals import post_save
from django.dispatch import receiver
import logging

from .utils import notify_user
from .models import Notification

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Notification)
def realtime_notification_signal(sender, instance, created, **kwargs):
    logger.info(f"Signal received for Notification ID: {instance.id}, Created: {created}")
    if created:
        try:
            notification_content = {
                "notification_id": instance.id,
                "message": instance.content,
                "link": instance.link,
                "notification_object": instance.related_type
            }
            logger.info(f"Calling notify_user for {instance.user.username} with content: {notification_content}")
            notify_user(username=instance.user.username, content=notification_content)
            logger.info(f"notify_user completed for Notification ID: {instance.id}")
        except Exception as e:
            logger.error(f"Error in realtime_notification_signal for Notification ID {instance.id}: {e}", exc_info=True)
