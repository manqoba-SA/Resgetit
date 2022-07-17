import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, Alert, Container } from "react-bootstrap";
import { authUpdateUserInfo } from "../actions/authActions";
import Message from "./Message";
import Loader from "./Loader";

export default function UserForm({ user, showModal, handleClose }) {
  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const handleUserUpdate = () => {
    setSaving(true);
    dispatch(
      authUpdateUserInfo(
        formData?.username,
        formData?.first_name,
        formData?.last_name
      )
    );
    setSaving(false);
    setSuccess(true);
  };

  useEffect(() => {
    setFormData(user);
  }, [user]);

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Personal details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success && (
            <Alert variant="success">
              <p>Personal Information updated👍</p>
            </Alert>
          )}
          {error && (
            <>
              <Message variant={"danger"} text={error} />
            </>
          )}
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {saving && (
                <Container fluid className="loading">
                  <Loader />
                </Container>
              )}
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData?.username}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData?.first_name}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={formData?.last_name}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUserUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
