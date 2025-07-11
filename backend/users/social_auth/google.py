from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings

WEB_CLIENT_ID = settings.GOOGLE_CLIENT_ID

# (Receive token by HTTPS POST)
# ...

def validate_google_token(token):
    """
    Used to verify Google ID Token
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