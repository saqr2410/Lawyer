from django.contrib import admin

from .models import Case


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):

    list_display = (
        "case_number",
        "title",
        "client",
        "lawyer",
        "court_name",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "court_name",
        "created_at",
    )

    search_fields = (
        "case_number",
        "title",
        "client__full_name",
        "lawyer__username",
        "court_name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    list_per_page = 20

    autocomplete_fields = (
        "client",
        "lawyer",
    )

    fieldsets = (
        (
            "Case Information",
            {
                "fields": (
                    "case_number",
                    "title",
                    "status",
                    "court_name",
                )
            },
        ),
        (
            "Relations",
            {
                "fields": (
                    "client",
                    "lawyer",
                )
            },
        ),
        (
            "Case Details",
            {
                "fields": (
                    "description",
                    "start_date",
                    "closed_at",
                    "claim_amount",
                )
            },
        ),
        (
            "Opponent Information",
            {
                "fields": (
                    "opponent_name",
                    "opponent_lawyer",
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