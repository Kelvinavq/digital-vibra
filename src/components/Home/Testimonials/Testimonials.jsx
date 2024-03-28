import { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel";
import imgUser from "../../../assets/images/Usuario.png";
import testimonialBg from "../../../assets/images/TestimonialBg.png";
import "./Testimonials.css";
import Config from "../../../config/Config";

const Testimonials = () => {
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    fetch(`${Config.backendBaseUrlHome}get_testimonials.php`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener los testimonios");
        }
      })
      .then((data) => {
        setTestimonios(data.testimonios);
 
      })
      .catch((error) => {
        console.error("Error al obtener testimonios:", error);
      });
  }, []);

  useEffect(() => {
    if (testimonios.length > 0) {
      initializeCarousel();
    }
  }, [testimonios]); 

  const initializeCarousel = () => {
    if ($(".testimonial-carousel").length) {
      $(".testimonial-carousel").owlCarousel({
        animateOut: "fadeOut",
        animateIn: "fadeIn",
        loop: true,
        margin: 0,
        nav: true,
        smartSpeed: 1000,
        autoplay: 10000,
        autoplayTimeout: 10000,
        navText: [
          '<span class="arrow-left"></span>',
          '<span class="arrow-right"></span>',
        ],
        responsive: {
          0: {
            items: 1,
          },
          600: {
            items: 1,
          },
          800: {
            items: 1,
          },
          1024: {
            items: 2,
          },
        },
      });
    }
  };

  return (
    <section id="testimonios" className="testimonial-section">
      <div className="title">
        <h2 data-aos="fade-up">
          Lo Que Nuestros <strong>Clientes</strong> Dicen
        </h2>
        <p data-aos="fade-up">
          En <strong>Vibra Digital</strong>, nos enorgullecemos de ofrecer
          soluciones de desarrollo web de primera clase. Nuestro enfoque
          centrado en el cliente y nuestra dedicación a la excelencia nos han
          permitido construir relaciones sólidas con empresas de diversos
          sectores. Pero no tomes solo nuestra palabra, escucha lo que dicen
          nuestros clientes sobre su experiencia con nosotros.
        </p>
      </div>

      <div className="large-container" data-aos="fade-up">
        <div className="testimonial-carousel owl-carousel owl-theme">
          {testimonios.map((testimonial, index) => (
            <div key={index} className="testimonial-block">
              <div className="inner-box">
                <div className="text">
                  {testimonial.testimonial}
                </div>
                <div className="info-box">
                  <div className="thumb">
                  <img src={testimonial.image ? Config.imgTestimonial + testimonial.image : imgUser} alt="" />

                  </div>
                  <h4 className="name">{testimonial.name}</h4>
                  <span className="designation">Cliente de Vibra Digital</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="thumb-layer paroller">
          <figure className="image">
            <img src={testimonialBg} alt="" />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
