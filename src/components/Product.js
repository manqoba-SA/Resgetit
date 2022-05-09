import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function Product({ product, addToCart, loading }) {
  return (
    <>
      <Card className="my-card text-center">
        <img
          src={product.image}
          className="card-img-top product-image animate__animated animate__fadeIn animate__faster"
          loading="lazy"
          alt={product.name}
        />
        <Card.Body>
          <h6>{product.name}</h6>
          <h6>
            <b>R{product.price}</b> {product.quantity}
          </h6>
          <>
            {product.countInStock > 0 ? (
              <>
                <small className="availability">
                  Available <span className="left">{product.countInStock}</span>{" "}
                  Left
                </small>{" "}
                <div className="d-flex justify-content-center w-100">
                  <div className="cart-btn">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-view"
                    >
                      View
                    </Link>
                  </div>
                  <div className="cart-btn">
                    <button
                      onClick={addToCart}
                      disabled={loading}
                      className="btn btn-add"
                    >
                      {loading ? <Loader /> : "Add to Bag"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <small className="non-availability">
                  {" "}
                  Out of stock <span className="left-0">0</span>
                  Left
                </small>
                <div className="d-flex justify-content-center w-100">
                  <div className="cart-btn-0">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-view"
                    >
                      View
                    </Link>
                  </div>
                  <div className="cart-btn-0">
                    <button type="button" className="btn btn-add" disabled>
                      Add to Bag
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        </Card.Body>
      </Card>
    </>
  );
}
