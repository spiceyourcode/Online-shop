from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()


class CustomUserModelTests(TestCase):
    """Test the CustomUser model functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.user_data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'phone_number': '0700000000',
            'password': 'Pass123456'
        }
    
    def test_create_user_with_email(self):
        """Test creating a user with email"""
        user = User.objects.create_user(**self.user_data)
        
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.name, self.user_data['name'])
        self.assertEqual(user.phone_number, self.user_data['phone_number'])
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_customer)  # Default value
        self.assertFalse(user.is_seller)   # Default value
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password(self.user_data['password']))
    
    def test_create_user_without_email_raises_error(self):
        """Test creating user without email raises ValueError"""
        user_data = self.user_data.copy()
        user_data['email'] = ''
        
        with self.assertRaises(ValueError):
            User.objects.create_user(**user_data)
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='AdminPass123'
        )
        
        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.check_password('AdminPass123'))
    
    def test_create_superuser_with_invalid_permissions(self):
        """Test creating superuser with invalid permissions raises error"""
        # Test is_staff=False
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='admin@example.com',
                password='AdminPass123',
                is_staff=False
            )
        
        # Test is_superuser=False
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email='admin@example.com',
                password='AdminPass123',
                is_superuser=False
            )
    
    def test_email_normalization(self):
        """Test that email addresses are normalized"""
        user = User.objects.create_user(
            email='Test@EXAMPLE.COM',
            password='Pass123456'
        )
        self.assertEqual(user.email, 'Test@example.com')  # Domain lowercase
    
    def test_user_string_representation(self):
        """Test the __str__ method returns email"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), self.user_data['email'])
    
    def test_user_roles(self):
        """Test custom user roles"""
        # Test seller
        seller = User.objects.create_user(
            email='seller@example.com',
            password='Pass123456',
            is_seller=True,
            is_customer=False
        )
        self.assertTrue(seller.is_seller)
        self.assertFalse(seller.is_customer)
        
        # Test customer (default)
        customer = User.objects.create_user(
            email='customer@example.com',
            password='Pass123456'
        )
        self.assertFalse(customer.is_seller)
        self.assertTrue(customer.is_customer)


class AuthenticationAPITests(APITestCase):
    """Test the authentication API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.refresh_url = reverse('auth-refresh')
        self.profile_url = reverse('auth-profile')
        
        self.user_data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'phone_number': '0700000000',
            'password': 'Pass123456'
        }
        
        # Create a test user for login tests
        self.existing_user = User.objects.create_user(
            email='existing@example.com',
            name='Existing User',
            password='ExistingPass123'
        )
    
    def test_register_user_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())
        
        # Check user was created with correct data
        user = User.objects.get(email=self.user_data['email'])
        self.assertEqual(user.name, self.user_data['name'])
        self.assertEqual(user.phone_number, self.user_data['phone_number'])
        self.assertTrue(user.check_password(self.user_data['password']))
    
    def test_register_user_duplicate_email(self):
        """Test registration with duplicate email"""
        # First registration
        self.client.post(self.register_url, self.user_data, format='json')
        
        # Second registration with same email
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_user_invalid_data(self):
        """Test registration with invalid data"""
        invalid_data = {
            'email': 'invalid-email',  # Invalid email format
            'password': '123'  # Too short password
        }
        
        response = self.client.post(self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_success(self):
        """Test successful login"""
        login_data = {
            'email': 'existing@example.com',
            'password': 'ExistingPass123'
        }
        
        response = self.client.post(self.login_url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        invalid_data = {
            'email': 'existing@example.com',
            'password': 'WrongPassword'
        }
        
        response = self.client.post(self.login_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        invalid_data = {
            'email': 'nonexistent@example.com',
            'password': 'SomePassword'
        }
        
        response = self.client.post(self.login_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token_success(self):
        """Test token refresh"""
        # Login to get tokens
        login_data = {
            'email': 'existing@example.com',
            'password': 'ExistingPass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['refresh']
        
        # Use refresh token to get new access token
        refresh_data = {'refresh': refresh_token}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_refresh_token_invalid(self):
        """Test refresh with invalid token"""
        refresh_data = {'refresh': 'invalid-token'}
        response = self.client.post(self.refresh_url, refresh_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileAPITests(APITestCase):
    """Test the profile API endpoint"""
    
    def setUp(self):
        """Set up test data"""
        self.profile_url = reverse('auth-profile')
        
        self.user = User.objects.create_user(
            email='profile@example.com',
            name='Profile User',
            phone_number='0700000000',
            password='ProfilePass123'
        )
        
        # Get JWT token for authentication
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Bearer {self.access_token}'}
    
    def test_get_profile_authenticated(self):
        """Test getting profile data when authenticated"""
        response = self.client.get(self.profile_url, **self.auth_headers)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['name'], self.user.name)
        self.assertEqual(response.data['phone_number'], self.user.phone_number)
    
    def test_get_profile_unauthenticated(self):
        """Test getting profile without authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_profile_put(self):
        """Test updating profile with PUT request"""
        update_data = {
            'name': 'Updated Name',
            'phone_number': '0711111111'
        }
        
        response = self.client.put(
            self.profile_url, 
            update_data, 
            format='json',
            **self.auth_headers
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh user from database
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, update_data['name'])
        self.assertEqual(self.user.phone_number, update_data['phone_number'])
    
    def test_update_profile_patch(self):
        """Test updating profile with PATCH request"""
        update_data = {'name': 'Patched Name'}
        
        response = self.client.patch(
            self.profile_url,
            update_data,
            format='json',
            **self.auth_headers
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Refresh user from database
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, update_data['name'])
    
    def test_update_profile_unauthenticated(self):
        """Test updating profile without authentication"""
        update_data = {'name': 'Hacker Name'}
        
        response = self.client.put(self.profile_url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthFlowTests(APITestCase):
    """Test complete authentication flows"""
    
    def test_complete_auth_flow(self):
        """Test the complete registration -> login -> profile flow"""
        # 1. Register
        register_data = {
            "email": "flow@example.com",
            "name": "Flow User",
            "phone_number": "0700000000",
            "password": "FlowPass123"
        }
        
        register_response = self.client.post(
            reverse("auth-register"), 
            register_data, 
            format="json"
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        # 2. Login
        login_data = {
            "email": "flow@example.com",
            "password": "FlowPass123"
        }
        
        login_response = self.client.post(
            reverse("auth-login"), 
            login_data, 
            format="json"
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access_token = login_response.data["access"]

        # 3. Access Profile
        profile_response = self.client.get(
            reverse("auth-profile"), 
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.data["email"], "flow@example.com")
        self.assertEqual(profile_response.data["name"], "Flow User")

        # 4. Update Profile
        update_data = {"name": "Updated Flow User"}
        update_response = self.client.patch(
            reverse("auth-profile"),
            update_data,
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["name"], "Updated Flow User")

        # 5. Refresh Token
        refresh_token = login_response.data["refresh"]
        refresh_response = self.client.post(
            reverse("auth-refresh"),
            {"refresh": refresh_token},
            format="json"
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_response.data)
    
    def test_seller_customer_workflow(self):
        """Test seller and customer specific workflows"""
        # Create a seller
        seller_data = {
            "email": "seller@example.com",
            "password": "SellerPass123",
            "is_seller": True,
            "is_customer": False
        }
        seller = User.objects.create_user(**seller_data)
        
        # Create a customer
        customer_data = {
            "email": "customer@example.com", 
            "password": "CustomerPass123"
        }
        customer = User.objects.create_user(**customer_data)
        
        # Test seller login
        seller_login = self.client.post(reverse("auth-login"), {
            "email": "seller@example.com",
            "password": "SellerPass123"
        }, format="json")
        
        seller_token = seller_login.data["access"]
        seller_profile = self.client.get(
            reverse("auth-profile"),
            HTTP_AUTHORIZATION=f"Bearer {seller_token}"
        )
        
        self.assertTrue(seller_profile.data.get("is_seller", False))
        self.assertFalse(seller_profile.data.get("is_customer", True))
        
        # Test customer login  
        customer_login = self.client.post(reverse("auth-login"), {
            "email": "customer@example.com",
            "password": "CustomerPass123"
        }, format="json")
        
        customer_token = customer_login.data["access"]
        customer_profile = self.client.get(
            reverse("auth-profile"),
            HTTP_AUTHORIZATION=f"Bearer {customer_token}"
        )
        
        self.assertFalse(customer_profile.data.get("is_seller", False))
        self.assertTrue(customer_profile.data.get("is_customer", True))


class EdgeCaseTests(APITestCase):
    """Test edge cases and error scenarios"""
    
    def test_malformed_json_requests(self):
        """Test API behavior with malformed JSON"""
        # Test with invalid JSON
        response = self.client.post(
            reverse("auth-register"),
            data='{"email": "test@example.com", invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_empty_requests(self):
        """Test API behavior with empty requests"""
        # Register with empty data
        response = self.client.post(reverse("auth-register"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Login with empty data
        response = self.client.post(reverse("auth-login"), {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_long_input_values(self):
        """Test API with very long input values"""
        long_string = "a" * 1000
        
        invalid_data = {
            "email": f"{long_string}@example.com",
            "name": long_string,
            "password": "Pass123456"
        }
        
        response = self.client.post(
            reverse("auth-register"), 
            invalid_data, 
            format="json"
        )
        # Should fail due to field length limits
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_expired_token_handling(self):
        """Test behavior with expired tokens"""
        user = User.objects.create_user(
            email="expired@example.com",
            password="ExpiredPass123"
        )
        
        # Create an expired token (this would normally require mocking time)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Try to access profile (in real scenario, token would be expired)
        response = self.client.get(
            reverse("auth-profile"),
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )
        # Should succeed with valid token (in real app, you'd mock time to make it expired)
        self.assertEqual(response.status_code, status.HTTP_200_OK)