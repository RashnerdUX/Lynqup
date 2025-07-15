from django.urls import path

from .views import MentorMatchView

urlpatterns = [
    path("matches/", MentorMatchView.as_view(), name="user-matches"),
    path("matches/refresh/", MentorMatchView.as_view(), name="new-mentor-matches"),
]