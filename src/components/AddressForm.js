import React, { useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";

import { authAxios } from "../utils";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";
export default function AddressForm({ room, formType, userID, callback }) {
  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ default: false });

  const handleToogleChange = (e) => {
    const updatedFormData = {
      ...formData,
      default: !formData.default,
    };
    setFormData(updatedFormData);
  };

  const handleChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
  };

  const handleCreateRoomInfo = () => {
    setSaving(true);
    authAxios
      .post("/room-info/create", {
        ...formData,
        user: userID,
      })
      .then((res) => {
        setSaving(false);
        setSuccess(true);
        callback();
      })
      .catch((error) => {
        setSaving(false);
        setError(error.response.data);
      });
  };

  const handleUpdateAddress = () => {
    authAxios
      .put(`room-info/${formData.id}/update`, {
        ...formData,
        user: userID,
      })
      .then((res) => {
        setSaving(false);
        setSuccess(true);
        setFormData({ default: false });
        callback();
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleSubmit = (e) => {
    setSaving(true);
    e.preventDefault();
    if (formType === UPDATE_FORM) {
      handleUpdateAddress();
    } else {
      handleCreateRoomInfo();
    }
  };

  useEffect(() => {
    if (formType === UPDATE_FORM) {
      setFormData(room);
    }
  }, [room]);

  return (
    <>
      {success && (
        <Alert variant="success">
          <p>Room Address updated👍</p>
        </Alert>
      )}
      {error && (
        <>
          <Message variant={"danger"} text={error} />
        </>
      )}
      <form className="sm-4 profile-form" onSubmit={handleSubmit}>
        {saving && (
          <Container fluid className="loading">
            <Loader />
          </Container>
        )}
        <div className="form-group">
          <label htmlFor="cell_number">Contact/WhatsApp number</label>
          <input
            onChange={handleChange}
            value={formData.cell_number}
            name="cell_number"
            type="text"
            className="form-control form-control-sm"
            id="exampleInputEmail1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="building">Building</label>
          <select
            onChange={handleChange}
            aria-label="Default select example"
            className="form-control form-control-sm"
            name="building"
            value={formData.building ? formData.building : ""}
            required
          >
            <option>Click to select the building</option>
            <option value="Quintal">Quintal</option>
            <option value="Miller">Miller</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="room_number">Room Number</label>
          <input
            onChange={handleChange}
            value={formData.room_number}
            required
            name="room_number"
            type="text"
            className="form-control form-control-sm"
          />
        </div>
        <div className="form-group">
          <Form.Check
            onChange={handleToogleChange}
            name="default"
            type="switch"
            id="custom-switch"
            label="Make this a default room address"
          />
        </div>

        <Button variant="primary" type="submit" className="login-btn">
          {saving ? <Loader /> : "Save"}
        </Button>
      </form>
    </>
  );
}
