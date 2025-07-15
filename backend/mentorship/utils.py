from django.contrib.auth import get_user_model
from sentence_transformers import SentenceTransformer, util

from users.models import UserProfile, CustomUser

User = get_user_model()

#This will contain all code related to the matching algorithm
matching_criteria = {
    #This is a must match for both parties
    "filters" : {},

    #This is then used to determine the better match
    "scoring_categories" :{
        "skills": {"weight": 0.35},
        "experience_level": {"weight": 0.1},
        "industry": {"weight": 0.15},
        "career_goal": {"weight": 0.35},
        "title": {"weight":0.05}
    }
}

def getMatchesForUser (user, limit=20):
    """Takes a user's id and limit of the results needed

    Args:
        user_id (User Model): The user who's logged in
        limit (int, optional): The limit of mentors to return. Defaults to 20.

    Returns:
        _type_: _description_
    """
    mentee = user
    potential_matches = []

    mentor_list = User.objects.filter(profile__role=UserProfile.MENTOR).select_related("profile").only("id", "username", "profile__title", "profile__industry", "profile__profile_image")

    for mentor in mentor_list:
        match_rating = calculateMatchScore(mentee=mentee, mentor=mentor)
        potential_matches.append(
            {"mentor": mentor, "rating": match_rating}
            )

    # Sort by match_rating descending
    potential_matches.sort(key=lambda x: x["rating"], reverse=True)

    processed_matches = []
    for match in potential_matches[:limit]:
        mentor_user = match["mentor"]
        mentor_match_rating = match["rating"]

        processed_matches.append(
            {
                "mentor": {
                        "title": mentor_user.profile.title,
                        "industry": mentor_user.profile.industry,
                        "profile_image": (
                            mentor_user.profile.profile_image.url if mentor_user.profile.profile_image else None
                        )},
                "mentor_username": mentor_user.username,
                "rating": mentor_match_rating,
            }
        )

    # Return the top 'limit' mentors
    return processed_matches


def calculateMatchScore(mentee:CustomUser, mentor:CustomUser):
    total_score = 0

    #Get each individual scores and multiply by their weight
    skill_score = calculateSkillsMatch(mentee=mentee.profile, mentor=mentor.profile) * matching_criteria["scoring_categories"]["skills"]["weight"]

    career_score = calculateCareerTrajectoryMatch(mentee=mentee.profile, mentor=mentor.profile) * matching_criteria["scoring_categories"]["career_goal"]["weight"]

    experience_score = calculateExperienceMatch(mentee=mentee.profile, mentor=mentor.profile) * matching_criteria["scoring_categories"]["experience_level"]["weight"]

    industry_score = calculateIndustryMatch(mentee=mentee.profile, mentor=mentor.profile) * matching_criteria["scoring_categories"]["industry"]["weight"]

    title_score = calculateTitleMatch(mentee=mentee.profile, mentor=mentor.profile) * matching_criteria["scoring_categories"]["title"]["weight"]

    total_score = skill_score + career_score + experience_score + industry_score + title_score

    return total_score


def get_semantic_similarity(text1:str, text2:str):
    """An utility function to find the similarity between two pieces of text

    Args:
        text1 (str): The first text
        text2 (str): The second text

    Returns:
        float: A number from 0 - 1 that represents how similar both texts are
    """
    #Need to add for debugging
    text1_safe = text1 if text1 is not None else ""
    text2_safe = text2 if text2 is not None else ""

    #Define the ML model that Sentence Transformer will use
    model = SentenceTransformer("all-MiniLM-L6-v2")

    #Create their vector embeddings
    text1_embedding = model.encode(text1_safe, convert_to_tensor=True)
    text2_embedding = model.encode(text2_safe, convert_to_tensor=True)

    similarity_score = util.cos_sim(text1_embedding, text2_embedding)

    #Get the similarity score
    return float(similarity_score)


def calculateSkillsMatch(mentor:UserProfile, mentee:UserProfile):

    mentor_skills = set(mentor.skills.values_list('name', flat=True))
    mentee_skills = set(mentee.skills.values_list('name', flat=True))

    #If either of them have no skills listed
    if (len(mentor_skills) or len(mentee_skills)) == 0:
        return 0
    
    #If both parties have skills then we get a list of common skills
    #Using Jaccard Similarity
    #First the intersection of both
    intersection_of_skills = mentee_skills & mentor_skills
    #Then the union of both
    union_of_skills = mentee_skills | mentor_skills

    if union_of_skills == 0 or intersection_of_skills == 0:
        return 0

    return (len(intersection_of_skills)/len(union_of_skills)) * 100


def calculateCareerTrajectoryMatch(mentor:UserProfile, mentee:UserProfile):

    #Get the data that I plan to compare
    mentor_career_summary = mentor.career_summary
    mentee_career_goal = mentee.career_goal

    #Determine their similarity
    similarity_score = get_semantic_similarity(mentee_career_goal, mentor_career_summary)

    return similarity_score * 100


def calculateExperienceMatch(mentor:UserProfile, mentee:UserProfile):
    #Get the experience level of each

    mentor_experience_level = mentor.experience_level
    mentee_experience_level = mentee.experience_level

    if mentor_experience_level == UserProfile.EXPERT:
        return 100
    
    if mentee_experience_level == UserProfile.BEGINNER and mentor_experience_level == UserProfile.INTERMEDIATE:
        return 75
    
    if (mentee_experience_level and mentor_experience_level) == UserProfile.INTERMEDIATE:
        return 50
    
    if mentor_experience_level == UserProfile.BEGINNER:
        return 25


def calculateIndustryMatch(mentor:UserProfile, mentee:UserProfile):
    if mentor.industry == mentee.industry:
        return 100
    #This is a fallback if they are from different industries
    # Check for overlapping skill categories
    mentor_skill_categories = set(getattr(skill, 'category', None) for skill in mentor.skills.all())
    mentee_skill_categories = set(getattr(skill, 'category', None) for skill in mentee.skills.all())
    if mentor_skill_categories & mentee_skill_categories:
        return 50
    # Check for exact matching skills
    mentor_skills = set(mentor.skills.all())
    mentee_skills = set(mentee.skills.all())
    if mentor_skills & mentee_skills:
        return 25
    
    #Return 0 if they have no matching skills and they're from different industries
    return 0


def calculateTitleMatch(mentor:UserProfile, mentee:UserProfile):
    similarity_score = get_semantic_similarity(text1=mentee.title, text2=mentor.title)

    return similarity_score * 100






