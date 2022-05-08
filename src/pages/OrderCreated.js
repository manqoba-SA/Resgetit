import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartFetch } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { authAxios } from "../utils";

export default function OrderCreated() {
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.authList.token !== null);
  const navigate = useNavigate();
  const cart1 = useSelector((state) => state.cart.data);
  const [cart, setCart] = useState({ data: null, error: null, loading: false });
  const fetchCart = () => dispatch(cartFetch());
  const cartFetch1 = () => {
    setCart({ data: null, error: null, loading: true });
    authAxios
      .get("/order-complete")
      .then((res) => {
        setCart({ data: res.data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setCart({
            data: null,
            error: "You currently do not have any order..",
            loading: false,
          });
        } else {
          setCart({ data: null, error: error, loading: false });
        }
      });
  };

  useEffect(() => {
    document.title = "Order-Received!";
    if (!authenticated) {
      navigate("/signin");
    } else {
      cartFetch1();
      fetchCart();
    }
  }, [authenticated, cart1, dispatch]);
  const { data, loading, error } = cart;
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <>
          <Message variant={"danger"} text={error} />
        </>
      ) : (
        <>
          <div
            class="d-flex flex-column justify-content-center align-items-center"
            id="order-heading"
          >
            <div class="text-uppercase">
              <p>Order Received👌</p>
            </div>
            <div class="h4">Danko is Thank you✌️. Thanks for your order.</div>
            <div class="pt-1">
              <p>
                Your order #{data?.id} is currently being<b> prepared</b>
              </p>
            </div>
          </div>
          <div class="wrapper bg-white">
            <div class="pt-2 border-bottom mb-3"></div>
            <div class="d-flex justify-content-start align-items-center pl-3">
              <div class="text-muted">Payment Method</div>
              <div class="ml-auto">
                {data?.payment === "cash"
                  ? "Cash On Delivery"
                  : "Online Payment"}
              </div>
            </div>
            <div class="d-flex justify-content-start align-items-center py-1 pl-3">
              <div class="text-muted">Shipping</div>
              <div class="ml-auto">
                {" "}
                <label>Free</label>{" "}
              </div>
            </div>
            {data?.coupon && (
              <Card className="w-50 building-card">
                <div class="d-flex justify-content-start align-items-center pb-4 pl-3 border-bottom">
                  <div class="text-muted">
                    {" "}
                    <h6 className="green">Discount/Gift Card applied</h6>
                    <p>Code: {data?.coupon.code}</p>{" "}
                  </div>
                  <div class="ml-auto price"> -R{data?.coupon.amount} </div>
                </div>
              </Card>
            )}
            <div class="d-flex justify-content-start align-items-center pl-3 py-3 mb-4 border-bottom">
              <div class="text-muted"> Total </div>
              <div class="h5 m-0">R{data?.total}</div>
            </div>
            <div class="row border rounded p-1 my-3">
              <div class="col-md-6 py-3">
                <div class="d-flex flex-column align-items start">
                  {" "}
                  <b>Shipping Room Address</b>
                  <p class="text-justify pt-2">
                    {data?.room_address_obj.building}, @ room{" "}
                    {data?.room_address_obj.room_number},
                  </p>
                  <p class="text-justify">
                    {data?.room_address_obj.cell_number}
                  </p>
                </div>
              </div>
              <div class="col-md-6 py-3">
                <div class="d-flex flex-column align-items start">
                  {" "}
                  <b>Estimated Delivery Time</b>
                  <h3 class="text-justify pt-2">{data?.delivery}</h3>
                </div>
              </div>
            </div>
            <div class="pl-3 font-weight-bold">Important Info</div>
            <div class="justify-content-between rounded my-3">
              <div>
                {" "}
                <b>Note 1:</b>{" "}
              </div>
              <p class="text-center">
                {" "}
                At Herb and Miller we deliver between 8am to 8pm and Quantile
                between 8am to 00:00
              </p>
              <div>
                {" "}
                <b>Note 2:</b>{" "}
              </div>
              <p class="text-center">
                {" "}
                If you don't receive your order before estimated delivery worry
                not it means there are many orders at the moment you will
                receive your order
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
