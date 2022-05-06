import { BrowserRouter as Router } from "react-router-dom";
import { authCheckState } from "./actions/authActions";
import "./App.css";
import "animate.css/animate.css";
import { useDispatch } from "react-redux";
import Layout from "./pages/Layout";
import BaseRouter from "./routes";
import { useEffect } from "react";
import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function App() {
  const dispatch = useDispatch();
  const onTryAutoSignup = () => dispatch(authCheckState());
  useEffect(() => {
    onTryAutoSignup();
  }, [dispatch]);
  return (
    <Router>
      <Layout>
        <BaseRouter />
      </Layout>
    </Router>
  );
}

export default App;
