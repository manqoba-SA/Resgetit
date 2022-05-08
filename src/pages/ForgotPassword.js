import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authPassReset } from "../actions/authActions";
import Loader from "../components/Loader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const authList = useSelector((state) => state.authList);
  const { error, loading, resetToken } = authList;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authPassReset(email));
  };
  useEffect(() => {
    document.title = "password-reset";
  }, []);

  return (
    <>
      <div className="global-container">
        <div className="card login-form">
          <div className="card-body">
            {resetToken ? (
              <>
                <div className="card-text">
                  <h5>{resetToken?.detail}</h5>
                  <a href="https://mail.google.com/">
                    <Button variant="primary">Check Email</Button>
                  </a>
                </div>
              </>
            ) : (
              <>
                <h3 className="card-title text-center">Reset Password</h3>
                <div className="card-text">
                  <form onSubmit={handleSubmit}>
                    {loading && (
                      <Container fluid className="loading">
                        <Loader />
                      </Container>
                    )}
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Email</label>
                      <input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        type="text"
                        className="form-control form-control-sm"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                      />
                      {error && <small className="error">{error.email}</small>}
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      className="login-btn"
                    >
                      {loading ? <Loader /> : "Submit"}
                    </Button>
                    <div className="sign-up">
                      Go back to login page?{" "}
                      <Link to="/signin">Click here</Link>
                    </div>
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
