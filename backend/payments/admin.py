from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = (
        "case",
        "amount",
        "payment_method",
        "payment_date",
        "created_at",
    )

    list_filter = (
        "payment_method",
        "payment_date",
    )

    search_fields = (
        "case__case_number",
        "case__title",
    )

    ordering = (
        "-payment_date",
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "payment_date",
    )

    autocomplete_fields = (
        "case",
    )