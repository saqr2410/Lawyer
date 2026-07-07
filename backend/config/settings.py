
from pathlib import Path
import os
from datetime import timedelta
import dj_database_url


BASE_DIR = Path(__file__).resolve().parent.parent


# =========================
# SECURITY
# =========================

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "dev-only-change-me"
)

DEBUG = os.environ.get("DEBUG", "False") == "True"


ALLOWED_HOSTS = [
    ".onrender.com",
    "localhost",
    "127.0.0.1",
]


# =========================
# APPLICATIONS
# =========================

INSTALLED_APPS = [

    "corsheaders",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",


    # Third party
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "drf_spectacular",


    # Local apps
    "accounts",
    "clients",
    "cases",
    "hearings.apps.HearingsConfig",
    "documents",
    "payments",
    "notifications",
    "dashboard",
]



# =========================
# MIDDLEWARE
# =========================

MIDDLEWARE = [

    "corsheaders.middleware.CorsMiddleware",

    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]



# =========================
# URL CONFIG
# =========================

ROOT_URLCONF = "config.urls"

WSGI_APPLICATION = "config.wsgi.application"



# =========================
# TEMPLATES
# =========================

TEMPLATES = [

    {
        "BACKEND":
            "django.template.backends.django.DjangoTemplates",

        "DIRS": [],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.debug",

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",

            ],
        },
    },
]



# =========================
# DATABASE
# =========================

DATABASES = {

    "default": dj_database_url.config(

        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",

        conn_max_age=600,

    )
}



# =========================
# USER MODEL
# =========================

AUTH_USER_MODEL = "accounts.User"



# =========================
# REST FRAMEWORK
# =========================

REST_FRAMEWORK = {

    "DEFAULT_AUTHENTICATION_CLASSES": (

        "rest_framework_simplejwt.authentication.JWTAuthentication",

    ),


    "DEFAULT_PERMISSION_CLASSES": (

        "rest_framework.permissions.AllowAny",

    ),


    "DEFAULT_FILTER_BACKENDS": (

        "django_filters.rest_framework.DjangoFilterBackend",

    ),


    "DEFAULT_SCHEMA_CLASS":

        "drf_spectacular.openapi.AutoSchema",


    "DEFAULT_RENDERER_CLASSES": (

        "rest_framework.renderers.JSONRenderer",

    ),
}



# =========================
# JWT
# =========================

SIMPLE_JWT = {

    "ACCESS_TOKEN_LIFETIME":

        timedelta(hours=12),


    "REFRESH_TOKEN_LIFETIME":

        timedelta(days=7),


    "AUTH_HEADER_TYPES":

        ("Bearer",),

}



# =========================
# CORS
# =========================

CORS_ALLOW_ALL_ORIGINS = True


CORS_ALLOW_CREDENTIALS = True


CORS_ALLOW_HEADERS = [

    "content-type",

    "authorization",

    "accept",

    "origin",

    "x-requested-with",

]


CORS_ALLOW_METHODS = [

    "GET",

    "POST",

    "PUT",

    "PATCH",

    "DELETE",

    "OPTIONS",

]



# =========================
# STATIC
# =========================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


STATICFILES_STORAGE = (

    "whitenoise.storage.CompressedManifestStaticFilesStorage"

)



# =========================
# MEDIA
# =========================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"



# =========================
# SECURITY HEADERS
# =========================

SECURE_PROXY_SSL_HEADER = (

    "HTTP_X_FORWARDED_PROTO",

    "https",

)


SESSION_COOKIE_SECURE = not DEBUG

CSRF_COOKIE_SECURE = not DEBUG



# =========================
# LANGUAGE
# =========================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Africa/Cairo"

USE_I18N = True

USE_TZ = True



# =========================
# DEFAULT FIELD
# =========================

DEFAULT_AUTO_FIELD = (

    "django.db.models.BigAutoField"

)

