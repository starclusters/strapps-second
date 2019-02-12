from django.urls import path
from . import views

app_name = 'pmrectangle'

urlpatterns = [
    path('', views.Pmrect.as_view(), name="pmrect"),
]
