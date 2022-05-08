import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form } from "react-bootstrap";
import Summary from "../components/Summary";
import { authAxios } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";

export default function Checkout() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [payment, setPayment] = useState("");
  const [change, setChange] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState({});
  const navigate = useNavigate();

  const cartFetch = () => {
    authAxios
      .get("/order-summary/")
      .then((res) => {
        setCart(res.data);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const handleGetDefaultAddress = (rooms) => {
    const filteredAddresses = rooms.filter((el) => el.default === true);
    if (filteredAddresses.length > 0) {
      return filteredAddresses[0].id;
    }
    return "";
  };

  const handleFetchRoomInfo = () => {
    setLoading(true);
    authAxios
      .get("/room-info/")
      .then((res) => {
        setRooms(res.data);
        setSelectedRoom(handleGetDefaultAddress(res.data));
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const handleSelectChange = (e) => {
    setSelectedRoom(e.target.value);
  };
  const handlePaymentChange = (e) => {
    setPayment(e.target.value);
  };

  useEffect(() => {
    document.title = "Checkout";
    cartFetch();
    handleFetchRoomInfo();
  }, []);
  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    if ((payment === "") | (selectedRoom === "")) {
      setMessage(
        "You do not have the selected address or payment please make sure you have done that"
      );
      setError(true);
      setLoading(false);
    } else {
      if (payment === "cash") {
        authAxios
          .post("/checkout/", {
            payment,
            change,
            selectedRoom,
            token: "",
          })
          .then((res) => {
            setLoading(false);
            setMessage("Order Received");
            navigate("/order-confirm", { replace: true });
          })
          .catch((err) => {
            setLoading(false);
            setMessage(err);
          });
      } else if (payment === "card") {
        var yoco = new window.YocoSDK({
          publicKey: "pk_live_98cbefd9P4Py4Pk4c854",
        });
        yoco.showPopup({
          amountInCents: (cart?.total + 3) * 100,
          currency: "ZAR",
          name: "Resgetit",
          description: "Skoloto sa Resgetit",
          callback: function (result) {
            // This function returns a token that your server can use to capture a payment
            if (result.error) {
              const errorMessage = result.error.message;
              alert("error occured: " + errorMessage);
            } else {
              const config = {
                headers: {
                  "Content-type": "application/json",
                },
              };
              authAxios
                .post(
                  "/checkout/",
                  {
                    payment,
                    change,
                    selectedRoom,
                    token: result.id,
                  },
                  config
                )
                .then((res) => {
                  setMessage("Order Received");
                  navigate("/order-confirm", { replace: true });
                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                  setError(true);
                  setMessage(error.response.data.errorMessage);
                });
            }
          },
        });
      }
    }
  };
  const handleSubmit = (e) => {
    handleCompleteOrder(e);
    if (error) {
      setError(true);
    }
  };
  return (
    <>
      <div className=" container-fluid my-5 ">
        {loading && (
          <Container fluid>
            <Loader />
          </Container>
        )}
        '
        <div className="row justify-content-center ">
          <div className="col-xl-10">
            <div className="card shadow-sm">
              <div className="row p-2 mt-3 justify-content-between mx-sm-2">
                <div className="col">
                  <div className="row justify-content-start ">
                    <div className="col"> RES GETIT </div>
                  </div>
                </div>
              </div>
              <div className="row mx-auto justify-content-center text-center">
                <div className="col-12 mt-3 ">
                  <nav aria-label="breadcrumb" className="second ">
                    <ol className="breadcrumb indigo lighten-6 first ">
                      <li className="breadcrumb-item font-weight-bold ">
                        <Link to={"/"} className="black-text text-uppercase ">
                          <span className="mr-md-3 mr-1">BACK TO SHOP</span>
                        </Link>{" "}
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                      </li>
                      <li className="breadcrumb-item font-weight-bold">
                        <Link to="/shop" className="black-text text-uppercase">
                          <span className="mr-md-3 mr-1">SHOPPING BAG</span>
                        </Link>{" "}
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                      </li>
                      <li className="breadcrumb-item font-weight-bold">
                        <Link
                          to={"/checkout"}
                          className="black-text text-uppercase active-2"
                        >
                          <span className="mr-md-3 mr-1">CHECKOUT</span>
                        </Link>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="row justify-content-around">
                <div className="col-md-5">
                  <div className="card border-0">
                    <div className="card-header pb-0">
                      <h2 className="card-title space ">Checkout</h2>
                      <hr className="my-0" />
                    </div>
                    {message && (
                      <Alert variant={error ? "danger" : "success"}>
                        {message}
                      </Alert>
                    )}
                    <div className="card-body">
                      <div className="row mt-4">
                        <div className="col">
                          <p className="text-muted mb-2 ">ROOM DETAILS</p>
                          <hr className="mt-0" />
                        </div>
                      </div>
                      <Container>
                        {rooms.length > 0 ? (
                          <>
                            <label>Select the Shipping room info</label>
                            <select
                              className="w-100 form-control-sm"
                              name="selectedRoom"
                              defaultValue={selectedRoom}
                              onChange={handleSelectChange}
                            >
                              {rooms.map((room) => {
                                return (
                                  <option
                                    key={room.id}
                                    value={room.id}
                                  >{`${room.room_number}_${room.building}_${room.cell_number}`}</option>
                                );
                              })}
                            </select>
                            <small className="mt-5">
                              Want to add other room?{" "}
                              <Link to="/profile">Click Here</Link>
                            </small>
                          </>
                        ) : (
                          <>
                            <p>
                              You currently do have Shipping Room info Please
                              add you room info
                            </p>
                            <Link to="/profile">
                              <Button variant="primary">Add</Button>
                            </Link>
                          </>
                        )}
                      </Container>

                      <div className="row mt-4">
                        <div className="col">
                          <p className="text-muted mb-2">PAYMENT</p>
                          <hr className="mt-0" />
                        </div>
                      </div>
                      <Container>
                        <h4>Complete the order</h4>
                        {rooms.length < 0 ? (
                          <>
                            <p>
                              Choose room address before you complete the Order
                            </p>
                          </>
                        ) : (
                          <div className="mt-3">
                            {/* {% for value, name in form.fields.payment.choices %} */}
                            <fieldset>
                              <Form.Group className="mb-3">
                                <h5>Choose your paying method</h5>
                                <Col sm={12}>
                                  <Form.Check
                                    onChange={handlePaymentChange}
                                    type="radio"
                                    value={"cash"}
                                    label="Pay Cash"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                  />
                                  <div
                                    className={`form-group change-form animate__animated animate__headShake animate_faster ${
                                      payment === "cash" ? "" : "is-hidden"
                                    }`}
                                  >
                                    {" "}
                                    <label
                                      htmlFor="NAME"
                                      className="small text-muted mb-1"
                                    >
                                      Change:
                                    </label>
                                    <input
                                      type="text"
                                      name="room_number"
                                      className="form-control form-control-sm"
                                      required=""
                                      id="change"
                                      onChange={(e) =>
                                        setChange(e.target.value)
                                      }
                                    />
                                    <small className="text-muted mb">
                                      Amount of change we should come with...
                                    </small>
                                  </div>
                                  <Form.Check
                                    onChange={handlePaymentChange}
                                    value={"card"}
                                    type="radio"
                                    label="Pay With Card"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                  />
                                </Col>
                              </Form.Group>
                            </fieldset>

                            <div className="row mb-md-5">
                              <div className="col">
                                {" "}
                                <button
                                  type="submit"
                                  name=""
                                  id=""
                                  className="btn btn-primary w-100"
                                  onClick={handleSubmit}
                                >
                                  {loading ? <Loader /> : "Complete Order"}
                                </button>{" "}
                              </div>
                            </div>
                          </div>
                        )}
                        {message && (
                          <Alert variant={error ? "danger" : "success"}>
                            {message}
                          </Alert>
                        )}
                      </Container>
                    </div>
                  </div>
                </div>
                <Summary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
