import Menu from "../../components/Home/Menu/Menu";
import Header from "../../components/Home/Header/Header";
import Cards from "../../components/Home/Cards/Cards";
import Advantages from "../../components/Home/Advantages/Advantages";
import Process from "../../components/Home/Process/Process";
import Methods from "../../components/Home/Methods/Methods";
import Testimonials from "../../components/Home/Testimonials/Testimonials";
import Portfolio from "../../components/Home/Portfolio/Portfolio";
import Contact from "../../components/Home/Contact/Contact";

const Home = () => {
  return (
    <>
      <Menu />
      <Header />
      <Cards />
      <Advantages />
      <Process />
      <Methods />
      <Testimonials />
      <Portfolio />
      <Contact />
     
    </>
  );
};

export default Home;
