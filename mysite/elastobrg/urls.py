from django.urls import path
from . import views

app_name = 'elastobrg'

urlpatterns = [
    path('elastoIL', views.ElastBrgIL.as_view(), name="elastoIL"),
]
