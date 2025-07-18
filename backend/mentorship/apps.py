from django.apps import AppConfig
import os


class MentorshipConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mentorship'

     # Class variable to hold the loaded model
    sentence_transformer_model = None

    #Needed to add this because the ML models that sentence_transformers use are too heavy for my Render plan
    def ready(self):
        # The ready() method is called when Django starts up.
        # It's crucial to put imports for heavy libraries here to avoid
        # import-time side effects during schema generation or other initializations.

        # --- Important considerations for `ready()` ---
        # 1. Avoid direct database access here, as the database might not be ready.
        #    (Not an issue for loading a local ML model).
        # 2. Be aware that `ready()` can be called multiple times in development
        #    (e.g., by `runserver`'s auto-reloader). For production, it's called once per worker.
        #    The `os.environ.get('RUN_MAIN')` check is a common way to guard against
        #    duplicate execution in development, but it's not strictly necessary for
        #    this model loading if your `if` condition for `None` handles it.

        if not os.environ.get('RUN_MAIN'):
            # This check helps prevent the model from loading twice during `runserver`
            # and when running certain management commands where it's not needed.
            # In production (e.g., with Gunicorn), RUN_MAIN is usually not set in the parent process,
            # but is set in the forked worker processes. This often means the model loads once
            # per worker after the fork.

            # Ensure model is only loaded once per process
            if MentorshipConfig.sentence_transformer_model is None:
                try:
                    # Import the necessary libraries here, not at the top of the file
                    from sentence_transformers import SentenceTransformer
                    # from transformers import AutoTokenizer, AutoModel # Example if you needed more control

                    print("Loading SentenceTransformer model...")
                    # Load your specific model. Replace 'all-MiniLM-L6-v2' with your model name.
                    MentorshipConfig.sentence_transformer_model = SentenceTransformer('all-MiniLM-L6-v2')
                    print("SentenceTransformer model loaded successfully!")

                except ImportError:
                    print("Error: sentence-transformers not installed. Please install it.")
                    # Optionally, raise an exception or set a flag to indicate model not loaded
                except Exception as e:
                    print(f"Error loading SentenceTransformer model: {e}")
                    # Handle other potential loading errors (e.g., model not found)
