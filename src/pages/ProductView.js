import {
  faAngleDoubleRight,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Carousel,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";
import CartOffCanvas from "../components/CartOffCanvas";
import { authAxios } from "../utils";
import { addToCartURL } from "../constants/cartConstants";
import { cartFetch } from "../actions/cartActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

export default function ProductView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  useEffect(() => {
    dispatch(listProductDetails(id));
    document.title = `${product.name} | resgetit`;
  }, [dispatch, product]);
  const fetchCart = () => dispatch(cartFetch());
  const cart = useSelector((state) => state.cart.data);
  const [loadingState, setLoadingState] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleAddToCart = (slug) => {
    setLoadingState(true);
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        fetchCart();
        handleShow();
        setShowToast(true);
        setLoadingState(false);
        setMessage(`${slug} Added To Your Bag`);
      })
      .catch((err) => {
        handleShow();
        setShowToast(true);
        setLoadingState(false);
        setMessage(err);
      });
  };
  return (
    <>
      <Container>
        <CartOffCanvas
          show={show}
          onHide={handleClose}
          showToast={showToast}
          toastOnClose={() => setShowToast(false)}
          message={message}
          cartUpdate={cart}
        />
        <br />
        {loading && <Loader />}
        {error && (
          <>
            <Message variant={"danger"} text={error} />
          </>
        )}
        <Row className="mx-auto justify-content-center text-center">
          <Col md={12} className="mt-3">
            <nav aria-label="breadcrumb" className="second">
              <ol className="breadcrumb indigo lighten-6 first ">
                <li className="breadcrumb-item font-weight-bold ">
                  <Link to="/" className="black-text text-uppercase ">
                    <span className="mr-md-3 mr-1">HOME</span>
                  </Link>
                  {"  "}
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </li>
                <li className="breadcrumb-item font-weight-bold">
                  <Link
                    to="/shop"
                    href="{% url 'resgetitapp:products' %}"
                    className="black-text text-uppercase"
                  >
                    <span className="mr-md-3 mr-1">GO BACK TO SHOP</span>
                  </Link>
                  {"  "}
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </li>
                <li className="breadcrumb-item font-weight-bold">
                  <Link
                    to="/"
                    className="black-text text-uppercase active-2"
                    href="#"
                  >
                    <span className="mr-md-3 mr-1">{product.name}</span>
                  </Link>
                </li>
              </ol>
            </nav>
          </Col>
        </Row>
        <Row>
          <Col sm={6} className="border-right">
            <Row className="d-flex justify-content-center mt-10">
              <Col md={9}>
                <Carousel>
                  <Carousel.Item>
                    <img
                      className="img-fluid rounded w-100 cover"
                      src={product.slide_image}
                      alt="First slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="img-fluid rounded d-block w-100 cover"
                      src={product.slide_image1}
                      alt="Second slide"
                    />
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="img-fluid rounded d-block w-100 cover"
                      src={product.slide_image2}
                      alt="Third slide"
                    />
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Col>
          <Col sm="6">
            <article className="card-body p-5">
              <h3 className="title mb-3">{product.name}</h3>

              <p className="price-detail-wrap">
                <span className="price h3">
                  <span className="currency">R</span>
                  <span>{product.price}</span>
                </span>
                <span>per item</span>
              </p>
              <div className="param param-feature">
                <h6>ProductID</h6>
                <p>00{product.id}</p>
              </div>
              <div className="param param-feature">
                <h6>Brand</h6>
                <p>{product.brand}</p>
              </div>
              <div className="param param-feature">
                <h6>Delivery</h6>
                <p>To your door</p>
              </div>

              <hr />
              {product.countInStock > 0 ? (
                <>
                  <Button
                    onClick={() => handleAddToCart(product.slug)}
                    className="btn-continue btn-sm"
                  >
                    {" "}
                    <FontAwesomeIcon icon={faShoppingBag} />
                    Add to Bag{" "}
                  </Button>
                </>
              ) : (
                <button
                  disabled
                  className="btn btn-continue text-uppercase btn-sm"
                >
                  {" "}
                  <FontAwesomeIcon icon={faShoppingBag} />
                  {loadingState ? <Loader /> : "Add to Bag"}{" "}
                </button>
              )}
            </article>
          </Col>
          <Col sm={12}>
            <hr />
            <h3 className="text-center" id="more-info">
              More information
            </h3>
            <hr />
            <Row>
              <Col lg={9} className="mx-auto">
                <Accordion defaultActiveKey="0" alwaysOpen>
                  <Accordion.Item eventKey="0" className="m-3">
                    <Accordion.Header>Description</Accordion.Header>
                    <Accordion.Body>{product.description}</Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" className="m-3">
                    <Accordion.Header>Product Information</Accordion.Header>
                    <Accordion.Body>{product.information}</Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1" className="m-3">
                    <Accordion.Header>Ratings</Accordion.Header>
                    <Accordion.Body>
                      <p>Rating System to be implemented</p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* </Card> */}
      </Container>
    </>
  );
}
