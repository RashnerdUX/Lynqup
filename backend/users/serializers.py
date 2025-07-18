from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
import logging

from users.utils import register_for_social
from users.social_auth.google import validate_google_token
from users.models import UserProfile

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

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer of the User Profile
    """
    class Meta:
        model= UserProfile
        fields='__all__'



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

    def validate_auth_token(self, value):
        user_info = validate_google_token(value)
        logger.info(f"Here's the info gotten - {user_info}")

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
    

#For managing passwords
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists:
            raise serializers.ValidationError("No user found with this email address.")
        return value
    
    def save(self):
        user_email = self.validated_data['email']
        user = User.objects.get(email=user_email)
        if user.is_active:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{settings.PASSWORD_RESET_CONFIRM_URL}/?uid:{uid}&token:{token}"

            print(reset_url)


            send_mail(
            'Password Reset Request',
            f'Please click the following link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
            )


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("The two password fields didn't match.")
        try:
            uid = force_bytes(urlsafe_base64_decode(data['uid'])).decode()
            self.user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid user ID.")

        if not default_token_generator.check_token(self.user, data['token']):
            raise serializers.ValidationError("Invalid reset token.")

        return data

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.save()