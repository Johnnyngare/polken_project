import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'polken_survey.settings')
application = get_wsgi_application()

# Increase timeout and buffer size
os.environ['WSGI_TIMEOUT'] = '300' 
os.environ['WSGI_MAX_MEMORY'] = '2048'

from whitenoise import WhiteNoise
class CustomWhiteNoise(WhiteNoise):
   def __init__(self, *args, **kwargs):
       kwargs.setdefault('max_age', 31536000)
       super().__init__(*args, **kwargs)
       
application = CustomWhiteNoise(application, root=os.path.join(os.path.dirname(__file__), '..', 'static'))