import React, { StrictMode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories, listProducts } from "../actions/productActions";
import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { authAxios } from "../utils";
import { addToCartURL } from "../constants/cartConstants";
import { cartFetch } from "../actions/cartActions";
import CartOffCanvas from "../components/CartOffCanvas";
import { useLocation, useNavigate } from "react-router-dom";
import Paginate from "../components/Paginate";

export default function Products({ history }) {
  var category = "";
  var search = "";
  const location = useLocation(history);
  let keyword = location.search;
  var newString = "";
  if (keyword.startsWith("?keyword=")) {
    newString = "";
    search = keyword;
  } else if (keyword.startsWith("?category")) {
    newString = keyword.replaceAll("?category=", "");
    category = keyword;
  } else {
    newString = "";
  }

  const [cString, setCstring] = useState("");
  const dispatch = useDispatch();
  const fetchCart = () => dispatch(cartFetch());
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages } = productList;
  const cart = useSelector((state) => state.cart.data);
  useEffect(() => {
    document.title = "shop | resgetit";
    dispatch(listProducts(search, category));
    setCstring(newString);
    dispatch(listCategories());
    fetchCart();
  }, [dispatch, keyword, location]);

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

  const navigate = useNavigate();
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  const submitHandler = (keyword) => {
    navigate(`/shop?category=${keyword}`);
  };

  const [building, setBuilding] = useState("Quintal Building");

  return (
    <>
      <StrictMode>
        <CartOffCanvas
          show={show}
          onHide={handleClose}
          showToast={showToast}
          toastOnClose={() => setShowToast(false)}
          message={message}
          cartUpdate={cart}
        />
        <section className="productss-page">
          <Container></Container>
          {loading ? (
            <Container fluid className="loading">
              <Loader />
            </Container>
          ) : error ? (
            <>
              <Message variant={"danger"} text={error} />
            </>
          ) : (
            <>
              <Container>
                <div className="row">
                  <div className="col-6">
                    <div className="w-50">
                      <DropdownButton
                        id="dropdown-basic-button"
                        title="Filter by category"
                        variant="Secondary"
                      >
                        {categories.map((category) => (
                          <Dropdown.Item
                            key={category.id}
                            onClick={() => submitHandler(category.id)}
                          >
                            {category.name}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </div>
                  </div>
                  <div className="col-4">
                    <DropdownButton
                      className="w-100"
                      id="dropdown-basic-button"
                      title={building}
                      variant="outline-secondary"
                    >
                      <Dropdown.Item
                        onClick={() => setBuilding("Quintal Building")}
                      >
                        Quintal Building
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setBuilding("Miller Building")}
                      >
                        Miller Building
                      </Dropdown.Item>
                    </DropdownButton>
                    {/* </div> */}
                  </div>
                </div>
              </Container>

              <h3 className="text-center mt-3">
                {cString.toString() === ""
                  ? "Shop All"
                  : cString.toString() === "1"
                  ? "Shop for Food🍇🥪"
                  : cString.toString() === "2"
                  ? "Shop for Drinks🍷"
                  : cString.toString() === "3"
                  ? "Shop for Devices🤳🏿"
                  : "Shop for Sevicers👩🏽‍🏭"}
              </h3>
              <div className="line-break"></div>
              <Container>
                <Row>
                  {products
                    .filter((product) => {
                      if (cString === "") {
                        return product;
                      } else if (
                        product?.category
                          .toString()
                          .toLowerCase()
                          .includes(cString.toLocaleLowerCase())
                      ) {
                        return product;
                      } else {
                        return "";
                      }
                    })
                    .map((product) => (
                      <Col sm={3} key={product.slug} className="my-4">
                        <Product
                          product={product}
                          building={building}
                          addToCart={() => handleAddToCart(product.slug)}
                          loading={loadingState}
                        />
                      </Col>
                    ))}
                </Row>

                <Paginate
                  page={page}
                  pages={pages}
                  keyword={keyword.startsWith("?category") ? keyword : keyword}
                />
              </Container>
            </>
          )}
        </section>
      </StrictMode>
    </>
  );
}
