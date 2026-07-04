from django.contrib import admin

from .models import Hearing


@admin.register(Hearing)
class HearingAdmin(admin.ModelAdmin):

    list_display = (
        "case",
        "hearing_date",
        "court_name",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "court_name",
        "hearing_date",
    )

    search_fields = (
        "case__case_number",
        "case__title",
        "court_name",
        "judge_name",
    )

    ordering = (
        "hearing_date",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "case",
    )

    fieldsets = (
        (
            "Hearing Information",
            {
                "fields": (
                    "case",
                    "hearing_date",
                    "court_name",
                    "status",
                )
            },
        ),
        (
            "Court Details",
            {
                "fields": (
                    "judge_name",
                    "courtroom",
                )
            },
        ),
        (
            "Notes & Result",
            {
                "fields": (
                    "notes",
                    "result",
                    "next_hearing_date",
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