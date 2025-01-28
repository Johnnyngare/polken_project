# core/models.py
from django.db import models
from imagekit import ImageSpec # type: ignore
from imagekit.processors import ResizeToFit # type: ignore
from imagekit.models import ProcessedImageField # type: ignore

class OptimizedImage(ImageSpec):
   processors = [ResizeToFit(800, 600)]
   format = 'JPEG'
   options = {'quality': 80}

class Service(models.Model):
   title = models.CharField(max_length=200)
   description = models.TextField()
   icon = models.CharField(max_length=50)
   order = models.IntegerField(default=0)

   class Meta:
       ordering = ['order']

   def __str__(self):
       return self.title

class Project(models.Model):
   title = models.CharField(max_length=200)
   description = models.TextField()
   client = models.CharField(max_length=200)
   date = models.DateField()
   image = ProcessedImageField(
       upload_to='projects/',
       processors=[ResizeToFit(800, 600)],
       format='JPEG',
       options={'quality': 80},
       blank=True
   )
   location = models.CharField(max_length=200, blank=True, null=True)

   class Meta:
       ordering = ['-date']

   def __str__(self):
       return self.title

class ContactMessage(models.Model):
   name = models.CharField(max_length=100)
   email = models.EmailField()
   message = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)

   class Meta:
       ordering = ['-created_at']

   def __str__(self):
       return f"Message from {self.name} - {self.created_at.strftime('%Y-%m-%d')}"