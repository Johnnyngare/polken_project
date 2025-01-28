from django.test import TestCase, Client
from django.urls import reverse
import os
from django.conf import settings

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        # Create test video file
        self.video_name = 'test.mp4'
        self.video_path = os.path.join(settings.BASE_DIR, 'static', 'videos', self.video_name)
        if not os.path.exists(os.path.dirname(self.video_path)):
            os.makedirs(os.path.dirname(self.video_path))
        with open(self.video_path, 'wb') as f:
            f.write(b'test video content')

    def tearDown(self):
        # Clean up test video file
        if os.path.exists(self.video_path):
            os.remove(self.video_path)

    def test_home_page(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'core/home.html')

    def test_video_stream(self):
        response = self.client.get(reverse('stream_video', args=[self.video_name]))
        self.assertEqual(response.status_code, 200)