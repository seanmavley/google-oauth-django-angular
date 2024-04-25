from django.urls import path
from main.views import GoogleLoginApi

urlpatterns = [
      path("login/google/", GoogleLoginApi.as_view(), 
         name="login-with-google"),
]