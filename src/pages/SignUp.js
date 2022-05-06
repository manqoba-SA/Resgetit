import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authSignup } from "../actions/authActions";
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom";
import "../css/usersign.css";

export default function SignUp({ location, history }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const authList = useSelector((state) => state.authList);
  const { error, loading, token } = authList;

  useEffect(() => {
    if (token) {
      <Navigate to="/register-complete" />;
    }
  }, [history, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== password2) {
      setMessage("Passwords do not match");
    } else {
      dispatch(authSignup(username, email, password, password2));
    }
  };
  if (token) {
    return <Navigate to="/register-complete" />;
  }

  return (
    <>
      <>
        <div className="global-container">
          <div className="card login-form">
            <div className="card-body">
              <h3 className="card-title text-center">Register</h3>
              <div className="card-text">
                {message && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
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
                  <div className={loading && "disabled-content"}>
                    <div className="form-group mb-3">
                      <label for="username">Username</label>
                      <input
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        type="text"
                        className="form-control form-control-sm"
                        id="username"
                        aria-describedby="emailHelp"
                      />

                      {error ? (
                        <small className="error">{error.username}</small>
                      ) : (
                        <div class=" form-text text-muted">
                          <small>
                            Required. 150 characters or fewer. Letters, digits
                            and @/./+/-/_ only.
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label for="exampleInputEmail1">Email address</label>
                      <input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        type="email"
                        className="form-control form-control-sm"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                      />
                      {error ? (
                        <small className="error">{error.email}</small>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label for="password1">Password</label>
                      <input
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        type="password"
                        className="form-control form-control-sm"
                        id="password1"
                      />
                      {error ? (
                        <small className="error">{error.password1}</small>
                      ) : (
                        ""
                      )}
                      <div class=" form-text text-muted">
                        <div class=" form-text text-muted"></div>
                        <small>
                          <ul>
                            <li
                              className={password.length >= 8 ? "sucess" : ""}
                            >
                              Your password must contain at least 8 characters.
                            </li>
                            <li
                              className={
                                /^\d+$/.test(password) || password === ""
                                  ? ""
                                  : "sucess"
                              }
                            >
                              Your password can’t be entirely numeric.
                            </li>
                          </ul>
                        </small>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label for="password2">Repeat Password</label>
                      <input
                        onChange={(e) => {
                          setPassword2(e.target.value);
                        }}
                        type="password"
                        className="form-control form-control-sm"
                        id="password2"
                      />
                      {error ? (
                        <small className="error">{error.password2}</small>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <Button
                    disabled={loading}
                    variant="primary"
                    type="submit"
                    className="login-btn"
                  >
                    {loading && <Loader />}
                    Register
                  </Button>

                  <div className="sign-up">
                    Have an account? <a href="/signin">SignIn</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
