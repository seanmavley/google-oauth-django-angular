import os
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework import status
import django.utils.timezone as timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from dotenv import load_dotenv
load_dotenv()

CLIENT_ID = os.environ.get('GOOGLE_OAUTH2_CLIENT_ID')

def generate_tokens_for_user(user):
    """
    Generate access and refresh tokens for the given user
    """
    serializer = TokenObtainPairSerializer()
    token_data = serializer.get_token(user)
    access_token = token_data.access_token
    refresh_token = token_data
    return access_token, refresh_token


class GoogleLoginApi(APIView):
    permission_classes = [AllowAny]

    def get(request, *args, **kwargs):
        return Response({
            'message': 'Response'
        }, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        google_jwt = request.data.get('jwt')
        print(google_jwt)
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            idinfo = id_token.verify_oauth2_token(
                google_jwt, requests.Request(), CLIENT_ID)

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            user_id = idinfo['sub']
            user_email = idinfo['email']
            # Verify that the access token is valid for this app.
            if idinfo['aud'] != CLIENT_ID:
                raise ValueError('Wrong client ID.')

            # Check if user exists in the database
            try:
                user = User.objects.get(email=user_email)
                user.last_login = timezone.now()
                user.save()
                # Generate access and refresh tokens for the user
                access_token, refresh_token = generate_tokens_for_user(user)
                response_data = {
                    'user': UserSerializer(user).data,
                    'access_token': str(access_token),
                    'refresh_token': str(refresh_token)
                }
                return Response(response_data)
            except User.DoesNotExist:
                username = user_email.split('@')[0]
                first_name = idinfo.get('given_name', '')
                last_name = idinfo.get('family_name', '')
                photo = idinfo.get('photoUrl', '')

                user = User.objects.create(
                    username=username,
                    email=user_email,
                    first_name=first_name,
                    last_name=last_name,
                    registration_method='google',
                    photo=photo,
                )

                access_token, refresh_token = generate_tokens_for_user(user)
                response_data = {
                    'user': UserSerializer(user).data,
                    'access_token': str(access_token),
                    'refresh_token': str(refresh_token)
                }
                return Response(response_data)

        except ValueError:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)
