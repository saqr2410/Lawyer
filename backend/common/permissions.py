from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Allow access only to Admin users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_admin
        )


class IsLawyer(BasePermission):
    """
    Allow access only to Lawyer users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_lawyer
        )


class IsSecretary(BasePermission):
    """
    Allow access only to Secretary users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_secretary
        )


class IsAdminOrLawyer(BasePermission):
    """
    Allow access to Admin or Lawyer users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.is_admin
                or request.user.is_lawyer
            )
        )


class IsAdminOrSecretary(BasePermission):
    """
    Allow access to Admin or Secretary users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.is_admin
                or request.user.is_secretary
            )
        )


class IsLawyerOrSecretary(BasePermission):
    """
    Allow access to Lawyer or Secretary users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.is_lawyer
                or request.user.is_secretary
            )
        )


class IsAdminOrLawyerOrSecretary(BasePermission):
    """
    Allow access to all system users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (
                request.user.is_admin
                or request.user.is_lawyer
                or request.user.is_secretary
            )
        )