from operator import imod
import os
import random
import string
import json
import requests
from unicodedata import category
from urllib import request
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView,
    UpdateAPIView, DestroyAPIView
)
from django.http import JsonResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .models import *
from .serializers import AnnouncementSerializer, CategorySerializer, OrderCompleteSerializer, ProductSerializer, OrderSerializer, RoomInfoSerializer
from django.views import View
from django.http import HttpResponse, HttpResponseNotFound
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def create_ref_code():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))


def html_email(email, subject, to_email, template_name):
    from_email = settings.EMAIL_HOST_USER
    text_content = """
    {}

    {}

    {}
    regards,
    Resgetit Support
    """. format(email['shortDescription'], email['subtitle'], email['message'])
    html_file = get_template(template_name)
    context = {'email': email}
    html_content = html_file.render(context)
    msg = EmailMultiAlternatives(subject, text_content, from_email, to_email)
    msg.attach_alternative(html_content, 'text/html')
    msg.send()


# Create your views here.
class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id}, status=HTTP_200_OK)


@api_view(["GET"])
def getRoutes(request):
    routes = ["api", "api2"]
    return Response(routes)


@api_view(["GET"])
def getAnnouncement(request):
    announcement = Announcement.objects.all()
    serializer = AnnouncementSerializer(announcement, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProducts(request):
    query = request.query_params.get("keyword")
    sec_query = request.query_params.get("category")
    if query is None:
        query = ""

    if sec_query:
        products = Product.objects.filter(
            category=sec_query, name__icontains=query)
    else:
        products = Product.objects.filter(name__icontains=query)

    page = request.query_params.get("page")
    paginator = Paginator(products, 12)
    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({"products": serializer.data, "page": page, "pages": paginator.num_pages})


@api_view(["GET"])
def getProduct(request, id_num):
    product = Product.objects.get(_id=id_num)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Product, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


class addToCart(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get("slug", None)
        if slug is None:
            return Response({"message": "Invalid Response"}, HTTP_400_BAD_REQUEST)
        else:
            item = get_object_or_404(Product, slug=slug)
            order_item, created = OrderItem.objects.get_or_create(
                item=item,
                user=request.user,
                ordered=False
            )
            order_qs = Order.objects.filter(user=request.user, ordered=False)
            if order_qs.exists():
                order = order_qs[0]
                # check if the order item is in the order
                if order.items.filter(item__slug=item.slug).exists():
                    order_item.quantity += 1
                    item.save()
                    order_item.save()
                    return Response(status=HTTP_200_OK)
                else:
                    order.items.add(order_item)
                    return Response(status=HTTP_200_OK)
            else:
                ordered_date = timezone.now()
                order = Order.objects.create(
                    user=request.user, created=ordered_date)
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderCompleteView(RetrieveAPIView):
    serializer_class = OrderCompleteSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.filter(
                user=self.request.user, ordered=True).latest('id')
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class AddCouponView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('code', None)
        if code is None:
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        coupon = get_object_or_404(Coupon, code=code)
        order.coupon = coupon
        order.save()
        return Response(status=HTTP_200_OK)


class RoomInfoView(ListAPIView):
    serializer_class = RoomInfoSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Room_info.objects.filter(
            user=self.request.user,
        )


class PaymentView(APIView):
    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        # userprofile = UserProfile.objects.get(user=self.request.user)
        payment = request.data.get('payment')
        change = request.data.get('change')
        token = request.data.get('token')
        selected_room_id = request.data.get('selectedRoom')

        room_address = Room_info.objects.get(id=selected_room_id)
        print(room_address)

        amount = int((order.total() + 3) * 100)
        if payment == "card":
            try:
                # Anonymous test key. Replace with your key.
                SECRET_KEY = 'sk_live_b235f220q9kW9k6e2b1448fb80b0'

                response = requests.post(
                    'https://online.yoco.com/v1/charges/',
                    headers={
                        'X-Auth-Secret-Key': SECRET_KEY,
                    },
                    json={
                        'token': token,
                        'amountInCents': amount,
                        'currency': 'ZAR',
                    },
                )

                print(response.status_code)
                print(response.json())
                body = response.json()
                if response.status_code == 400:
                    return Response(body, status=HTTP_400_BAD_REQUEST)
                else:
                    order_items = order.items.all()
                    order_items.update(ordered=True)
                    for item in order_items:
                        item.item.countInStock -= item.quantity
                        item.item.save()
                        item.save()
                    order.ordered = True
                    order.payment = payment
                    order.change = change
                    order.room_address = room_address
                    order.ref_code = create_ref_code()
                    order.save()
                    # send email
                    email = {
                        "title": "Thank your for registering with Resgetit",
                        "shortDescription": order_items,
                        "subtitle": order.total,
                        "message": order
                    }
                    subject = '[Resgetit] Order no {} Received'.format(
                        order.id)
                    to_email = self.request.user.email
                    html_email(email, subject, [to_email, "nqobi.it4073@gmail.com", "tranzezicocreations@gmail.com",
                               "Klerato43@gmail.com", "Keamohetsemsira@gmail.com"], "order_confirmation _email.html")
                    return Response(status=HTTP_200_OK)
            except requests.exceptions.ConnectionError as e:
                body = e.json_body
                err = body.get('error', {})
                return Response(body, status=HTTP_400_BAD_REQUEST)
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        else:
            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.item.countInStock -= item.quantity
                item.item.save()
                item.save()

            order.ordered = True
            order.payment = payment
            order.change = change
            order.room_address = room_address
            order.ref_code = create_ref_code()
            order.save()

            # send email
            email = {
                "title": "Thank your for registering with Resgetit",
                "shortDescription": order_items,
                "subtitle": order.total,
                "message": order
            }
            subject = '[Resgetit] Order no {} Received'.format(order.id)
            to_email = self.request.user.email
            html_email(email, subject, [to_email, "nqobi.it4073@gmail.com", "tranzezicocreations@gmail.com",
                       "Klerato43@gmail.com", "Keamohetsemsira@gmail.com"], "order_confirmation _email.html")
            return Response(status=HTTP_200_OK)


class CreateRoomInfoView(CreateAPIView):
    serializer_class = RoomInfoSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Room_info.objects.all()


class RoomUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = RoomInfoSerializer
    queryset = Room_info.objects.all()


class RoomDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Room_info.objects.all()


class Assets(View):
    def get(self, _request, filename):
        path = os.path.join(os.path.dirname(__file__), 'static', filename)
        print(filename)
        if os.path.isfile(path):
            with open(path, 'rb') as file:
                return HttpResponse(file.read(), content_type='application/javascript')
        else:
            return HttpResponseNotFound()
