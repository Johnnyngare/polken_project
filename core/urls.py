# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('service/<int:pk>/', views.service_detail, name='service_detail'),
    path('project/<int:pk>/', views.project_detail, name='project_detail'),
    path('check-static/', views.check_static_files, name='check-static'),
    path('debug/static/', views.debug_static, name='debug-static'),
    path('stream-video/<str:video_name>', views.stream_video, name='stream_video'),  # Removed trailing slash
]