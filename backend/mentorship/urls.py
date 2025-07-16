from django.urls import path

from .views import MentorshipOpportunitiesView, SendMentorshipRequestView, ManageMentorshipRequestView, ListMentorshipRequests, UserMatchesView, ManageMentorshipView

urlpatterns = [
    #For getting prospective mentors
    path("opportunities/", MentorshipOpportunitiesView.as_view(), name="mentorship-opportunities"),
    path("opportunities/refresh/", MentorshipOpportunitiesView.as_view(), name="new-mentorship-opportunities"),
    #For getting the user's matches - Mentor/Mentee
    path("mentor/matches/", UserMatchesView.as_view(), name="mentor-matches"),
    #For mentorship requests
    path("requests/", ListMentorshipRequests.as_view(), name="user-mentorship-requests"),
    path("request/send/<int:mentor_id>/", SendMentorshipRequestView.as_view(), name="send-mentorship-request"),
    path("requests/<int:request_id>/<str:action>/", ManageMentorshipRequestView.as_view(), name="manage-mentorship-requests"),
    #For managing mentorships
    path("<int:match_id>/<str:action>/", ManageMentorshipView.as_view(), name="manage-mentorship"),
]