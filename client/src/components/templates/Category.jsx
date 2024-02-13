import React from "react";
import image1 from "./images/category-1.svg";
import image2 from "./images/category-2.svg";
import image3 from "./images/category-3.svg";
import image4 from "./images/category-4.svg";

function Category() {
  return (
    <section className="section category" aria-label="category">
      <div className="container">
        <p className="section-subtitle">Categories</p>

        <h2 className="h2 section-title">
          Online <span className="span">Classes</span> For Remote Learning.
        </h2>

        <p className="section-text">
          Consectetur adipiscing elit sed do eiusmod tempor.
        </p>

        <ul className="grid-list">
          <li>
            <div className="category-card" style={{ "--color": " 170, 75%, 41%" }}>
              <div className="card-icon">
                <img
                  src={image1}
                  width="40"
                  height="40"
                  loading="lazy"
                  alt="Online Degree Programs"
                  className="img"
                />
              </div>

              <h3 className="h3">
                <a href="#" className="card-title">
                  Online Degree Programs
                </a>
              </h3>

              <p className="card-text">
                Lorem ipsum dolor consec tur elit adicing sed umod tempor.
              </p>

              <span className="card-badge">7 Courses</span>
            </div>
          </li>

          <li>
            <div className="category-card" style={{ "--color": "351, 83%, 61%" }}>
              <div className="card-icon">
                <img
                  src={image2}
                  width="40"
                  height="40"
                  loading="lazy"
                  alt="Non-Degree Programs"
                  className="img"
                />
              </div>

              <h3 className="h3">
                <a href="#" className="card-title">
                  Non-Degree Programs
                </a>
              </h3>

              <p className="card-text">
                Lorem ipsum dolor consec tur elit adicing sed umod tempor.
              </p>

              <span className="card-badge">4 Courses</span>
            </div>
          </li>

          <li>
            <div className="category-card" style={{ "--color": "42, 94%, 55%" }}>
              <div className="card-icon">
                <img
                  src={image3}
                  width="40"
                  height="40"
                  loading="lazy"
                  alt="Off-Campus Programs"
                  className="img"
                />
              </div>

              <h3 className="h3">
                <a href="#" className="card-title">
                  Off-Campus Programs
                </a>
              </h3>
              <p className="card-text">
                Lorem ipsum dolor consec tur elit adicing sed umod tempor.
              </p>
              <span className="card-badge">8 Courses</span>
            </div>
          </li>
          <li>
            <div className="category-card" style={{ "--color": " 42, 94%, 55%" }}>
              <div className="card-icon">
                <img
                  src={image4}
                  width="40"
                  height="40"
                  loading="lazy"
                  alt="Hybrid Distance Programs"
                  className="img"
                />
              </div>
              <h3 className="h3">
                <a href="#" className="card-title">
                  Hybrid Distance Programs
                </a>
              </h3>
              <p className="card-text">
                Lorem ipsum dolor consec tur elit adicing sed umod tempor.
              </p>
              <span className="card-badge">8 Courses</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Category;
