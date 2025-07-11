from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth import authenticate
import logging

from users.utils import register_for_social
from users.social_auth.google import validate_google_token

#Get the user model
User = get_user_model()
#Get Web Client
WEB_CLIENT_ID = settings.GOOGLE_CLIENT_ID
#Set logger
logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user model"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        extra_kwargs = {'password': {'write_only': True}}


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False  # Defer activation until email confirmation
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        #This will authenticate the user
        user_email = data.get('email')
        user_username = data.get('username')
        password = data.get('password')
        if data.get('email'):
            user = authenticate(email=user_email, password=password)
        elif data.get('username'):
            user = authenticate(username=user_username, password=password)
        else:
            raise serializers.ValidationError("Email or username is required.")
        
        if user and user.is_active:
            return user
        if user and not user.is_active:
            raise serializers.ValidationError("Account not activated.")
        raise serializers.ValidationError("Invalid credentials.")


class GoogleAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField(min_length=1)

    def validate_access_token(self, value):
        logger.info(f'Here is the id token - {value}')
        user_info = validate_google_token(value)

        if not user_info:
            raise serializers.ValidationError('Invalid token')
        
        if user_info.get('aud') != WEB_CLIENT_ID:
            logger.info("User is trying to authorzie with unknown app")
            raise serializers.ValidationError('Client authorizing the signup is unknown')
        
        email = user_info['email']
        name = user_info['name']
        provider = settings.AUTH_PROVIDERS.get('google')
        
        return register_for_social(
            email=email,
            name=name,
            provider=provider,
        )