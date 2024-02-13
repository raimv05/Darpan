import React from "react";
import image1 from "./images/hero-banner-1.jpg";
import image2 from "./images/hero-banner-2.jpg";
import image3 from "./images/hero-shape-1.svg";
import image4 from "./images/hero-shape-2.png";
import { Link, useNavigate } from "react-router-dom";
function Hero() {
  const Navigate = useNavigate();
  return (
    <section
      className="section hero has-bg-image"
      id="home"
      aria-label="home"
      style={{ backgroundImage: `url('./assets/hero-bg.svg')` }}
    >
      <div className="container">
        <div className="hero-content">
          <h1 className="h1 section-title">
            Empowering <span className="span">AI based</span> educational modules
          </h1>

          <p className="hero-text">
            We develop on demand cutting edge Technology products for Schools and Universities
          </p>

          <a href="" className="btn has-before">
            <span className="span" onClick={()=>Navigate('/psycometric')}>Take Psycometric Test</span>
            <ion-icon
              name="arrow-forward-outline"
              aria-hidden="true"
            ></ion-icon>
          </a>
        </div>

        <figure className="hero-banner">
          <div
            className="img-holder one"
            style={{ "--width": 270, "--height": 300 }}
          >
            <img
              src={image1}
              width="270"
              height="300"
              alt="hero banner"
              className="img-cover"
            />
          </div>

          <div
            className="img-holder two"
            style={{ "--width": 240, "--height": 370 }}
          >
            <img
              src={image2}
              width="240"
              height="370"
              alt="hero banner"
              className="img-cover"
            />
          </div>
          <img
            src={image3}
            width="380"
            height="190"
            alt=""
            className="shape hero-shape-1"
          />

          <img
            src={image4}
            width="622"
            height="551"
            alt=""
            className="shape hero-shape-2"
          />
        </figure>
      </div>
    </section>
  );
}

export default Hero;
