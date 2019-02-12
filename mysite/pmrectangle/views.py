from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.
class Pmrect(TemplateView):
    template_name = "pmrectangle/pmrect.html"
