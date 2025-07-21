from channels.generic.websocket import AsyncJsonWebsocketConsumer
import logging
from channels.db import database_sync_to_async

from .models import Notification

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            logger.info("User is anonymous so web socket will close")
            await self.close()
        else:
            self.group_name = f"notify-{self.user.username}" #This is the name of the group the user is listening to
            await self.channel_layer.group_add(
                self.group_name, self.channel_name
            )
            await self.accept()
            logger.info(f"{self.user.username} connected to WebSocket.")
            logger.info(f"{self.group_name} created for WebSocket.")

            # Send undelivered notifications
            await self.send_undelivered_notifications()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name, self.channel_name
            )
            logger.info(f"{self.user.username} disconnected from WebSocket.")
            logger.info(f"{self.user.username} left {self.group_name}")
        
        logger.info("Websocket has been closed successfully")

    async def receive(self, text_data):
        #This function will not receive anything from the websocket
        pass
    
    async def receive_json(self, content, **kwargs):
        message_type = content.get("type")

        if message_type == "ack_notification":
            notification_id = content.get("notification_id")
            await self.mark_notification_delivered(notification_id)
            logger.info(f"User received the notification {notification_id}")

    async def send_notification(self, event):
        """
        This sends a notification to the user. 

        Args:
            event (Dict): This is the Python dict that's going to be sent to the channel group
        """
        notification = event['content']

        #Encode to JSON with this send method for the frontend
        self.send_json(content=notification)
        logger.info(f"Notification sent to user via websocket: {notification}")

    async def send_undelivered_notifications(self):
        """
        Send all undelivered notifications for the user on connect
        """
        notifications = await database_sync_to_async(
            lambda: list(Notification.objects.filter(user=self.user, is_delivered=False))
        )()

        for notification in notifications:
            await self.send_json({
                "type": "notification",
                "notification_id": str(notification.id),
                "message": notification.content,
                "link": notification.link,
                "notification_object": notification.related_type
            })

            logger.info(f"Resent undelivered notification {notification.id} to {self.user.username}")

    async def mark_notification_delivered(self, notification_id):
        """
        Mark a notification as delivered when the client ACKs
        """
        try:
            notification = await database_sync_to_async(Notification.objects.get)(id=notification_id)
            if notification.user == self.user:
                notification.is_delivered = True
                await database_sync_to_async(notification.save)()
                logger.info(f"Notification {notification_id} acknowledged by {self.user.username}")
            else:
                logger.warning(f"User {self.user.username} tried to ACK notification they don't own.")
        except Notification.DoesNotExist:
            logger.warning(f"ACK received for unknown notification ID: {notification_id}")

