import "./css/home.css";
import Hero from "../templates/Hero";
import Category from "../templates/Category";
import About from "../templates/About";
import Course from "../templates/Course";
import Footer from "../templates/Footer";

function Home() {
  return (
    <div>
      <Hero />
      <Category />
      <About />
      <Course />
      <Footer />
    </div>
  );
}

export default Home;
