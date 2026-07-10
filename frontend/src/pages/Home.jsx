import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;