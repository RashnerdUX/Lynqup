import jwt
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from asgiref.sync import sync_to_async


@sync_to_async
def get_user_for_token(token):
    """
    Validates the token and returns the user.
    This runs synchronously in a thread-safe way.
    """
    try:
        validated_token = JWTAuthentication().get_validated_token(token)
        return JWTAuthentication().get_user(validated_token)
    except (InvalidToken, TokenError, jwt.DecodeError):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using JWT.
    The token must be passed as a query param: ws://...?token=...
    """

    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            user = await get_user_for_token(token[0])
        else:
            user = AnonymousUser()

        scope["user"] = user
        close_old_connections()

        return await super().__call__(scope, receive, send)
