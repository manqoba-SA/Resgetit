import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Paginate({ pages, page, keyword }) {
  if (keyword) {
    keyword = keyword.split("?keyword=")[1].split("&")[0];
  }
  return (
    pages > 1 && (
      <>
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={`/shop?keyword=${keyword}&page=${x + 1}`}
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      </>
    )
  );
}
