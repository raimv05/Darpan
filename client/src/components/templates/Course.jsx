import React from "react";

function Course() {
  const courses = [
    {
      id: 1,
      imageSrc: "/img/blog-1.jpg",
      title: "Build Responsive Real-World Websites with HTML and CSS",
      duration: "3 Weeks",
      level: "Beginner",
      rating: "5.0/7 Rating",
      price: 6000,
      lessons: 8,
      students: 20,
    },
    {
      id: 2,
      imageSrc: "/img/blog-2.jpg",
      title: "Java Programming Masterclass for Software Developers",
      duration: "8 Weeks",
      level: "Advanced",
      rating: "4.5/9 Rating",
      price: 999,
      lessons: 15,
      students: 35,
    },
    {
      id: 3,
      imageSrc: "./img/blog-3.jpg",
      title: "The Complete Camtasia Course for Content Creators",
      duration: "3 Weeks",
      level: "Intermediate",
      rating: "4.9/7 Rating",
      price: 690,
      lessons: 13,
      students: 18,
    },
  ];

  return (
    <section className="section course" id="courses" aria-label="course">
      <div className="container">
        <p className="section-subtitle">Popular Courses</p>
        <h2 className="h2 section-title">Pick A Course To Get Started</h2>

        <ul className="grid-list">
          {courses.map((course) => (
            <li key={course.id}>
              <div className="course-card">
                <figure
                  className="card-banner img-holder"
                  style={{ "--width": 370, "--height": 220 }}
                >
                  <img
                    src={course.imageSrc}
                    width="370"
                    height="220"
                    loading="lazy"
                    alt={course.title}
                    className="img-cover"
                  />
                </figure>

                <div className="abs-badge">
                  <ion-icon name="time-outline" aria-hidden="true"></ion-icon>
                  <span className="span">{course.duration}</span>
                </div>

                <div className="card-content">
                  <span className="badge">{course.level}</span>
                  <h3 className="h3">
                    <a href="#" className="card-title">
                      {course.title}
                    </a>
                  </h3>

                  <div className="wrapper">
                    <div className="rating-wrapper">
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                      <ion-icon name="star"></ion-icon>
                    </div>

                    <p className="rating-text">({course.rating})</p>
                  </div>

                  <data className="price" value={course.price}>
                  ₹{course.price.toFixed(2)}
                  </data>

                  <ul className="card-meta-list">
                    <li className="card-meta-item">
                      <ion-icon
                        name="library-outline"
                        aria-hidden="true"
                      ></ion-icon>
                      <span className="span">{course.lessons} Lessons</span>
                    </li>

                    <li className="card-meta-item">
                      <ion-icon
                        name="people-outline"
                        aria-hidden="true"
                      ></ion-icon>
                      <span className="span">{course.students} Students</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <a href="#" className="btn has-before">
          <span className="span">Browse more courses</span>
          <ion-icon name="arrow-forward-outline" aria-hidden="true"></ion-icon>
        </a>
      </div>
    </section>
  );
}

export default Course;
