import { useState, useEffect } from "react";
import Slider from "react-slick";
import Config from "../../../config/Config";
import img from "../../../assets/images/FondoHeader.jpg";
import "./Portfolio.css";

const Portfolio = () => {
  const [proyectos, setProyectos] = useState([]);
  useEffect(() => {
    fetch(`${Config.backendBaseUrlHome}get_projects.php`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener los proyectos");
        }
      })
      .then((data) => {
        setProyectos(data.proyectos);
      })
      .catch((error) => {
        console.error("Error al obtener proyectos:", error);
        Swal.fire({
          title: "Error",
          text: "Se produjo un error al obtener los proyectos. Por favor, inténtelo de nuevo.",
          icon: "error",
        });
      });
  }, []);

  const handleImageClick = (link) => {
    window.open(link, '_blank');
  };


  var settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    centerMode: true,
    adaptiveHeight: true,
    adaptiveWidth: true,
    lazyLoad: true,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          centerMode: true,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {proyectos.map((proyecto, index) => (
        <div key={index} onClick={() => handleImageClick(proyecto.link)}>
          <img
            src={Config.imgPortfolio + proyecto.image_portrait}
            alt="slide_image"
          />
        </div>
      ))}
    </Slider>
  );
};

export default Portfolio;
