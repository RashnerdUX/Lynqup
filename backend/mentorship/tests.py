from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from users.models import UserProfile
from mentorship.models import Skills, SkillCategory
from mentorship.utils import getMatchesForUser
from mentorship.serializers import MatchResultsSerializer

# Create your tests here.

User = get_user_model()

class MatchingTestCase(TestCase):
    def setUp(self):
        #Career goal for mentee
        career_goal:str = "Aiming to be a Senior AI/ML Engineer in healthcare, specializing in ethical explainable AI for predictive diagnostics & personalized treatment. I'll lead cross-functional teams, productionize ML models, grasp regulatory frameworks, and bridge tech-med communication gaps."
        career_summary:str = "As a Principal Machine Learning Engineer with over 15 years of experience, I've dedicated the last decade to pioneering the application of artificial intelligence in healthcare. My expertise lies in architecting, building, and deploying robust, scalable, and interpretable AI systems that have significantly improved diagnostic accuracy and patient outcomes. I've successfully led multiple engineering teams, navigating the complexities of medical data compliance (e.g., HIPAA) and collaborating closely with clinical experts to translate cutting-edge research into tangible, real-world solutions. My current focus includes advancing explainable AI (XAI) methodologies to ensure transparency and trust in critical healthcare applications"
        # Create skill categories
        cat1 = SkillCategory.objects.create(name="Programming")
        cat2 = SkillCategory.objects.create(name="Design")
        # Create skills
        skill1 = Skills.objects.create(name="Python", category=cat1)
        skill2 = Skills.objects.create(name="UI Design", category=cat2)
        # Create mentor user
        self.mentor = User.objects.create_user(username="mentor1", email="mentor1@example.com", password="pass")
        self.mentor_profile = UserProfile.objects.create(user=self.mentor, title="Senior ML Engineer", experience_level="expert", industry="tech", role="mentor", career_summary=career_summary)
        self.mentor_profile.skills.add(skill1)
        # Create mentee user
        self.mentee = User.objects.create_user(username="mentee1", email="mentee1@example.com", password="pass")
        self.mentee_profile = UserProfile.objects.create(user=self.mentee, title="Junior Python Developer", experience_level="beginner", industry="tech", role="mentee", career_goal=career_goal)
        self.mentee_profile.skills.add(skill1)
        # Create another mentor with different skills/industry
        self.mentor2 = User.objects.create_user(username="mentor2", email="mentor2@example.com", password="pass")
        self.mentor2_profile = UserProfile.objects.create(user=self.mentor2, title="Designer", experience_level="expert", industry="design", role="mentor")
        self.mentor2_profile.skills.add(skill2)

    def test_get_matches_for_user(self):
        matches = getMatchesForUser(self.mentee)
        print(matches)
        
        self.assertTrue(len(matches) > 0)
        # Mentor1 should be a better match than mentor2
        self.assertGreater(matches[0]["rating"], matches[-1]["rating"])
        self.assertEqual(matches[0]["mentor_username"], "mentor1")

    def test_match_results_serializer(self):
        matches = getMatchesForUser(self.mentee)
        serializer = MatchResultsSerializer(data=matches, many=True)
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        data = serializer.validated_data
        # Check that expected fields are present
        for item in data:
            self.assertIn("mentor_username", item)
            self.assertIn("rating", item)
            self.assertIn("mentor", item)
        print("MatchResultsSerializer output:", serializer.data)

class MentorMatchAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="mentee2", email="mentee2@example.com", password="pass")
        self.profile = UserProfile.objects.create(user=self.user, title="Junior Dev", experience_level="beginner", industry="tech", role="mentee")
        self.client.force_authenticate(user=self.user)

    def test_mentor_match_api(self):
        response = self.client.get("/api/v1/mentor/matches/")
        print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("matches", response.data)
        # Should return a list
        self.assertIsInstance(response.data["matches"], list)
