import React, { Fragment, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { authAxios } from "../utils";
import Loader from "./Loader";
import Message from "./Message";

export default function Summary() {
  const [cart, setCart] = useState({ data: null, error: null, loading: false });
  const cartFetch = () => {
    setCart({ data: null, error: null, loading: true });
    authAxios
      .get("/order-summary/")
      .then((res) => {
        setCart({ data: res.data, loading: false, error: null });
      })
      .catch((error) => {
        setCart({ data: null, error: error, loading: false });
      });
  };
  useEffect(() => {
    cartFetch();
  }, []);
  const { data, error, loading } = cart;
  const [currentState, setCurrentState] = useState({
    loading: false,
    error: null,
  });

  const [code, setCode] = useState("");
  const handleAddCoupon = (e, code) => {
    e.preventDefault();
    setCurrentState({ loading: true, error: null });
    authAxios
      .post("/add-coupon/", { code })
      .then((res) => {
        setCurrentState({ loading: false, error: null });
        cartFetch();
      })
      .catch((err) => {
        setCurrentState({ loading: false, error: err });
      });
  };

  const handleSubmit = (e) => {
    handleAddCoupon(e, code);
    if (currentState.error) {
      console.log(currentState.error.response.data);
    }
    setCode("");
  };

  return (
    <>
      <div className="col-md-5">
        <div className="card border-0 ">
          <div className="card-header card-2">
            <p className="card-text text-muted mt-md-4 mb-2 space">
              ORDER SUMMARY
            </p>
            <hr className="my-2" />
          </div>
          <div className="card-body pt-0">
            {!loading ? (
              <>
                {data &&
                  data.order_items.map((order_item) => {
                    return (
                      <Fragment key={order_item.id}>
                        <div className="row justify-content-between">
                          <div className="col-auto col-md-7">
                            <div className="media flex-column flex-sm-row">
                              <div className="media-body my-auto">
                                <div className="row ">
                                  <div className="col">
                                    <p className="mb-0">
                                      <b>{order_item.item}</b>
                                    </p>
                                    <small className="text-muted">
                                      {order_item.item_obj.brand}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pl-0 flex-sm-col col-auto my-auto">
                            <p className="boxed-1">{order_item.quantity}</p>
                          </div>
                          <div className="pl-0 flex-sm-col col-auto my-auto">
                            <p>
                              <b>R{order_item.final_price}</b>
                            </p>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    );
                  })}
              </>
            ) : (
              <Container fluid className="loading">
                <Loader />
              </Container>
            )}

            {data?.coupon ? (
              <div className="row justify-content-between d-flex gift">
                <div className="col-auto col-md-7">
                  <div className="media flex-column flex-sm-row">
                    <div className="media-body my-auto">
                      <div className="row ">
                        <div className="col">
                          <p className="mb-0">
                            <b>Gift Code</b>
                          </p>
                          <small>{data?.coupon.code}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-0 flex-sm-col col-auto my-auto">
                  <p>
                    <b>
                      -R
                      {data?.coupon.amount}
                    </b>
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
            <hr className="my-2" />
            <div className="row ">
              <div className="col">
                <div className="row justify-content-between">
                  <div className="col-4">
                    <p>
                      <b>Total</b>
                    </p>
                  </div>
                  <div className="flex-sm-col col-auto">
                    <p className="mb-1">
                      <b>R{data?.total}</b>
                    </p>
                  </div>
                </div>
                <hr className="my-0" />
              </div>
            </div>
            <div className="row mb-5 mt-4 ">
              <div className="flex-row align-items-center mt-3 p-2 col-md-7 col-lg-6 mx-auto rounded">
                <form method="POST" action="{% url 'resgetitapp:add-coupon'%}">
                  <label
                    htmlFor="gift"
                    className="small text-muted mb-1 align-items-center"
                  >
                    GIFT CODE
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="gift"
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-dark btn-sm ml-2"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Apply
                    </button>
                  </div>
                </form>
                {error && (
                  <>
                    <Message variant={"danger"} text={error} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
