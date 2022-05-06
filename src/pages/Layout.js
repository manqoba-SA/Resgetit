import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Announcement from "../components/Announcement";
import { cartFetch } from "../actions/cartActions";
import CartOffCanvas from "../components/CartOffCanvas";
import { logout } from "../actions/authActions";
import { listAnnouncement } from "../actions/announcementActions";

export default function Layout(props) {
  const announcementList = useSelector((state) => state.announcementList);
  const { error, loading, announcement } = announcementList;
  const dispatch = useDispatch();
  const fetchCart = () => dispatch(cartFetch());
  const fetchAnnouncement = () => dispatch(listAnnouncement());
  const authenticated = useSelector((state) => state.authList.token !== null);
  const cart = useSelector((state) => state.cart.data);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShowCart = () => setShow(true);
  const handleLogOut = () => dispatch(logout());
  useEffect(() => {
    fetchCart();
    fetchAnnouncement();
  }, [dispatch]);
  return (
    <div className="animate__animated animate__fadeIn animate__faster">
      <Announcement
        announcements={announcement}
        loading={loading}
        error={error}
      />
      <NavBar
        authenticated={authenticated}
        cart={cart}
        handleShowCart={handleShowCart}
        handleLogOut={handleLogOut}
      />
      <CartOffCanvas
        show={show}
        onHide={handleClose}
        showToast={false}
        toastOnClose=""
        message=""
        cartUpdate={cart}
      />
      <>{props.children}</>
      <Footer />
    </div>
  );
}
