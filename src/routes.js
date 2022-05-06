import Categories from "./components/Categories";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Routes, Route } from "react-router-dom";
import OrderSummary from "./pages/OrderSummary";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderCreated from "./pages/OrderCreated";
import Support from "./pages/Support";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordResetView from "./pages/PasswordResetView";
import UserRegistered from "./pages/UserRegistered";

const BaseRouter = () => (
  <>
    <Routes>
      <Route path="/" element={<Categories />} />
      <Route path="shop" element={<Products />} />
      <Route path="/product/:id" element={<ProductView />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="cart" element={<OrderSummary />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="profile" element={<Profile />} />
      <Route path="order-confirm" element={<OrderCreated />} />
      <Route path="support" element={<Support />} />
      <Route path="register-complete" element={<UserRegistered />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route
        path="password-reset/confirm/:uid/:utoken"
        element={<PasswordResetView />}
      />
    </Routes>
  </>
);

export default BaseRouter;
