from celery import shared_task

from .models import Notification
from .utils import notify_user

@shared_task
def create_notification_task(user_id, username, related_type, related_to_id, content, link=None):
    """
    Create a notification
    """
    notification = Notification.objects.create(
        user_id=user_id,
        related_type=related_type,
        related_to_id=related_to_id,
        content=content,
        link=link
    )
    
    notification_content = {
        "notification_id": notification.pk,
        "message": notification.content,
        "link": notification.link,
        "notification_object": notification.related_type #This refers to the action that the notiification was created for
    }

    notify_user(username=username, content=notification_content)
    

