from django.contrib import admin
from pmcircle.models import Thoughts, Pmcircleinput, Pmcloadcase, Pmcproject
# Register your models here.
admin.site.register(Thoughts)
admin.site.register(Pmcircleinput)
admin.site.register(Pmcloadcase)
admin.site.register(Pmcproject)
