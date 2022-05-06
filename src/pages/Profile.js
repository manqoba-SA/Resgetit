import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Tab,
} from "react-bootstrap";

import { authAxios } from "../utils";
import Loader from "../components/Loader";
import Message from "../components/Message";
import AddressForm from "../components/AddressForm";
import { authGetUserInfo } from "../actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";
export default function Profile() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const authenticated = useSelector((state) => state.authList.token !== null);
  const [rooms, setRooms] = useState([]);
  const [userId, setUserId] = useState();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const authList = useSelector((state) => state.authList);
  const { user } = authList;
  console.log(user);

  const handleFetchRoomInfo = () => {
    setLoading(true);
    authAxios
      .get("/room-info")
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleFetchUserId = () => {
    authAxios
      .get("/user-id")
      .then((res) => {
        setUserId(res.data.userID);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDeleteAddress = (addressID) => {
    setLoading(true);
    authAxios
      .delete(`room-info/${addressID}/delete`)
      .then((res) => {
        handleCallback();
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleCallback = () => {
    handleFetchRoomInfo();
    setSelectedAddress(null);
  };

  useEffect(() => {
    if (!authenticated) {
      navigate("/signin");
    } else {
      handleFetchRoomInfo();
      handleFetchUserId();
      dispatch(authGetUserInfo());
    }
  }, []);
  return (
    <>
      <Container className="mt-10">
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col sm={4}>
              <ListGroup>
                <ListGroup.Item action href="#link1">
                  Room Address
                </ListGroup.Item>
                <ListGroup.Item action href="#link2">
                  Personal Info
                </ListGroup.Item>
                <ListGroup.Item action href="#link3">
                  Orders
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={8} className="align-text-center justify-content-center">
              <Tab.Content>
                <Tab.Pane eventKey="#link1">
                  <Container>
                    {loading && <Loader />}
                    {error && (
                      <>
                        <Message variant={"danger"} text={error} />
                      </>
                    )}
                    <h4 className="text-center m-2">Update Room Address</h4>
                    <Row xs={1} md={3} className="g-4 mt-3">
                      {rooms.map((room) => {
                        return (
                          <Col key={room.id}>
                            <Card border="Info" className="building-card">
                              <Card.Header>Address {room.id}</Card.Header>
                              <Card.Body>
                                {room.default && (
                                  <Badge bg="success">Default</Badge>
                                )}
                                <p className="m-0">{room.cell_number}</p>
                                <p className="m-0">{room.building}</p>
                                <p className="m-0">{room.room_number}</p>
                                <hr />
                                <Row>
                                  <Col>
                                    <Button
                                      onClick={() =>
                                        handleDeleteAddress(room.id)
                                      }
                                      variant="outline-danger"
                                      size="sm"
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                  <Col>
                                    <Button
                                      onClick={() => handleSelectAddress(room)}
                                      variant="outline-warning"
                                      size="sm"
                                    >
                                      Update
                                    </Button>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>

                    {selectedAddress === null ? (
                      <AddressForm
                        formType={CREATE_FORM}
                        userID={userId}
                        callback={handleCallback}
                      />
                    ) : null}
                    {selectedAddress && (
                      <AddressForm
                        userID={userId}
                        room={selectedAddress}
                        formType={UPDATE_FORM}
                        callback={handleCallback}
                      />
                    )}
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="#link2">
                  <Container>
                    <h5>My Personal Information</h5>
                    <div class="row gutters-sm">
                      <div class="col-md-4 mb-3">
                        <div class="card my-card">
                          <div class="card-body">
                            <div class="d-flex flex-column align-items-center text-center">
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                                alt="Admin"
                                class="rounded-circle"
                                width="150"
                              />
                              <div class="mt-3">
                                <h4>{user?.username}</h4>
                                <p class="text-secondary mb-1">
                                  Customer Account
                                </p>
                                <p class="text-muted font-size-sm">
                                  New Dorfontein, Johannesburg, SA
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="card my-card mb-3">
                          <div class="card-body">
                            <div class="row">
                              <div class="col-sm-3">
                                <h6 class="mb-0">Username</h6>
                              </div>
                              <div class="col-sm-9 text-secondary">
                                {user?.username}
                              </div>
                            </div>
                            <hr />
                            <div class="row">
                              <div class="col-sm-3">
                                <h6 class="mb-0">Email</h6>
                              </div>
                              <div class="col-sm-9 text-secondary">
                                {user?.email}
                              </div>
                            </div>
                            <hr />
                            <div class="row">
                              <div class="col-sm-3">
                                <h6 class="mb-0">Firstname</h6>
                              </div>
                              <div class="col-sm-9 text-secondary">
                                {user?.first_name
                                  ? user?.first_name
                                  : "........"}
                              </div>
                            </div>
                            <hr />
                            <div class="row">
                              <div class="col-sm-3">
                                <h6 class="mb-0">Lastname</h6>
                              </div>
                              <div class="col-sm-9 text-secondary">
                                {user?.last_name ? user?.last_name : "........"}
                              </div>
                            </div>
                            <hr />
                            <div class="row">
                              <div class="col-sm-12">
                                <button
                                  class="btn btn-info "
                                  target="__blank"
                                  disabled
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey="#link3">
                  <p>Orders</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
}
