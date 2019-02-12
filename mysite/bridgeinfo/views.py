from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
class Bridgeinfo(TemplateView):
    template_name = "bridgeinfo/tollway.html"
