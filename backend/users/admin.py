from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    ordering =("email",)
    list_display =("email", "name","is_active", "is_active", "is_seller","is_customer")
    search_fields =("email","name","phone_number")
    fieldsets =(
        (None,{"fields": ("email","password")}),
        ("Personal Info", {"fields":("name","phone_number")}),
        ("Permissions", {"fields":("is_active","is_staff", "is_superuser", "is_seller", "is_customer", "groups", "user_permissions")}),
        ("Important_dates", {"fields":("last_login","date_joined")}),
    )
    add_fieldsets =(
        (None, {
            "classes":("wide",),
            "fields":("email", "password1", "password2", "is_staff", "is_superuser")
        }),
    )
    filter_horizontal=("groups","user_permissions")