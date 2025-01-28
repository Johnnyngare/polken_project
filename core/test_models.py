from django.test import TestCase
from core.models import Service, Project, ContactMessage

class ServiceModelTest(TestCase):
    def setUp(self):
        Service.objects.create(
            title="Test Service",
            description="Test Description"
        )

    def test_service_creation(self):
        service = Service.objects.get(title="Test Service")
        self.assertEqual(service.description, "Test Description")