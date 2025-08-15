from django.db import models
# AbstractBaseUser: The base class for creating custom user models
# PermissionsMixin: Adds permission-related fields and methods to your user model
# BaseUserManager: Base class for creating custom user managers (handles user creation)
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, BaseUserManager)
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    # creating regular users 
    def create_user(self,email, password =None, **extra_fields):
        if not email: 
            return ValueError("Users must have an email address")
        email= self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user= self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using= self.db)
        return user
       # creating superusers with special permissions 
    def create_superuser(self,email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff = True")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser= True.")
        
        return self.create_user(email, password, **extra_fields)
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email=models.EmailField(unique=True)
    name= models.CharField(max_length=150, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)

    is_active= models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_seller= models.BooleanField(default=False)
    is_customer = models.BooleanField(default=True)

    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []   
    # Assigns custom manager ro handle user creation 
    objects = CustomUserManager()

    def __str__(self):
        return self.email