from django.shortcuts import render

from rest_framework import permissions, views, status
from rest_framework.response import Response
from .utils import getMatchesForUser

from .serializers import MatchResultsSerializer

# Create your views here.

class MentorMatchView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        user_matches = getMatchesForUser(user=request.user)
        serialized = MatchResultsSerializer(data=user_matches, many=True)
        if serialized.is_valid():
            #TODO: Might consider caching matches for the user to make the POST request faster
            return Response(data=serialized.data, status=status.HTTP_200_OK)
        return Response(data=serialized.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        user_matches = None
        #So if the user wants more matches then we allow it
        if request.query_params['limit']:
            results_limit = request.query_params['limit']
            user_matches = getMatchesForUser(user=request.user, limit=results_limit)
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
    
