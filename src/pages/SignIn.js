import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../actions/authActions";
import Loader from "../components/Loader";
import { Link, Navigate } from "react-router-dom";
import "../css/usersign.css";

export default function SignIn({ history }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const authList = useSelector((state) => state.authList);
  const { error, loading, token } = authList;

  useEffect(() => {
    document.title = "Login | resgetit";
    if (token) {
      <Navigate to="/" />;
    }
  }, [history, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(authLogin(username, password));
  };
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="global-container">
        <div className="card login-form">
          <div className="card-body">
            <h3 className="card-title text-center">Login</h3>
            <div className="card-text">
              <form onSubmit={handleSubmit}>
                {loading && (
                  <Container fluid className="loading">
                    <Loader />
                  </Container>
                )}
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Username</label>
                  <input
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    type="text"
                    className="form-control form-control-sm"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                  {error && <small className="error">{error.username}</small>}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Password</label>
                  <Link
                    to="/forgot-password"
                    href="#"
                    className="forgot-password"
                  >
                    Forgot password?
                  </Link>
                  <input
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type="password"
                    className="form-control form-control-sm"
                    id="exampleInputPassword1"
                  />
                  {error && (
                    <small className="error">
                      {error.password ?? error.non_field_errors}
                    </small>
                  )}
                </div>

                <Button variant="primary" type="submit" className="login-btn">
                  {loading ? <Loader /> : "Login"}
                </Button>
                <div className="sign-up">
                  Don't have an account? <Link to="/signup">Create One</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
