from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
User = get_user_model()

# Create your models here.
class Thoughts(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=150, default='')
    description = models.CharField(max_length=5000, default='')

    def __str__(self):
        return self.title

class Pmcircleinput(models.Model):
    DESIGN_CODES = ((0, "AASTHO LRFD"), (1, 'ACI 318-14'),)
    BAR_SIZE = ((0, "#3"), (1, '#4'), (2, '#5'), (3, '#6'), (4, '#7'), (5, '#8'), (6, '#9'), (7, '#10'), (8, '#11'), (9, '#14'), (10, '#18'),)
    TRANSV_TYPES = ((0, "Spiral"), (1, 'Tied/Other'),)
    design_code = models.PositiveSmallIntegerField(choices=DESIGN_CODES, default=0)
    section_dia = models.DecimalField(max_digits=4, decimal_places=2, default=30, validators=[MinValueValidator(0.01)])
    clear_cover = models.DecimalField(max_digits=4, decimal_places=2, default=3, validators=[MinValueValidator(0.01)])
    number_bar = models.PositiveSmallIntegerField(default=6)
    trans_bar_size = models.PositiveSmallIntegerField(choices=BAR_SIZE, default=1)
    main_bar_size = models.PositiveSmallIntegerField(choices=BAR_SIZE, default=6)
    f_c = models.DecimalField(max_digits=4, decimal_places=2, default=4.0, validators=[MinValueValidator(0.01)])
    f_y = models.DecimalField(max_digits=4, decimal_places=2, default=60, validators=[MinValueValidator(0.01)])
    Es = models.PositiveSmallIntegerField(default=29000)
    transv_type = models.PositiveSmallIntegerField(choices=TRANSV_TYPES, default=0)

class Pmcloadcase(models.Model):
    pu = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    mu = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    pmcircleinput = models.ForeignKey(Pmcircleinput, on_delete=models.CASCADE)

class Pmcproject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=100)
    pmcircleinput = models.OneToOneField(Pmcircleinput, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("user", "project_name"),)
        ordering = ['-updated_at']

    def __str__(self):
        return self.project_name


class Book(models.Model):
    HARDCOVER = 1
    PAPERBACK = 2
    EBOOK = 3
    BOOK_TYPES = (
      (HARDCOVER, 'Hardcover'),
      (PAPERBACK, 'Paperback'),
      (EBOOK, 'E-book'),
    )
    title = models.CharField(max_length=50)
    publication_date = models.DateField(null=True)
    author = models.CharField(max_length=30, blank=True)
    price = models.DecimalField(max_digits=5,decimal_places=3)
    pages = models.IntegerField(blank=True, null=True)
    book_type = models.PositiveSmallIntegerField(choices=BOOK_TYPES)
