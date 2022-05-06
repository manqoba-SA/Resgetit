import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { authConfirmPassReset } from "../actions/authActions";
import Loader from "../components/Loader";

export default function PasswordResetView() {
  const { uid, utoken } = useParams();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const authList = useSelector((state) => state.authList);
  const { error, loading, resetToken } = authList;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setMessage("Passwords do not match");
    } else {
      dispatch(authConfirmPassReset(uid, utoken, password1, password2));
    }
  };

  return (
    <>
      <div className="global-container">
        <div className="card login-form">
          <div className="card-body">
            {resetToken ? (
              <>
                <div className="card-text">
                  <h5>
                    Password Recovered👍 Please log in your account with new
                    password
                  </h5>
                  <Link to="/signin">
                    <Button variant="primary">Login</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="card-title text-center">
                  Please enter your new Password
                </h3>
                <div className="card-text">
                  {message && (
                    <div
                      className="m-2 user-alert alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    {loading && (
                      <Container fluid className="loading">
                        <Loader />
                      </Container>
                    )}
                    <div className="form-group">
                      <label htmlFor="p1">New Password</label>
                      <input
                        onChange={(e) => {
                          setPassword1(e.target.value);
                        }}
                        type="password"
                        className="form-control form-control-sm"
                        id="p1"
                      />
                      {error && (
                        <small className="error">
                          {error.password ?? error.new_password1}
                        </small>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="p2">Repeat New Password</label>
                      <input
                        onChange={(e) => {
                          setPassword2(e.target.value);
                        }}
                        type="password"
                        className="form-control form-control-sm"
                        id="p2"
                      />
                      {error && (
                        <small className="error">
                          {error.password ?? error.new_password2}
                        </small>
                      )}
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      className="login-btn"
                    >
                      {loading ? <Loader /> : "Submit"}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
