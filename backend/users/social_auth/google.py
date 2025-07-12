from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

WEB_CLIENT_ID = settings.GOOGLE_CLIENT_ID

# (Receive token by HTTPS POST)
# ...

def validate_google_token(token):
    """
    Used to verify Google ID Token

    Args:
        token: Google ID token

    Returns:
        Dict [str, str]:{
            iss (str): The link to the auth provider
            azp (str): The app identifier
            aud (str): The Google Client ID
            sub (str): Google User id
            at_hash (str): The hash
            name(str): Name of the Google user
            picture (url): Link to User's current profile picture
            given_name(str): User's first name
            family_name(str): User's last name
            iat (int): Expiry for access token
            exp(int): Expiry for the token 
        }
    """
    try:
        # Specify the WEB_CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), WEB_CLIENT_ID)

        if  idinfo['iss'] in ['accounts.google.com', 'https://accounts.google.com']:
            return idinfo
        
    except ValueError:
        # Invalid token
        return None
    
    except Exception as e:
        return {"error": f"There was an error authenticating the token - {str(e)}"}