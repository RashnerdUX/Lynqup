from django.urls import path

from .views import UserNotificationsView, MarkNotificationAsReadView, MarkAllNotificationsAsReadView, NotificationPreferenceListUpdateView

urlpatterns = [
    path("user/", UserNotificationsView.as_view(), name="user-notifcations"),
    path("<int:pk>/read/", MarkNotificationAsReadView.as_view(), name="mark-notification-as-read"),
    path("read_all/", MarkAllNotificationsAsReadView.as_view(), name="mark-all-notifications-as-read"),
    path("preferences/", NotificationPreferenceListUpdateView.as_view(), name="notification-preferences"),
]