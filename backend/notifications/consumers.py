from channels.generic.websocket import AsyncJsonWebsocketConsumer
import logging

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

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name, self.channel_name
            )
        logger.info("Websocket has been closed successfully")

    async def receive(self, text_data):
        #This function will not receive anything from the websocket
        pass

    async def send_notification(self, event):
        """
        This sends a notification to the user. 

        Args:
            event (Dict): This is the Python dict that's going to be sent to the channel group
        """
        notification = event['content']

        #Encode to JSON with this send method for the frontend
        self.send_json(content=notification)
        logger.info(f"Notification sent to user")

        
