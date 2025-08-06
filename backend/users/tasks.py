from celery import shared_task
from lynqup.emails import send_email, get_base_url
from django.urls import reverse
from django.shortcuts import get_object_or_404

from .models import CustomUser

@shared_task
def send_welcome_email_task(user_id):
    """
    Sends a welcome email to a new user.
    """
    user = get_object_or_404(CustomUser, pk=user_id)
    context = {
        'user': user,
        'dashboard_url': f"{get_base_url()}{reverse('dashboard')}",
        'year': 2025, # Example dynamic data
    }
    
    send_email(
        subject_template_name='email_templates/welcome/subject.txt',
        body_template_name='email_templates/welcome/body.txt', # Plain text fallback
        html_template_name='email_templates/welcome/body.html',
        to_email=user.email,
        context=context,
    )

@shared_task
def send_email_confirmation_task(user_id, confirmation_url):
    """
    Sends an email confirmation to a new user.
    """
    user = get_object_or_404(CustomUser, pk=user_id)
    context = {
        'user': user,
        'confirmation_url': confirmation_url,
        'year': 2025,
    }
    
    send_email(
        subject_template_name='email_templates/email-confirmation/subject.txt',
        body_template_name='email_templates/email-confirmation/body.txt',
        html_template_name='email_templates/email-confirmation/body.html',
        to_email=user.email,
        context=context,
    )

@shared_task
def send_password_reset_email_task(user_id, reset_url):
    """
    Sends a password reset email to a user.
    """
    user = get_object_or_404(CustomUser, pk=user_id)
    context = {
        'user': user,
        'reset_url': reset_url,
        'year': 2025,
    }
    send_email(
        subject_template_name='email_templates/password-reset/subject.txt',
        body_template_name='email_templates/password-reset/body.txt',
        html_template_name='email_templates/password-reset/body.html',
        to_email=user.email,
        context=context,
    )