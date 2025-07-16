from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
import os # For environment variables, if you use them for BASE_URL

"""
Store global utility functions for sending mail from the backend    
"""
def send_email(
    subject_template_name,
    body_template_name,
    to_email,
    context,
    from_email=None,
    reply_to=None,
    attachments=None,
    html_template_name=None, # Optional: for dedicated HTML template
    text_template_name=None, # Optional: for dedicated plain text template
):
    """
    Abstracted function to send an email with both plain text and HTML content.

    Args:
        subject_template_name (str): Path to the template for the email subject.
                                     This template should ideally contain only
                                     the subject text.
        body_template_name (str): Path to the plain text template for the email body.
        to_email (list or str): Recipient email address(es).
        context (dict): Dictionary of context variables to pass to the templates.
        from_email (str, optional): Sender email address. Defaults to settings.DEFAULT_FROM_EMAIL.
        reply_to (list or str, optional): Reply-To email address(es).
        attachments (list, optional): List of (filename, content, mimetype) tuples.
        html_template_name (str, optional): Path to the HTML template for the email body.
                                            If not provided, body_template_name is used for HTML too.
        text_template_name (str, optional): Path to the plain text template.
                                            If not provided, body_template_name is used.
    """
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    # Ensure to_email is a list
    if not isinstance(to_email, (list, tuple)):
        to_email = [to_email]

    # Render the subject
    subject = render_to_string(subject_template_name, context).strip()

    # Determine which templates to use for body
    final_text_template_name = text_template_name if text_template_name else body_template_name
    final_html_template_name = html_template_name if html_template_name else body_template_name

    # Render the plain text and HTML content
    text_content = render_to_string(final_text_template_name, context)
    html_content = render_to_string(final_html_template_name, context)

    msg = EmailMultiAlternatives(
        subject,
        text_content,
        from_email,
        to_email,
        reply_to=reply_to
    )
    msg.attach_alternative(html_content, "text/html")

    if attachments:
        for attachment in attachments:
            msg.attach(*attachment) # Unpack (filename, content, mimetype)

    try:
        msg.send()
        print(f"Email '{subject}' sent successfully to {', '.join(to_email)}")
    except Exception as e:
        print(f"Error sending email '{subject}' to {', '.join(to_email)}: {e}")

# Helper to get base URL for links in emails (e.g., from environment or settings)
def get_base_url():
    # Attempt to get from environment variable first for flexibility
    base_url = os.environ.get('BASE_URL', None)
    if not base_url and hasattr(settings, 'BASE_URL'):
        base_url = settings.BASE_URL
    
    if not base_url:
        print("WARNING: BASE_URL is not set in environment or settings. Email links might be broken.")
        # Fallback to a placeholder or raise an error depending on your needs
        return "http://localhost:8000" # A common development fallback
    return base_url