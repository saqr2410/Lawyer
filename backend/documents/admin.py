from django.contrib import admin

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "case",
        "document_type",
        "uploaded_by",
        "created_at",
    )

    list_filter = (
        "document_type",
        "created_at",
    )

    search_fields = (
        "title",
        "case__case_number",
        "case__title",
        "uploaded_by__username",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    autocomplete_fields = (
        "case",
        "uploaded_by",
    )

    fieldsets = (
        (
            "Document Information",
            {
                "fields": (
                    "title",
                    "document_type",
                    "file",
                    "description",
                )
            },
        ),
        (
            "Relations",
            {
                "fields": (
                    "case",
                    "uploaded_by",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )