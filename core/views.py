# core/views.py
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib import messages
from django.http import JsonResponse, StreamingHttpResponse, Http404, HttpResponse
from wsgiref.util import FileWrapper
import os
from .models import Service, Project, ContactMessage
from .forms import ContactForm

def stream_video(request, video_name):
    video_path = os.path.join(settings.BASE_DIR, 'static', 'videos', video_name)
    
    if not os.path.exists(video_path):
        raise Http404("Video not found")
        
    size = os.path.getsize(video_path)
    range_header = request.META.get('HTTP_RANGE', '').strip()
    
    with open(video_path, 'rb') as f:
        if range_header:
            start, end = range_header.replace('bytes=', '').split('-')
            start = int(start)
            end = int(end) if end else size - 1
            f.seek(start)
            data = f.read(end - start + 1)
            
            response = HttpResponse(data, status=206, content_type='video/mp4')
            response['Content-Range'] = f'bytes {start}-{end}/{size}'
            response['Content-Length'] = str(end - start + 1)
        else:
            response = HttpResponse(f.read(), content_type='video/mp4')
            response['Content-Length'] = str(size)
            
        response['Accept-Ranges'] = 'bytes'
        return response
# Keep all your existing view functions

def check_static_files(request):
   """View to check static files configuration and availability"""
   static_dir = os.path.join(settings.STATIC_ROOT, 'videos')
   source_dir = os.path.join(settings.BASE_DIR, 'static', 'videos')
   
   static_files = os.listdir(static_dir) if os.path.exists(static_dir) else []
   source_files = os.listdir(source_dir) if os.path.exists(source_dir) else []
   
   return JsonResponse({
       'static_root': str(settings.STATIC_ROOT),
       'static_dir': str(static_dir),
       'source_dir': str(source_dir),
       'static_files': static_files,
       'source_files': source_files,
       'static_url': settings.STATIC_URL,
       'debug': settings.DEBUG
   })

# Keep other existing view functions unchanged

def home(request):
    # Get database objects
    services = Service.objects.all()
    db_projects = Project.objects.all()
    
    # Sample projects data (temporary until you add projects via admin)
    sample_projects = [
        {
            'title': 'As-built mapping of Avon Centre',
            'description': 'Extension of survey controls, SLAM LiDAR mapping, and preparation of layout plans.',
            'client': 'Symbion International',
            'date': '2023',
            'image': 'projects/avon-centre.jpg'
        },
        {
            'title': 'Umba Irrigation Scheme',
            'description': 'Topographical survey of 1,000 ha rice farm and transmission pipeline survey.',
            'client': 'National Irrigation Board',
            'date': '2019',
            'image': 'projects/irrigation.jpg'
        },
        {
            'title': 'Keben Dam Project',
            'description': 'Topographical survey of 500 ha general area and dam site survey.',
            'client': 'Lake Victoria North Water Services Board',
            'date': '2017',
            'image': 'projects/dam-project.jpg'
        }
    ]
    
    # Handle contact form
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your message has been sent successfully!')
            return redirect('home')
    else:
        form = ContactForm()
    
    # Use database projects if available, otherwise use sample projects
    projects = db_projects if db_projects.exists() else sample_projects
    
    # Add debug information for static files
    video_files = []
    try:
        videos_dir = os.path.join(settings.STATIC_ROOT, 'videos')
        if os.path.exists(videos_dir):
            video_files = os.listdir(videos_dir)
    except Exception as e:
        print(f"Error checking video files: {e}")
    
    context = {
        'services': services,
        'projects': projects,
        'form': form,
        'debug': settings.DEBUG,
        'static_url': settings.STATIC_URL,
        'video_files': video_files,
        'static_root': settings.STATIC_ROOT,
    }
    return render(request, 'core/home.html', context)

def service_detail(request, pk):
    service = get_object_or_404(Service, pk=pk)
    return render(request, 'core/service_detail.html', {'service': service})

def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    return render(request, 'core/project_detail.html', {'project': project})

def debug_static(request):
    """Debug view for static files"""
    videos_path = os.path.join(settings.STATIC_ROOT, 'videos')
    all_files = []
    
    if os.path.exists(videos_path):
        try:
            all_files = os.listdir(videos_path)
        except Exception as e:
            all_files = [f"Error listing files: {str(e)}"]
    else:
        all_files = ["Videos directory does not exist"]
        
    context = {
        'static_root': settings.STATIC_ROOT,
        'static_url': settings.STATIC_URL,
        'videos_path': videos_path,
        'files': all_files,
        'debug_mode': settings.DEBUG,
    }
    return JsonResponse(context)