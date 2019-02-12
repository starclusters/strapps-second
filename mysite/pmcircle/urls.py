from django.urls import path
from . import views

app_name = 'pmcircle'

urlpatterns = [
    # path('circle', views.PmCircle.as_view(), name="pmcircle"),
    path('circle', views.PmCircle, name="pmcircle"),
    path('createthoughts', views.ThoughtsCreateView.as_view(), name="thoughts"),
    path('addthoughts', views.CreateThoughts, name="addthoughts"),
    path('books', views.book_list, name="book_list"),
    path('books/create', views.book_create, name="book_create"),
    path('pmprojects', views.project_list, name="project_list"),
    path('pmprojects/<int:project_id>', views.userpmdata, name="userpmdata"),
    path('circle/create', views.createpmdata, name="createpmdata"),
    path('circle/delete/<int:project_id>', views.deletepmdata, name="deletepmdata"),
    path('pmprojects/clone', views.saveaspmdata, name="saveaspmdata"),

]
