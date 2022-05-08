import React, { useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authGetUserInfo } from "../actions/authActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function UserRegistered() {
  const dispatch = useDispatch();
  const authList = useSelector((state) => state.authList);

  const { error, loading, user } = authList;

  useEffect(() => {
    document.title = "Welcome✌️";
    dispatch(authGetUserInfo());
  }, []);
  return (
    <>
      {loading && <Loader />}{" "}
      {error && (
        <>
          <Message variant={"danger"} text={error} />
        </>
      )}
      <Container className="w-50">
        <Card className="mx-10 mt-10 my-card rounded-right">
          <Card.Body>
            <h5>account created for {user?.username}</h5>
            <p>Hello👋🏽 Thank you creating an account in our plartform</p>
            <hr />
            <p>
              Now you can continue to add your room address info or skip for
              later
            </p>
            <Row>
              <Col>
                <Link to="/profile">
                  <Button variant="primary">Add address</Button>
                </Link>
              </Col>
              <Col>
                <Link to="/">
                  <Button variant="outline-primary">Skip For Now</Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
