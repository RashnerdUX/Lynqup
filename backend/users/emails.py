from lynqup.emails import send_email, get_base_url
from django.urls import reverse

from .tasks import send_welcome_email_task, send_email_confirmation_task, send_password_reset_email_task

def send_welcome_email(user_id):
    """
    Sends a welcome email to a new user.
    """
    send_welcome_email_task.delay(user_id)

def send_email_confirmation(user_id, confirmation_url):
    """
    Sends an email confirmation to a new user.
    """
    send_email_confirmation_task.delay(user_id=user_id,confirmation_url=confirmation_url)

def send_password_reset_email(user_id, reset_url):
    """
    Sends a password reset email to a user.
    """
    send_password_reset_email_task.delay(user_id=user_id, reset_url=reset_url)