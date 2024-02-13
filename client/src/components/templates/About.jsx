import React from "react";
import image1 from "./images/about-banner.jpg";
import image2 from "./images/about-shape-1.svg";
import image3 from "./images/about-shape-2.svg";
import image4 from "./images/about-shape-3.png";
import image5 from "./images/about-shape-4.svg";
function About() {
  return (
    <section className="section about" id="about" aria-label="about">
      <div className="container">
        <figure className="about-banner">
          <div
            className="img-holder"
            style={{ "--width": 520, "--height": 370 }}
          >
            <img
              src={image1}
              width="520"
              height="370"
              loading="lazy"
              alt="about banner"
              className="img-cover"
            />
          </div>
          <img
            src={image2}
            width="360"
            height="420"
            loading="lazy"
            alt=""
            className="shape about-shape-1"
          />
          <img
            src={image3}
            width="371"
            height="220"
            loading="lazy"
            alt=""
            className="shape about-shape-2"
          />
          <img
            src={image4}
            width="722"
            height="528"
            loading="lazy"
            alt=""
            className="shape about-shape-3"
          />
        </figure>

        <div className="about-content">
          <p className="section-subtitle">About Us</p>

          <h2 className="h2 section-title">
            Over 10 Years in <span className="span">Distant learning</span> for
            Skill Development
          </h2>

          <p className="section-text">
            Lorem ipsum dolor sit amet consectur adipiscing elit sed eiusmod ex
            tempor incididunt labore dolore magna aliquaenim ad minim.
          </p>

          <ul className="about-list">
            <li className="about-item">
              <ion-icon
                name="checkmark-done-outline"
                aria-hidden="true"
              ></ion-icon>
              <span className="span">Expert Trainers</span>
            </li>

            <li className="about-item">
              <ion-icon
                name="checkmark-done-outline"
                aria-hidden="true"
              ></ion-icon>
              <span className="span">Online Remote Learning</span>
            </li>

            <li className="about-item">
              <ion-icon
                name="checkmark-done-outline"
                aria-hidden="true"
              ></ion-icon>
              <span className="span">Lifetime Access</span>
            </li>
          </ul>

          <img
            src={image5}
            width="100"
            height="100"
            loading="lazy"
            alt=""
            className="shape about-shape-4"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
