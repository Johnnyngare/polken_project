# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('service/<int:pk>/', views.service_detail, name='service_detail'),
    path('project/<int:pk>/', views.project_detail, name='project_detail'),
]