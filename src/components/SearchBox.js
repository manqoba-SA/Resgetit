import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [keyword, setKeyWord] = useState("");
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/shop?keyword=${keyword}`);
    } else {
      navigate(navigate(navigate.location.pathname));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center px-15">
        <Form
          className="search nav-bar-search"
          autoComplete="true"
          onSubmit={submitHandler}
        >
          <input
            className="search-input search-input-nav"
            placeholder="Search items.."
            onChange={(e) => setKeyWord(e.target.value)}
          />
          <Button type="submit" className="search-icon search-icon-nav">
            <FontAwesomeIcon icon={faSearch} />
          </Button>
        </Form>
      </div>
    </>
  );
}
