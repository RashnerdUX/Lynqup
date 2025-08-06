from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Skills, UserSkills
from users.models import UserProfile

from mentorship.models import Mentorship, MentorshipRequest

class Skills(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ["name", "category"]

class MatchSerializer(serializers.ModelSerializer):
    status = serializers.CharField(required=False)
    class Meta:
        model = Mentorship
        fields = ["mentor", "mentee", "status"]

class MentorshipRequestSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=False)
    status = serializers.CharField(required=False)
    class Meta:
        model = MentorshipRequest
        fields = ["message", "status"]

    def validate(self, attrs):
        mentee = self.context["request"].user
        mentor = self.context.get("mentor")

        #Ensure user is not a mentee
        if mentee.groups.filter(name="Mentee").exists():
            raise serializers.ValidationError("User is not a Mentee")
        
        #Ensure there's no current match between mentee and mentor
        #This will also inform us if they have an active request to the mentor
        if Mentorship.objects.filter(mentee=mentee, mentor=mentor).exists():
            raise serializers.ValidationError("Mentee has already tried to match with Mentor. Please check for pending requests or active matches")
        
        return super().validate(attrs)

#These are the custom serializers for the mentor opportunities
class MentorMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["title", "industry", "profile_image"]

class MatchResultsSerializer(serializers.Serializer):
    mentor = MentorMatchSerializer()
    mentor_username = serializers.CharField(max_length=255)
    rating = serializers.FloatField()