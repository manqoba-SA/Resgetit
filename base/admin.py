# from msilib.schema import AdminExecuteSequence
from django.contrib import admin
from .models import *

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price',
                    'countInStock', 'createdAt', 'updated']
    list_filter = ['category', 'createdAt', 'updated']
    list_editable = ['price', 'countInStock']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','user',
                    'ordered',
                    'created',
                    'updated',
                    'room_address',
                    ]
    list_display_links = [
        'user',
        'room_address',
    ]
    list_filter = ['ordered',
                      'coupon',
                   ]
    search_fields = [
        'user__username',
        'ref_code'
    ]

@admin.register(Room_info)
class Room_infoAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'default',
        'building',
        'room_number',
        'cell_number',
    ]
    list_filter = ['default', 'building', 'user']
    search_fields = ['user', 'room_number']

# Register your models here.
admin.site.register(Review)
admin.site.register(OrderItem)
admin.site.register(Coupon)
admin.site.register(Announcement)