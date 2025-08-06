from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group

from users.models import UserProfile

@receiver(post_save, sender=UserProfile)
def assign_user_group(sender, instance, **kwargs):
    """
    Add user to his desired group once he/she saves their profile

    Args:
        sender (UserProfile): The model class that sends the request
        instance (UserProfile): The object that was just created from the model class
    """
    group, _ = Group.objects.get_or_create(name=instance.role)
    instance.user.groups.clear()
    instance.user.groups.add(group)
