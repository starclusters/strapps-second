from django.urls import path
from . import views

app_name = 'bridgeinfo'

urlpatterns = [
    path('tollway', views.Bridgeinfo.as_view(), name="tollway"),
]
