# core/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib import messages
from .models import Service, Project, ContactMessage
from .forms import ContactForm

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
    
    context = {
        'services': services,
        'projects': projects,
        'form': form
    }
    return render(request, 'core/home.html', context)

def service_detail(request, pk):
    service = get_object_or_404(Service, pk=pk)
    return render(request, 'core/service_detail.html', {'service': service})

def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    return render(request, 'core/project_detail.html', {'project': project})