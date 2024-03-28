import { useState, useEffect } from "react";
import "./Portfolio.css";
import Config from "../../../config/Config.jsx";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  EffectCoverflow,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import img from "../../../../backend/public/portfolio/66038025033d2_lfi.jpeg";

const Portfolio = () => {
  const [proyectos, setProyectos] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  return (
    <section id="portafolio" className="portafolio" data-aos="fade-up">
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"5"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
        breakpoints={{
          1920: {
            slidesPerView: "5",
          },
          720: {
            slidesPerView: "3",
          },
          620: {
            slidesPerView: "1",
          },
        }}
      >
        <div className="swiper-button-prev slider-arrow"></div>
        <div className="swiper-button-next slider-arrow"></div>

        {proyectos.map((proyecto, index) => (
          <SwiperSlide>
            <img src={Config.imgPortfolio + proyecto.image_portrait} alt="slide_image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Portfolio;
