from rest_framework import serializers
from .models import Skills, UserSkills
from users.models import UserProfile

class Skills(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ["name", "category"]


#These are the custom serializers for the matches
class MentorMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["title", "industry", "profile_image"]

class MatchResultsSerializer(serializers.Serializer):
    mentor = MentorMatchSerializer()
    mentor_username = serializers.CharField(max_length=255)
    rating = serializers.FloatField()