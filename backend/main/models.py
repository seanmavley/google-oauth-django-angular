from django.contrib.auth.models import AbstractUser
from django.db import models

REGISTRATION_CHOICES = [
    ('email', 'Email'),
    ('google', 'Google'),
]


class User(AbstractUser):
    email = models.CharField(
        max_length=250, unique=True, null=False, blank=False)
    registration_method = models.CharField(
        max_length=10, choices=REGISTRATION_CHOICES, default='email')
    photo = models.URLField(blank=True, default='')
    country = models.CharField(max_length=100, default='', blank=True)
    about = models.TextField(blank=True, default='')

    def __str__(self):
        return self.username
