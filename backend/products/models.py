from django.db import models
from django.utils.text import slugify
from django.conf import settings

class Category(models.Model):
    name= models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    
    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug =slugify(self.name)
        super().save(**kwargs)
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    seller = models.ForeignKey(
        # .CAScade ensures thet the user is deleted together with their products
        # relates_name field allows reverse access  
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="products"
    )
    category= models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="products"
    )
    name= models.CharField(max_length=200)
    slug= models.SlugField(max_length=220, unique=True, blank=True)
    brand = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="products/",blank=True,null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2,default=0)
    num_reviews =models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["name"])]
        ordering = ["-created_at"]
    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)
            candidate = base 
            i = 1
            while Product.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                i += 1
                candidate = f"{base}-{i}"
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    