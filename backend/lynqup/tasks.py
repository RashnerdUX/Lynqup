from celery import shared_task
from .emails import send_email

@shared_task
def send_email_generic_task(
    subject_template_name,
    body_template_name,
    to_email,
    context,
    from_email=None,
    reply_to=None,
    attachments=None,
    html_template_name=None,
    text_template_name=None,
):
    """
    A generic Celery task to send any email defined by templates.
    """
    send_email(
        subject_template_name,
        body_template_name,
        to_email,
        context,
        from_email,
        reply_to,
        attachments,
        html_template_name,
        text_template_name,
    )