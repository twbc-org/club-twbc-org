from tendenci.settings import *

import io
import os
from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("DEBUG", False)
if DEBUG:
    disable_template_cache()

SECRET_KEY = os.getenv("SECRET_KEY")
SITE_SETTINGS_KEY = os.getenv("SITE_SETTINGS_KEY")

ALLOWED_HOSTS = [
    'club.twbc.org',
    'club.twbc.page',
    '*',
    'localhost',
    '127.0.0.1']

DATABASES['default']['HOST'] = os.getenv("PGHOST")
DATABASES['default']['NAME'] = os.getenv("PGDATABASE")
DATABASES['default']['PASSWORD'] = os.getenv("PGPASSWORD")
DATABASES['default']['PORT'] = os.getenv("PGPORT", 5432)
DATABASES['default']['USER'] = os.getenv("PGUSER")

CACHES['default']['LOCATION'] = os.getenv('CACHE_LOCATION','127.0.0.1:11211')
CACHES['default']['BACKEND'] = os.getenv('CACHE_BACKEND', 'django.core.cache.backends.dummy.DummyCache')

TIME_ZONE = 'US/Central'
ROOT_URLCONF = 'conf.urls'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = False
EMAIL_HOST = os.getenv("EMAIL_HOST", 'smtp.gmail.com')
EMAIL_PORT = os.getenv("EMAIL_PORT", 25)
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")

# Logging
## We need to set these to something that exists even with disabled logging
set_app_log_filename('/tmp/app.log')
set_debug_log_filename('/tmp/debug.log')
disable_app_log()
disable_debug_log()
# Enable console (i.e. container) logging
enable_console_log()
set_console_log_level(os.getenv('LOG_LEVEL','INFO'))

# These lines must remain at the end of this file
from tendenci.apps.registry.utils import update_addons  # noqa: E402
INSTALLED_APPS = update_addons(INSTALLED_APPS, SITE_ADDONS_PATH)
