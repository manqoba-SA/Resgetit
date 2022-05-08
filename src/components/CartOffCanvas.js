import { faHandPointRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Offcanvas,
  Row,
  Toast,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authAxios } from "../utils";
import Loader from "./Loader";
import { cartFetch } from "../actions/cartActions";
import Message from "./Message";

export default function CartOffCanvas({
  show,
  onHide,
  showToast,
  toastOnClose,
  message,
  cartUpdate,
}) {
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.authList.token !== null);
  const fetchCart = () => dispatch(cartFetch());
  const cart1 = useSelector((state) => state.cart.data);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const cartFetch1 = () => {
    setLoading(true);
    authAxios
      .get("/order-summary")
      .then((res) => {
        setError("");
        setLoading(false);
        setCart(res.data);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setError("You currently do not have any order..");
          setLoading(false);
        } else {
          setError(error);
          setLoading(false);
        }
      });
  };
  const handleRemoveItem = (itemID) => {
    setLoading(true);
    authAxios
      .delete(`/order-items/${itemID}/delete/`)
      .then((res) => {
        fetchCart();
        cartFetch1();
        cartUpdate = cart1;
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (authenticated) {
      cartFetch1();
    }
  }, [cartUpdate]);
  return (
    <>
      <Offcanvas show={show} onHide={onHide} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Shopping Bag</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {error && (
            <>
              <Message variant={"danger"} text={error} />
            </>
          )}
          {authenticated ? (
            <>
              <Toast
                onClose={toastOnClose}
                className="mb-5 w-100"
                show={showToast}
                delay={3000}
                autohide
              >
                <Toast.Body>
                  <b>{message}</b>
                </Toast.Body>
              </Toast>
              {!loading ? (
                <>
                  {cart?.order_items.length === 0 ? (
                    <Container fluid>
                      <h6>No products in your Bag</h6>
                      <p>Add Product from your products page</p>
                    </Container>
                  ) : (
                    cart?.order_items.map((order_item) => {
                      return (
                        <Fragment key={order_item.id}>
                          <Card className="cart-off-canv-card animate__animated animate__headShake animate_slow">
                            <Card.Body>
                              <div>
                                <Row>
                                  <Col md={4}>
                                    <img
                                      src={order_item.item_obj.image}
                                      height={65}
                                      width={65}
                                      alt={order_item.item}
                                    />
                                  </Col>
                                  <Col md={6}>
                                    <p className="m-0">
                                      {order_item.item} x {order_item.quantity}
                                    </p>
                                    <h5>Total: R{order_item.final_price}</h5>
                                    <p className="m-0">
                                      <i>R{order_item.item_obj.price}</i>
                                    </p>
                                  </Col>
                                  <Col md={2}>
                                    <button
                                      className="btn"
                                      onClick={() =>
                                        handleRemoveItem(order_item.id)
                                      }
                                    >
                                      <FontAwesomeIcon
                                        size="lg"
                                        icon={faTrash}
                                      />
                                    </button>
                                  </Col>
                                </Row>
                              </div>
                            </Card.Body>
                          </Card>
                          <hr className="m-0" />
                        </Fragment>
                      );
                    })
                  )}
                </>
              ) : (
                <Container fluid className="loading">
                  <Loader />
                </Container>
              )}
              <footer>
                {cart?.order_items.length === 0 ? (
                  ""
                ) : (
                  <h5 className="text-center">Total amount: R{cart?.total}</h5>
                )}
                <Row>
                  <Col>
                    <Link to="/cart">
                      <Button onClick={onHide} variant="primary w-100">
                        View Cart
                      </Button>
                    </Link>
                    {cart?.order_items.length === 0 ? (
                      ""
                    ) : (
                      <Link to="/checkout">
                        <Button
                          onClick={onHide}
                          variant="outline-primary w-100 mt-3"
                        >
                          Checkout
                          <FontAwesomeIcon size="lg" icon={faHandPointRight} />
                        </Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </footer>
            </>
          ) : (
            <Container fluid>
              <h6>🔴Your currently not logged in</h6>
              <p>Log in first to see your cart</p>
              <Link to="/signin">
                <Button onClick={onHide} variant="primary">
                  Login
                </Button>
              </Link>
            </Container>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
