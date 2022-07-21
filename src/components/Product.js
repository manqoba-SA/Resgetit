import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function Product({ product, addToCart, loading, building }) {
  const [imgLoading, setImgLoading] = useState(false);
  let stock = 0;
  stock =
    building === "Quintal Building"
      ? product.countInStockQ
      : product.countInStockM;
  return (
    <>
      <Card className="my-card text-center">
        {!imgLoading && <Loader />}
        <img
          src={product.image}
          onLoad={() => setImgLoading(true)}
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
            {stock ? (
              <>
                <small className="availability">
                  Available{" "}
                  <span className="left">
                    {building === "Quintal Building"
                      ? product.countInStockQ
                      : product.countInStockM}
                  </span>{" "}
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
