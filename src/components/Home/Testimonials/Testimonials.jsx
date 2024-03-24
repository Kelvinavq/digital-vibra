import { useEffect } from "react";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import imgUser from "../../../assets/images/Usuario.png"
import testimonialBg from "../../../assets/images/TestimonialBg.png"
import "./Testimonials.css";

const Testimonials = () => {

    useEffect(() => {
        // Inicializar el testimonial carousel aquí si es necesario
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
      }, []);
      
  return (
    <section id="testimonios" className="testimonial-section">
      <div className="title">
        <h2 data-aos="fade-up">Lo Que Nuestros <strong>Clientes</strong> Dicen</h2>
        <p data-aos="fade-up">En <strong>Vibra Digital</strong>, nos enorgullecemos de ofrecer soluciones de desarrollo web de primera clase. Nuestro enfoque centrado en el cliente y nuestra dedicación a la excelencia nos han permitido construir relaciones sólidas con empresas de diversos sectores. Pero no tomes solo nuestra palabra, escucha lo que dicen nuestros clientes sobre su experiencia con nosotros.</p>
      </div>

      <div className="large-container" data-aos="fade-up">
        <div className="testimonial-carousel owl-carousel owl-theme">
          <div className="testimonial-block">
            <div className="inner-box">
              <div className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
              <div className="info-box">
                <div className="thumb">
                  <img src={imgUser} alt="" />
                </div>
                <h4 className="name">Nombre Cliente 1</h4>
                <span className="designation"></span>
              </div>
            </div>
          </div>

          <div className="testimonial-block">
            <div className="inner-box">
              <div className="text">
                Another testimonial goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="info-box">
                <div className="thumb">
                  <img src={imgUser} alt="" />
                </div>
                <h4 className="name">Nombre Cliente 2</h4>
                <span className="designation"></span>
              </div>
            </div>
          </div>
          {/* Fin de testimonios estaticos */}
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
