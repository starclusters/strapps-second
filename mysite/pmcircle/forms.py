# from django.forms import ModelForm
from pmcircle.models import Thoughts, Book, Pmcircleinput, Pmcloadcase, Pmcproject
from django import forms
# from django.forms import formset_factory
from django.forms import modelformset_factory, inlineformset_factory

class ThoughtForm(forms.ModelForm):
    class Meta:
        model = Thoughts
        fields = ['title', 'description']

ThoughtFormset = modelformset_factory(Thoughts, fields=('title', 'description'), extra=2)

class PmcircleForm(forms.ModelForm):
    class Meta:
        model = Pmcircleinput
        tippy_clearcover = ' <i class="fas fa-info-circle d-print-none" title="cover to tie/spirals"></i>'
        tippy_numberofbars = ' <i class="fas fa-info-circle d-print-none" title="min. 6 bars recommended"></i>'

        labels = {
        "section_dia": "Section diameter (in)",
        "clear_cover": "Concrete clear cover (in)" + tippy_clearcover,
        "number_bar": "Number of bars" + tippy_numberofbars,
        "trans_bar_size": "Transverse bar size",
        "main_bar_size": "Main bar size",
        "f_c": "f'c (ksi)",
        "f_y": "fy (ksi)",
        "Es": "Es (ksi)",
        "transv_type": "Transverse reinforcement",
        }

        numberwidget = forms.NumberInput(attrs={'class': 'form-control',})
        selectwidget = forms.Select(attrs={'class': 'form-control',})

        widgets = {
        "design_code": selectwidget,
        "section_dia": forms.NumberInput(attrs={'class': 'form-control', 'id': 'di'}),
        "clear_cover": forms.NumberInput(attrs={'class': 'form-control', 'id': 'rc'}),
        "number_bar": forms.NumberInput(attrs={'class': 'form-control', 'id': 'nb'}),
        "trans_bar_size": forms.Select(attrs={'class': 'form-control', 'id': 'ts'}),
        "main_bar_size": forms.Select(attrs={'class': 'form-control', 'id': 'bs'}),
        "f_c": forms.NumberInput(attrs={'class': 'form-control', 'id': 'fc'}),
        "f_y": forms.NumberInput(attrs={'class': 'form-control', 'id': 'fy'}),
        "Es": forms.NumberInput(attrs={'class': 'form-control', 'id': 'E'}),
        "transv_type": forms.Select(attrs={'class': 'form-control', 'id': 'tie'})
        }

        # help_texts = {
        #     'clear_cover': 'cover to ties/spirals',
        # }

        # fields = ('design_code', 'section_dia', 'clear_cover','number_bar', 'trans_bar_size', 'main_bar_size')
        fields = '__all__'

class PmcloadcaseForm(forms.ModelForm):
    class Meta:
        model = Pmcloadcase
        fields = ('pu', 'mu',)
        labels = {
        "pu": "",
        "mu": "",
        }
load_formset = inlineformset_factory(Pmcircleinput, Pmcloadcase, form=PmcloadcaseForm, can_delete = True, extra=1)

class PmcprojectForm(forms.ModelForm):
    class Meta:
        model = Pmcproject
        fields = ('project_name',)
        labels = {
        "project_name": "Project name",
        }


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ('title', 'publication_date', 'author', 'price', 'pages', 'book_type',)
