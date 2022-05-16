import React from "react";
import yocoImg from "../images/yoco_colour.svg";
import visaImg from "../images/visa_colour.svg";
import masterImg from "../images/mastercard_colour.svg";

export default function Footer() {
  return (
    <>
      <footer className="responsive-footer">
        <div className="copyright">
          <p>© 2022 - RESGETIT✌</p>
          <img src={yocoImg} width="50" height="50" alt="yoco-logo" />
        </div>
        <div className="social">
          <p className="support">
            Contact Us: <a href="tel:0643216072"> 0643216072</a> OR{" "}
            <a href="tel:+27619618183">+27619618183</a>
          </p>
          <img src={visaImg} width="50" height="50" alt="visa-icon" />
          <img src={masterImg} width="50" height="50" alt="master-card" />
        </div>
      </footer>
    </>
  );
}
