from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from typing import Dict

def notify_user(username:str, content:Dict):
    """
    This will send a real time notification to the user through a websocket connection

    Args:
        username (str): The username of the authenticated user/user receiving the notification
        content (Dict): A dictionary containing all the information needed by the frontend to craft the notification
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"notify-{username}",
        {
            "type": "send_notification", 
            "content": content           
        }
    )