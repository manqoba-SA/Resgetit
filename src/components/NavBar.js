import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import "../css/Navbar.css";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import logo from "../images/LOGO.svg";
import bagImage from "../images/shopping-bag.png";
import searchImage from "../images/search.png";
import menuIcon from "../images/menu.png";
import closeIcon from "../images/close.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faHome,
  faLifeRing,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./SearchBox";
import { listCategories } from "../actions/productActions";
import { authGetUserInfo } from "../actions/authActions";

export default function NavBar({
  authenticated,
  cart,
  handleShowCart,
  handleLogOut,
}) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  const authList = useSelector((state) => state.authList);
  const { user } = authList;

  useEffect(() => {
    dispatch(listCategories());
    dispatch(authGetUserInfo());
  }, [dispatch]);
  const submitHandler = (keyword) => {
    navigate(`/shop?category=${keyword}`);
  };
  return (
    <>
      <Navbar expand="lg" bg="light" sticky="top" className="main-menu">
        <Container>
          <ul className="navbar-nav d-flex d-md-none">
            <li className="d-flex responsive-icons">
              <button className="btn btn-link" onClick={handleShowCart}>
                <img src={bagImage} height="25" width="25" alt="shopping-bag" />{" "}
                {authenticated && (
                  <div className="badge cart-count">{`${
                    cart !== null ? cart?.order_items.length : 0
                  }`}</div>
                )}
              </button>
              {toggleSearch ? (
                <button
                  className="btn btn-link search-button"
                  onClick={() => {
                    setToggleSearch(false);
                  }}
                >
                  <img
                    src={closeIcon}
                    height="25"
                    width="25"
                    alt="close-icon"
                  />
                </button>
              ) : (
                <button
                  className="btn btn-link search-button"
                  onClick={() => {
                    setToggleSearch(true);
                  }}
                >
                  <img
                    src={searchImage}
                    height="25"
                    width="25"
                    alt="search-icon"
                  />
                </button>
              )}
            </li>
          </ul>
          <Navbar.Brand className="navbar-brand" href="/">
            <img
              src={logo}
              width="120"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
          </Navbar.Brand>
          <button
            onClick={() => setToggleMenu(true)}
            type="button"
            id="sidebarCollapse"
            className="btn menu-btn btn-link d-block d-md-none"
          >
            <img src={menuIcon} height="25" width="25" alt="menuIcon" />
          </button>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link>
                <Link to="/shop">Products</Link>
              </Nav.Link>
              {categories.map((category) => (
                <Fragment key={category.id}>
                  {category.name === "Services" ? (
                    <Nav.Link onClick={() => submitHandler(category.id)}>
                      {category.name}
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                </Fragment>
              ))}
              <NavDropdown title="Categories" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/shop">View All Products</Link>
                </NavDropdown.Item>
                {categories.map((category) => (
                  <NavDropdown.Item
                    key={category.id}
                    onClick={() => submitHandler(category.id)}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link>
                <Link to="/support">Support</Link>
              </Nav.Link>
            </Nav>
            <Nav>
              <div className="nav-item d-flex">
                <button
                  onClick={handleShowCart}
                  className="btn btn-link animate__animated animate__tada animate__slow"
                >
                  <img
                    src={bagImage}
                    alt="shopping bag"
                    height="25"
                    width="25"
                  />
                  {authenticated && (
                    <span className="badge cart-count">{`${
                      cart !== null ? cart?.order_items.length : 0
                    }`}</span>
                  )}
                </button>

                {toggleSearch ? (
                  <button
                    className="btn btn-link toggle-search animate__animated animate__fadeIn"
                    onClick={() => {
                      setToggleSearch(false);
                    }}
                  >
                    <img
                      src={closeIcon}
                      height="25"
                      width="25"
                      alt="close-icon"
                    />
                  </button>
                ) : (
                  <button
                    className="btn btn-link animate__animated animate__fadeIn"
                    onClick={() => {
                      setToggleSearch(true);
                    }}
                  >
                    <img
                      src={searchImage}
                      height="25"
                      width="25"
                      alt="search-icon1"
                    />
                  </button>
                )}
              </div>
              <>
                {authenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="d-flex nav-link"
                      role="button"
                    >
                      <Button
                        variant="outline-secondary"
                        className="mx-2 register-nav-button"
                      >
                        <FontAwesomeIcon icon={faUser} size={"lg"} />{" "}
                        {user?.username}
                      </Button>
                    </Link>
                    <Nav.Link className="d-flex">
                      <Button
                        onClick={handleLogOut}
                        className="mx-2 register-nav-button"
                      >
                        Logout
                      </Button>
                    </Nav.Link>
                  </>
                ) : (
                  <div className="d-flex">
                    <Link to="/signup">
                      <Button className="mx-2 register-nav-button">
                        Register
                      </Button>
                    </Link>
                    <Link to="/signin">
                      <Button className="mx-2 login-nav-button">Login</Button>
                    </Link>
                  </div>
                )}
              </>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {toggleSearch && (
        <>
          <Container className="toggle-search animate__animated animate__bounceInDown">
            <SearchBox />
          </Container>
        </>
      )}

      <nav id="sidebar" className={toggleMenu ? "active" : ""}>
        <div className="sidebar-header">
          <div className="container">
            <div className="row align-items-center">
              {authenticated ? (
                <>
                  <div className="col-10 pl-0">
                    <Link
                      onClick={() => setToggleMenu(false)}
                      to="/profile"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogOut}
                      className="btn btn-sm mx-3 btn-primary"
                    >
                      {" "}
                      Logout{" "}
                    </button>
                  </div>
                </>
              ) : (
                <div className="col-10 pl-0">
                  <Link
                    to="/signup"
                    onClick={() => setToggleMenu(false)}
                    className="btn btn-sm btn-primary"
                  >
                    Register
                  </Link>
                  <Link
                    to="/signin"
                    onClick={() => setToggleMenu(false)}
                    className="btn btn-sm mx-3 btn-primary"
                  >
                    {" "}
                    Log In{" "}
                  </Link>
                </div>
              )}
              <div className="col-2 text-left">
                <button
                  onClick={() => setToggleMenu(false)}
                  type="button"
                  id="sidebarCollapseX"
                  className="btn btn-link"
                >
                  <img
                    src={closeIcon}
                    height="25"
                    width="25"
                    alt="close-icon1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <ul className="list-unstyled components links">
          <li>
            <Nav.Link onClick={() => setToggleMenu(false)}>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </Nav.Link>
          </li>
          <li>
            <Nav.Link onClick={() => setToggleMenu(false)}>
              <Link to="/shop">
                <FontAwesomeIcon icon={faShoppingBag} /> Products
              </Link>
            </Nav.Link>
          </li>
          <li>
            {categories.map((category) => (
              <Fragment key={category.id}>
                {category.name === "Services" ? (
                  <Nav.Link onClick={() => submitHandler(category.id)}>
                    <FontAwesomeIcon icon={faCogs} /> {category.name}
                  </Nav.Link>
                ) : (
                  ""
                )}
              </Fragment>
            ))}
          </li>
          <li>
            <Nav.Link onClick={() => setToggleMenu(false)}>
              <Link to="/support">
                <FontAwesomeIcon icon={faLifeRing} /> Support
              </Link>
            </Nav.Link>
          </li>
        </ul>
        <h6 className="text-uppercase mb-1">Categories</h6>
        <ul className="list-unstyled components mb-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Nav.Link onClick={() => submitHandler(category.id)}>
                {category.name}
              </Nav.Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
