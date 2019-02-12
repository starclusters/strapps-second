from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth import get_user_model
from pmcircle.models import Thoughts
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .forms import CustomUserCreationForm
User = get_user_model()

class SignUp(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'account/signup.html'

@login_required(login_url='/users/login/')
def dashboard(request):
    user_thoughts = Thoughts.objects.all().filter(user_id=request.user.id)

    context = {
    'thoughts': user_thoughts
    }

    return render(request,'account/dashboard.html', context)
