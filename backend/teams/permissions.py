# teams/permissions.py
from rest_framework import permissions


class IsCaptainOrReadOnly(permissions.BasePermission):
    """Разрешение, позволяющее редактировать команду только её капитану"""

    def has_object_permission(self, request, view, obj):
        # Чтение разрешено всем
        if request.method in permissions.SAFE_METHODS:
            return True
        # Редактирование только капитану
        return obj.captain == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """Разрешение, позволяющее изменять данные только администраторам"""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff