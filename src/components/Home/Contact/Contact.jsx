import React, { useEffect, useState } from "react";
import "./Contact.css";
import ParticlesBg from "particles-bg";
import logo from "../../../assets/images/Simple-claro.png";

const Contact = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(event.target);

    // Convertir los datos a un objeto JSON
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Realizar la solicitud fetch
    try {
      const response = await fetch("mail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      if (response.ok) {
        // Manejar la respuesta exitosa, por ejemplo, mostrar un mensaje al usuario
        console.log("Formulario enviado con éxito");
      } else {
        // Manejar errores de la solicitud
        console.error("Error al enviar el formulario");
      }
    } catch (error) {
      // Manejar errores de red u otros errores
      console.error("Error en la solicitud fetch", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const particleNum = windowWidth < 560 ? 30 : 40;

  return (
    <section id="contacto" className="contacto">
      <div className="titulo">
        <h2 data-aos="fade-up">
          <strong>Contáctenos</strong>
        </h2>
        <p></p>
      </div>
      <form
        onSubmit={handleSubmit}
        id="contacto-form"
        method="post"
        data-aos="fade-up"
      >
        <div className="left">
          <div className="grupo-input">
            <input type="text" placeholder="Nombre" id="nombre" name="nombre" />
          </div>

          <div className="inputs">
            <div className="grupo-input">
              <input
                type="tel"
                placeholder="Teléfono"
                id="telefono"
                name="telefono"
              />
            </div>
            <div className="grupo-input">
              <input
                type="email"
                placeholder="Correo electrónico"
                id="correo"
                name="correo"
              />
            </div>
          </div>

          <div className="grupo-input">
            <textarea
              name="mensaje"
              id="mensaje"
              placeholder="Escriba su mensaje..."
            ></textarea>
          </div>

          <input type="submit" value="Enviar" className="btn" />
        </div>
        <div className="right" data-aos="fade-up">
          <ParticlesBg
            num={particleNum}
            type="cobweb"
            bg={true}
            color="#f78713"
          />
          <img src={logo} alt="logotipo vibra digital" />
        </div>
      </form>
    </section>
  );
};

export default Contact;
