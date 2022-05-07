from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.timezone import datetime, timedelta

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=250, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=250)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=250, db_index=True)
    slug = models.SlugField(max_length=250, unique=True)
    image = models.ImageField(upload_to='categories', blank=True)

    class Meta:
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    QUANTITY_SIZES = (
        ('each', 'each'),
        ('per packet', 'per packet'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True,)
    countInStock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/%Y/%M/%D', blank=True)
    slide_image = models.ImageField(upload_to='products/%Y/%M/%D', blank=True)
    slide_image1 = models.ImageField(upload_to='products/%Y/%M/%D', blank=True)
    slide_image2 = models.ImageField(upload_to='products/%Y/%M/%D', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.CharField(max_length=100, choices=QUANTITY_SIZES)
    brand = models.CharField(max_length=200, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    description = models.TextField(blank=True)
    information = models.TextField(blank=True)
    service = models.BooleanField(default=False)
    is_technology = models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    _id = models.AutoField(primary_key=True, editable=False)
    class Meta:
        ordering = ('name',)
        index_together = (('_id', 'slug'),)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=250, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.name}"
        
    def item_total(self):
        return self.quantity * self.item.price

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=512, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    ordered = models.BooleanField(default=False)
    room_address = models.ForeignKey(
        'Room_info', related_name='Room_info', on_delete=models.SET_NULL, blank=True, null=True)
    payment = models.CharField(max_length=100,)
    change = models.CharField(max_length=512)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    def return_delivery():
        now = datetime.now()
        return now + timedelta(minutes=20)
    delivery = models.TimeField(default=return_delivery)

    '''
    1. Item added to cart
    2. Adding a billing address
    (Failed checkout)
    3. Payment
    (Preprocessing, processing, packaging etc.)
    4. Being delivered
    5. Received
    6. Refunds
    '''

    def __str__(self):
        return self.user.username
     
    def total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.item_total()
        if self.coupon:
            total -= self.coupon.amount
        return total

class Room_info(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    cell_number = models.CharField(max_length=512)
    building = models.CharField(max_length=512)
    room_number = models.CharField(max_length=5)
    default = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username + "-" + self.building + "-" + self.room_number + "-" + self.cell_number
    
    class Meta:
        verbose_name_plural = 'Room Addresses'


class Coupon(models.Model):
    code = models.CharField(max_length=250)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.code

class Announcement(models.Model):
    ALERTS= (
        ('primary', 'primary'),
        ('secondary', 'secondary'),
        ('success', 'success'),
        ('danger', 'danger'),
        ('warning', 'warning'),
        ('info', 'info'),
        ('light', 'light'),
        ('dark', 'dark'),
    )
    paragraph = models.CharField(max_length=250, blank=True)
    alert = models.CharField(max_length=100, choices=ALERTS, default="primary")
    support_link = models.URLField(blank=True)