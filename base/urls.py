from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('user-id/', views.UserIDView.as_view(), name="userid"),
     path('room-info/', views.RoomInfoView.as_view(), name="room-info"),
    path('room-info/create', views.CreateRoomInfoView.as_view(), name="room-create"),
    path('room-info/<str:pk>/update', views.RoomUpdateView.as_view(), name="room-update"),
    path('room-info/<pk>/delete/', views.RoomDeleteView.as_view(), name="room-delete"),
    path('categories/', views.getCategories, name="categories"),
    path('announcement/', views.getAnnouncement, name="announcement"),
    path('products/', views.getProducts, name="products"),
    path('products/<str:id_num>', views.getProduct, name="product"),
    path('add-to-cart/', views.addToCart.as_view(), name="add-to-cart"),
    path('order-items/<pk>/delete/',
         views.OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('order-item/update-quantity/',
         views.OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),
    path('order-summary/', views.OrderDetailView.as_view(), name="order-summary"),
    path('order-complete/', views.OrderCompleteView.as_view(), name="order-complete"),
    path('add-coupon/', views.AddCouponView.as_view(), name="add-coupon"),
    path('checkout/', views.PaymentView.as_view(), name='checkout'),
]
