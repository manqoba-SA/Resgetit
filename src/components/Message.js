import React from "react";
import { Alert } from "react-bootstrap";

export default function Message({ variant, text }) {
  return (
    <>
      <Alert variant={variant}>
        <p>{text}</p>
      </Alert>
    </>
  );
}
