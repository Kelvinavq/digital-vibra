import React, { useEffect, useState } from "react";
import "./Contact.css";
import ParticlesBg from "particles-bg";
import logo from "../../../assets/images/Simple-claro.png";
import Config from "../../../config/Config";
import Swal from "sweetalert2";

const Contact = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch(`${Config.backendBaseUrl}contact.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Hubo un problema al enviar el formulario");
      }

      Swal.fire({
        icon: "success",
        title: "Formulario enviado",
        text: "Gracias por contactarnos. Te responderemos lo antes posible.",
        didClose: () => {
          window.location = "/";
        },
      });

      setForm({
        nombre: "",
        telefono: "",
        correo: "",
        mensaje: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al enviar el formulario",
        text: error.message,
      });
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
            <input
              type="text"
              placeholder="Nombre"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputs">
            <div className="grupo-input">
              <input
                type="tel"
                placeholder="Teléfono"
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>
            <div className="grupo-input">
              <input
                type="email"
                placeholder="Correo electrónico"
                id="correo"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grupo-input">
            <textarea
              name="mensaje"
              id="mensaje"
              placeholder="Escriba su mensaje..."
              value={form.mensaje}
              onChange={handleChange}
              required
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
