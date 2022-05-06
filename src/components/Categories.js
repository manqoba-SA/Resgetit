import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import foodImg from "../images/food.png";
import { useDispatch, useSelector } from "react-redux";
import { listCategories } from "../actions/productActions";
import Message from "./Message";
import Loader from "./Loader";
import { Link, useNavigate } from "react-router-dom";

export default function Categories() {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const { error, loading, categories } = categoryList;
  const navigate = useNavigate();
  const submitHandler = (keyword) => {
    navigate(`/shop?category=${keyword}`);
  };
  const [keyword, setKeyWord] = useState("");
  const submitHandlerSearch = () => {
    if (keyword) {
      navigate(`/shop?keyword=${keyword}`);
    } else {
      navigate("/shop");
    }
  };
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);
  return (
    <>
      <Container>
        <br />
        <br />
        <Container className="mt-4">
          <Row className="d-flex justify-content-center">
            <Col md={9}>
              <Card className="p-4 mt-3">
                <h3 className="heading mt-5 text-center animate__animated animate__heartBeat animate__slow">
                  Awe🤘, Search the product you want
                </h3>
                <div className="d-flex justify-content-center px-15">
                  <Form
                    className="search"
                    onSubmit={() => submitHandlerSearch()}
                    autoComplete="true"
                  >
                    <input
                      className="search-input"
                      placeholder="Search items.."
                      onChange={(e) => setKeyWord(e.target.value)}
                    />
                    <Button type="submit" className="search-icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </Form>
                </div>

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
                    <Row className="mt-4 g-1 px-4 mb-5">
                      <Col md={2}>
                        <Link to="/shop">
                          <div className="card-inner p-3 d-flex flex-column align-items-center">
                            {" "}
                            <img src={foodImg} width="50" alt="all-img" />
                            <div className="text-center mg-text">
                              {" "}
                              <span className="mg-text">All</span>{" "}
                            </div>
                          </div>
                        </Link>
                      </Col>
                      {categories.map((category) => (
                        <Col md={2} key={category.id}>
                          <div onClick={() => submitHandler(category.id)}>
                            <div className="card-inner p-3 d-flex flex-column align-items-center">
                              {" "}
                              <img
                                src={category.image}
                                width="50"
                                alt={category.name}
                              />
                              <div className="text-center mg-text">
                                {" "}
                                <span className="mg-text">
                                  {category.name}
                                </span>{" "}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}
