# Generated by Django 2.1.3 on 2018-12-13 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pmcircle', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('publication_date', models.DateField(null=True)),
                ('author', models.CharField(blank=True, max_length=30)),
                ('price', models.DecimalField(decimal_places=3, max_digits=5)),
                ('pages', models.IntegerField(blank=True, null=True)),
                ('book_type', models.PositiveSmallIntegerField(choices=[(1, 'Hardcover'), (2, 'Paperback'), (3, 'E-book')])),
            ],
        ),
    ]
