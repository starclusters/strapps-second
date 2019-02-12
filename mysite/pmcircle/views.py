from django.views.generic import TemplateView
from django.views.generic import CreateView
from .models import Thoughts, Book, Pmcircleinput, Pmcloadcase, Pmcproject
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .forms import ThoughtForm, ThoughtFormset, PmcircleForm, PmcloadcaseForm, PmcprojectForm, load_formset
from django.shortcuts import render
# from django.http import HttpResponseRedirect
# from django.core.urlresolvers import reverse
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from .forms import BookForm
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.forms import inlineformset_factory

# Create your views here.

def PmCircle(request):
    pm_form = PmcircleForm
    project_form = PmcprojectForm
    # pm_load = PmcloadcaseForm
    # load_formset = inlineformset_factory(Pmcircleinput, Pmcloadcase, form=PmcloadcaseForm, can_delete = False, extra=1)
    context = {
    'pm_form': pm_form,
    'pm_load': load_formset,
    'project_form': project_form,
    }
    return render(request, 'pmcircle/pmcircle.html', context)

class ThoughtsCreateView(LoginRequiredMixin, CreateView):
    model = Thoughts
    fields = ('title', 'description')
    login_url='/users/login/'
    success_url = reverse_lazy('users:dashboard')

# this method to make sure that it is saved along with the logged in user
    def form_valid(self, form):
        f = form.save(commit=False)
        f.user = self.request.user
        f.save()
        return super().form_valid(form)

# a function based view to duplicate createview CBV
# @login_required(login_url='/users/login/')
# def CreateThoughts(request):
#     # if this is a POST request we need to process the form data
#     if request.method == 'POST':
#         # create a form instance and populate it with data from the request:
#         form = ThoughtForm(request.POST)
#         # check whether it's valid:
#         if form.is_valid():
#             f = form.save(commit=False)
#             f.user = request.user
#             f.save()
#             # process the data in form.cleaned_data as required
#             # ...  # redirect to a new URL:
#             # return HttpResponseRedirect('users/dashboard/')
#             return redirect('users:dashboard')
#
#     # if a GET (or any other method) we'll create a blank form
#     else:
#         form = ThoughtForm()
#
#     return render(request, 'pmcircle/thoughts_form.html', {'form': form})


# same as avove with formset
# @login_required(login_url='/users/login/')
# def CreateThoughts(request):
#     if request.method == 'POST':
#         formset = ThoughtFormset(request.POST)
#         if formset.is_valid():
#             for form in formset:
#                 f = form.save(commit=False)
#                 f.user = request.user
#                 f.save()
#             return redirect('users:dashboard')
#
#     else:
#         # formset = ThoughtFormset(queryset=Thoughts.objects.none())
#         formset = ThoughtFormset()
#
#     return render(request, 'pmcircle/thoughts_form.html', {'formset': formset})

@login_required(login_url='/users/login/')
def CreateThoughts(request):
    if request.method == 'POST':
        formset = ThoughtFormset(request.POST)
        if formset.is_valid():
            for form in formset.forms:
                if not form.has_changed():
                    continue
                f = form.save(commit=False)
                f.user = request.user
                f.save()
            return redirect('users:dashboard')

    else:
        # formset = ThoughtFormset(queryset=Thoughts.objects.none())
        formset = ThoughtFormset()

    return render(request, 'pmcircle/thoughts_form.html', {'formset': formset})

def book_list(request):
    books = Book.objects.all()
    return render(request, 'pmcircle/book_list.html', {'books': books})

def save_book_form(request, form, template_name):
    data = dict()
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
            books = Book.objects.all()
            data['html_book_list'] = render_to_string('pmcircle/partial_book_list.html', {
                'books': books
            })
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
    else:
        form = BookForm()
    return save_book_form(request, form, 'pmcircle/partial_book_create.html')

@login_required(login_url='/users/login/')
def project_list(request):
    user = request.user
    # projects = Pmcproject.objects.all()
    projects = Pmcproject.objects.filter(user=user)
    # pmcircles = Pmcircleinput.objects.all()
    pmcircles = Pmcircleinput.objects.filter(pmcproject__user=user)

    return render(request, 'pmcircle/project_list.html', {'projects': projects, 'pmcircles':pmcircles})

@login_required(login_url='/users/login/')
def userpmdata(request, project_id):
    pmcircles = Pmcircleinput.objects.get(pmcproject__id=project_id)
    # A ModelForm is designed to display and let you edit one individual object from the DB, not multiple.
    # Thus the 'instance' parameter to a model form is supposed to be one single instance of a model, not a QuerySet.
    pmcircles = Pmcircleinput.objects.get(pmcproject__id=project_id)
    pm_form = PmcircleForm(instance = pmcircles)
    loadcase_formset = inlineformset_factory(Pmcircleinput, Pmcloadcase, form=PmcloadcaseForm, can_delete = True, extra=0)
    pm_load = loadcase_formset(instance=pmcircles)
    project = Pmcproject.objects.get(pk=project_id)
    project_form = PmcprojectForm(instance=project)
    if request.method == 'GET':
        context = {
        'pm_form': pm_form,
        'pm_load': pm_load,
        'project_form': project_form,
        }
        return render(request, 'pmcircle/pmcircle.html', context)

    elif request.method == 'POST':
        data = dict()
        pmcircleform = PmcircleForm(request.POST, instance = pmcircles)
        projectform = PmcprojectForm(request.POST, instance=project)
        if pmcircleform.is_valid() and projectform.is_valid():
            pmcircle = pmcircleform.save()
            project = projectform.save(commit=False)
            project.user = request.user
            project.pmcircleinput = pmcircle
            project.save()
            formset2 = loadcase_formset(instance=pmcircle)
            formset = loadcase_formset(request.POST, instance=pmcircle)
            if formset.is_valid():
                formset.save()
                data['form_is_valid'] = True
            else:
                data['form_is_valid'] = False
        else:
            data['form_is_valid'] = False
        return JsonResponse(data)
    else:
        pass

@login_required(login_url='/users/login/')
def createpmdata(request):
    data = dict()
    if request.method == 'POST':
        pmcircleform = PmcircleForm(request.POST)
        projectform = PmcprojectForm(request.POST)
        if pmcircleform.is_valid() and projectform.is_valid():
            pmcircle = pmcircleform.save()
            project = projectform.save(commit=False)
            project.user = request.user
            project.pmcircleinput = pmcircle
            project.save()
            formset = load_formset(request.POST, instance=pmcircle)
            if formset.is_valid():
                formset.save()
                data['form_is_valid'] = True
            else:
                data['form_is_valid'] = False
        else:
            data['form_is_valid'] = False

        return JsonResponse(data)
    else:
        pass

@login_required(login_url='/users/login/')
def saveaspmdata(request):
    data = dict()
    if request.method == 'POST':
        pmcircleform = PmcircleForm(request.POST)
        projectform = PmcprojectForm(request.POST)
        if pmcircleform.is_valid() and projectform.is_valid():
            pmcircle = pmcircleform.save()
            project = projectform.save(commit=False)
            project.pk = None
            project.user = request.user
            project.pmcircleinput = pmcircle
            project.save()
            formset = load_formset(request.POST, instance=pmcircle)
            if formset.is_valid():
                for form in formset:
                    loadcase = form.save(commit=False)
                    print(loadcase.pk)
                    loadcase.pk = None
                    loadcase.save()
                data['form_is_valid'] = True
            else:
                data['form_is_valid'] = False
        else:
            data['form_is_valid'] = False

        return JsonResponse(data)
    else:
        pass

@login_required(login_url='/users/login/')
def updatepmdata(request, pk):
    pass

@login_required(login_url='/users/login/')
def deletepmdata(request, project_id):
    pmcircle = Pmcircleinput.objects.get(pmcproject__id=project_id)
    pmcircle.delete()
    return redirect('pmcircle:project_list')
