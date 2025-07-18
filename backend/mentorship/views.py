from django.shortcuts import get_object_or_404
from django.conf import settings
import logging

from rest_framework import permissions, views, status, generics
from rest_framework.response import Response
from .utils import getMatchesForUser

from users.models import UserProfile, CustomUser
from .serializers import MatchResultsSerializer, MatchSerializer, MentorshipRequestSerializer
from .models import Mentorship, MentorshipRequest
from drf_spectacular.utils import extend_schema

# Create your views here.
logger = logging.getLogger(__name__)

@extend_schema(
    request=None,
    responses={200: MatchResultsSerializer(many=True)},
    description="Get a list of possible mentors for the user."
)
class MentorshipOpportunitiesView(views.APIView):
    """
    GET api/v1/mentorship/opportunities/

    This endpoint provides a list of possible matches for the user

    POST api/v1/mentorship/opportunities/

    This endpoint refreshes the list of possible matches for the user
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        "Returns a list of possible mentors for user"
        user_matches = getMatchesForUser(user=request.user)
        serialized = MatchResultsSerializer(data=user_matches, many=True)
        if serialized.is_valid():
            #TODO: Might consider caching matches for the user to make the POST request faster
            return Response(data=serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        "Refreshes the list of possible mentors for user"
        #So if the user wants more matches then we allow it
        limit = request.query_params.get('limit')
        if limit:
            user_matches = getMatchesForUser(user=request.user, limit=limit)
        else:
            #If no limit is set by user, limit defaults to 20
            user_matches = getMatchesForUser(user=request.user)

        #Debug print
        print(user_matches)

        serialized = MatchResultsSerializer(data=user_matches, many=True)
        if serialized.is_valid():
            return Response(data={
                "refreshed": "True",
                "matches": serialized.data,
            }, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
    request=None,
    responses={200: MatchSerializer(many=True)},
    description="Get the list of matches available to a user."
)
class UserMatchesView(views.APIView):
    """
    GET api/v1/mentorship/mentor/matches/

    This endpoint returns the list of matches available to a user i.e the user has sent a request to the mentor and they're waiting for the request to be accepted or denied
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        logger.info(f"Here's the user making the request: {user.username}")
        logger.info(f"Request data: {request.data}")
        
        if user.profile.role == UserProfile.MENTOR:
            matches = Mentorship.objects.filter(mentor=user)
        elif user.profile.role == UserProfile.MENTEE:
            matches = Mentorship.objects.filter(mentee=user)
        else:
            return Response(
                {"detail": "User role not recognized."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Filter active, pending, completed, etc
        status_filter = request.query_params.get("status")
        if status_filter:  # Fixed: was using 'filter' instead of 'status_filter'
            matches = matches.filter(status=status_filter)

        # Sorting
        sort_by = request.query_params.get("sort")
        if sort_by:
            matches = matches.order_by(sort_by)

        serialized = MatchSerializer(matches, many=True)
        
        if not matches.exists():
            return Response(
                data={"matches": [], "message": "User has no matches"}, 
                status=status.HTTP_200_OK  # Changed from 404 to 200 for empty results
            )
        
        return Response(data=serialized.data, status=status.HTTP_200_OK)
    
@extend_schema(
    request=MentorshipRequestSerializer,
    responses={201: None, 400: None},
    description="Send a mentorship request to a mentor."
)
class SendMentorshipRequestView(views.APIView):
    """
    GET api/v1/mentorship/request/send/<int:mentor_id=1>/

    mentor_id - refers to the mentor that's been chosen by the mentee

    Use this endpoint to manage the mentorships for a user
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, mentor_id):
        mentee = request.user
        mentor = get_object_or_404(CustomUser, pk=mentor_id)
        
        serialized = MentorshipRequestSerializer(data=request.data, context={"request":request, "mentor":mentor})
        if serialized.is_valid():
            MentorshipRequest.objects.create(
                mentee=mentee,
                mentor=mentor,
                message=serialized.validated_data.get("message", ""),
                status=MentorshipRequest.PENDING,
            )
            #TODO: Send a mail to the mentor to alert him that there's a request
            #TODO: Send a live notification to the mentor
            return Response(data={"message":"Mentorship Request sent successfully"}, status=status.HTTP_201_CREATED)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
@extend_schema(
    parameters=[
        {"name": "request_id", "required": True, "type": int, "description": "ID of the mentorship request to manage."},
        {"name": "action", "required": True, "type": str, "description": "Action to take: 'accept' or 'reject'."},
    ],
    request=None,
    responses={200: None, 400: None},
    description="Accept or reject a mentorship request."
)
class ManageMentorshipRequestView(views.APIView):
    """
    GET api/v1/mentorship/requests/<int:request_id=1>/<str:action=''>/

    request_id - refers to the mentorship request that's to be managed
    action - the action to be taken on the mentorship

    Actions
        'accept' - Use this to accept the mentorship request
        'reject' - Use this to deny/reject a mentorship request

    Use this endpoint to manage the mentorships for a user
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, request_id, action):
        logger.info(f"Request ID: {request_id}, Action: {action}")
        logger.info(f"Request user: {request.user}")
        logger.info(f"Request data: {request.data}")

        mentorship_request = get_object_or_404(MentorshipRequest, pk=request_id)

        #Ensure the user is the mentor
        if request.user != mentorship_request.mentor:
            return Response(data={"message":"User is not allowed to edit this request"})

        #Check if an action has already been taken
        if mentorship_request.status in [MentorshipRequest.ACCEPTED, MentorshipRequest.DECLINED]:
            return Response({"message":"You have already taken an action on this request. Mentee has to request again"}, status=status.HTTP_400_BAD_REQUEST)
    
        #Ensure action is in lower case
        action_lower = action.lower()

        if action_lower == "accept":
            #TODO: Add an email functionality here
            if mentorship_request.accept_request():
                return Response(data={"message":"Request has been accepted", "request_status":mentorship_request.status}, status=status.HTTP_200_OK)
            else:
                return Response(
                    data={"message": "Failed to accept request"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        elif action_lower == "reject":
            if mentorship_request.deny_request():
                return Response(data={"message":"Request has been denied", "request_status":mentorship_request.status}, status=status.HTTP_200_OK)
            else:
                return Response(
                    data={"message": "Failed to deny request"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(data={"message":"Invalid action. Please 'accept' or 'deny' request"}, status=status.HTTP_400_BAD_REQUEST)
        
@extend_schema(
    request=None,
    responses={200: None, 400: None},
    description="List mentorship requests sent and received by the user."
)
class ListMentorshipRequests(views.APIView):
    """
    GET api/v1/mentorship/requests/

    Use this endpoint to retrieve the mentorship requests that a user has.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            sent_requests = MentorshipRequest.objects.filter(mentee=request.user).select_related("mentor")
            received_requests = MentorshipRequest.objects.filter(mentor=request.user).select_related("mentee")

            sent_data = [
                {
                    'id': req.pk,
                    'mentor': req.mentor.username,
                    'status': req.status,
                    'message': req.message,
                    'created_at': req.created_at
                } for req in sent_requests
            ]
            received_data = [
                {
                    'id': req.pk,
                    'mentee': req.mentee.username,
                    'status': req.status,
                    'message': req.message,
                    'created_at': req.created_at
                } for req in received_requests
            ]
            return Response(
                data={
                    "sent_requests": sent_data,
                    "received_requests": received_data,
                }, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(data={"message":"There was an error getting requests list", "error":e}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    parameters=[
        {"name": "match_id", "required": True, "type": int, "description": "ID of the mentorship match to manage."},
        {"name": "action", "required": True, "type": str, "description": "Action to take: 'end' or 'cancel'."},
    ],
    request=None,
    responses={200: None, 400: None},
    description="End or cancel an active mentorship match."
)
class ManageMentorshipView(views.APIView):
    #TODO: Use this format for other API Views Docstrings
    """
    POST api/v1/mentorship/<match_id e.g 1>/<action e.g 'end'>/
    
    Actions: 
        'end' - To end/complete a mentorship
        'cancel' - To cancel a mentorship

    Note: Activation of mentorship is done by the Mentor when he accepts a request so don't try to use this endpoint
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, match_id, action):
        """
        Used for ending or cancelling an active mentorship match. Pass action and match_id in the request url
        """
        user = request.user

        if not match_id or not action:
            return Response({"message": "match_id and action are required."}, status=400)

        match = get_object_or_404(Mentorship, pk=match_id)

        # Ensure the user is part of the match
        if user != match.mentor and user != match.mentee:
            return Response({"message": "You're not authorized to modify this match."}, status=403)

        # End or complete the mentorship
        if action == "end":
            if match.end_mentorship():
                return Response({"message": "Mentorship ended successfully."}, status=200)
            return Response({"message": "Mentorship not active or already ended."}, status=400)
        elif action == "cancel":
            if match.cancel_mentorship():
                return Response({"message": "Mentorship cancelled."}, status=200)
            return Response({"message": "Mentorship not active or cannot be cancelled."}, status=400)

        else:
            return Response({"message": "Invalid action. Use 'end' or 'cancel'."}, status=400)

