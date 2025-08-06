from celery import shared_task

from .models import Notification

@shared_task
def create_notification_task(user_id, related_type, related_to_id, content, link=None):
    """
    Create a notification
    """
    Notification.objects.create(
        user_id=user_id,
        related_type=related_type,
        related_to_id=related_to_id,
        content=content,
        link=link
    )

