from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, LawyerProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    list_display = (
        "username",
        "email",
        "role",
        "phone",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "Extra Information",
            {
                "fields": (
                    "role",
                    "phone",
                )
            }
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Extra Information",
            {
                "fields": (
                    "role",
                    "phone",
                )
            }
        ),
    )



@admin.register(LawyerProfile)
class LawyerProfileAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "bar_number",
        "specialization",
        "office_name",
        "created_at",
    )

    search_fields = (
        "user__username",
        "bar_number",
        "office_name",
    )