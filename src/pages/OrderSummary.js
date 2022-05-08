import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { cartFetch } from "../actions/cartActions";
import { addToCartURL } from "../constants/cartConstants";
import { authAxios } from "../utils";

export default function OrderSummary() {
  const [cart, setCart] = useState(null);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const authenticated = useSelector((state) => state.authList.token !== null);
  const fetchCart = () => dispatch(cartFetch());

  const cartFetch1 = () => {
    setLoading(true);
    authAxios
      .get("/order-summary/")
      .then((res) => {
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

  const handleAddToCart = (slug) => {
    setLoading(true);
    setError(null);
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        cartFetch1();
        fetchCart();
      })
      .catch((err) => {
        if (error.response.status === 404) {
          setError("You currently do not have any order..");
          setLoading(false);
        } else {
          setError(error);
          setLoading(false);
        }
      });
  };

  const handleRemoveQuantityFromCart = (slug) => {
    authAxios
      .post("/order-item/update-quantity/", { slug })
      .then((res) => {
        cartFetch1();
        fetchCart();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleRemoveItem = (itemID) => {
    setLoading(true);
    authAxios
      .delete(`/order-items/${itemID}/delete/`)
      .then((res) => {
        cartFetch1();
        fetchCart();
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Shopping Bag";
    if (!authenticated) {
      navigate("/signin");
    } else {
      cartFetch1();
    }
  }, [authenticated]);
  return (
    <>
      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-center row">
          <div className="col-md-8">
            <div className="p-2">
              <h4>My Shopping Bag</h4>
            </div>
            {cart?.order_items.length !== 0 ? (
              <>
                {!loading ? (
                  <>
                    {error && (
                      <div className="d-flex flex-row justify-content-between align-items-center p-2 bg-danger mt-4 px-3 rounded">
                        <h5>{JSON.stringify(error)}</h5>
                      </div>
                    )}
                    {cart &&
                      cart?.order_items.map((order_item) => {
                        return (
                          <Fragment key={order_item.id}>
                            <div className="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded">
                              <div className="mr-1 cart-image">
                                <img
                                  className="rounded"
                                  src={order_item.item_obj.image}
                                  width="70"
                                  alt={order_item.item}
                                />
                              </div>
                              <div className="d-flex flex-column align-items-center product-details w-30">
                                <span className="font-weight-bold">
                                  {order_item.item}
                                </span>
                              </div>
                              <div className="d-flex flex-row align-items-center qty">
                                <i className="fa fa-minus text-danger"></i>
                                <h5 className="text-grey mt-1 mr-1 ml-1">
                                  {order_item.quantity}
                                  <button
                                    onClick={() =>
                                      handleRemoveQuantityFromCart(
                                        order_item.item_obj.slug
                                      )
                                    }
                                    className="btn m-0 p-0 px-2"
                                  >
                                    <i className="fa fa-minus text-danger"></i>
                                    <FontAwesomeIcon
                                      className="text-danger"
                                      icon={faMinus}
                                    />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleAddToCart(order_item.item_obj.slug)
                                    }
                                    className="btn m-0 p-0 px-2"
                                  >
                                    <FontAwesomeIcon
                                      className="text-success animate__animated animate__heartBeat animate_slower animate__repeat-3"
                                      icon={faPlus}
                                    />
                                    <i className="fa fa-plus text-success"></i>
                                  </button>
                                </h5>
                                <i className="fa fa-plus text-success"></i>
                              </div>
                              <div className="d-flex align-items-center">
                                <h5 className="text-grey">
                                  R{order_item.item_obj.price}
                                </h5>
                              </div>
                              <div className="d-flex align-items-center">
                                <h5 className="text-grey">
                                  R{order_item.final_price}
                                </h5>
                              </div>
                              <div className="d-flex align-items-center">
                                <Button
                                  onClick={() =>
                                    handleRemoveItem(order_item.id)
                                  }
                                  variant="light"
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="mb-1 text-danger animate__animated animate__wobble animate_slow"
                                  />
                                </Button>
                                {/* <i className="fa fa-trash mb-1 text-danger"></i> */}
                              </div>
                            </div>
                            <hr className="m-0" />
                          </Fragment>
                        );
                      })}
                  </>
                ) : (
                  <Container fluid className="loading">
                    <Loader />
                  </Container>
                )}
                <div className="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded">
                  <div className="d-flex flex-column align-items-center product-details">
                    <h4>Total amount: R{cart?.total}</h4>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mt-3 p-2 bg-white rounded">
                  <Link
                    to="/checkout"
                    className="btn btn-primary w-100 btn-block btn-lg ml-2 pay-button"
                    type="button"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            ) : (
              <Container fluid>
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <h6>Shopping Bag</h6>
                    <p>
                      There no items in your bag go to product page to add your
                      items
                    </p>
                    <Link to="/shop">
                      <Button variant="primary">To Products Page</Button>
                    </Link>
                  </div>
                </div>
              </Container>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
