import React, { useState } from "react";
import logo from "../../assets/images/Simple.png";
import Config from "../../config/Config";
import Swal from "sweetalert2";

const Form_Publicidad = () => {
  const [formData, setFormData] = useState({
    name: "",
    lname: "",
    email: "",
    phone: "",
    type: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    for (const key in formData) {
      if (formData[key] === '') {
        return false;
      }
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

     // Validar campos antes de enviar al servidor
     if (!validateForm()) {
      // Mostrar la alerta si algún campo está vacío
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos'
      });
      return;
    }

    // Enviar datos al servidor
    try {
      const response = await fetch(`${Config.backendBaseUrl}campaign.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        mode: "cors",
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok) {
        // Manejar la respuesta exitosa del servidor
        Swal.fire({
          icon: "success",
          title: "Tu solicitud ha sido enviada con éxito",
          text: "El equipo de Vibra Digital se contactará contigo.",
          didClose: () =>{
            window.location = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.message || "Error en el servidor",
        });
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al enviar datos",
      });
    }
  };

 

  return (
    <>
      <div className="form_publicidad">
        <form onSubmit={handleSubmit}>
          <div className="head">
            <img src={logo} alt="Vibra Digital Logo" />
            <h2 className="title">
              ¡Desata el Potencial de tu Negocio en Línea!
            </h2>
            <p>
              "Estamos emocionados de acompañarte en el viaje hacia el éxito
              digital de tu negocio. Nuestro equipo de expertos en desarrollo
              web, aplicaciones y software está listo para impulsar tu presencia
              en línea y llevar tu empresa al siguiente nivel.
            </p>
            <p>
              Completa el siguiente formulario para que podamos entender mejor
              tus necesidades y proporcionarte soluciones personalizadas que se
              adapten perfectamente a tu visión y objetivos comerciales.
            </p>
            <p>
              ¡Juntos, podemos hacer que tu presencia en línea sea memorable y
              efectiva! ¡Gracias por confiar en nosotros para llevar tu negocio
              al futuro digital!"
            </p>
          </div>

          <div className="inputs">
            <div className="grupo-input">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="grupo-input">
              <input
                type="text"
                name="lname"
                placeholder="Apellido"
                value={formData.lname}
                onChange={handleChange}
              />
            </div>

            <div className="grupo-input">
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grupo-input">
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grupo-input">
              <select name="type" onChange={handleChange} value={formData.type}>
                <option value="">Tipo de proyecto</option>
                <option value="web">Sitio web</option>
                <option value="app">Aplicación móvil</option>
                <option value="software">Software</option>
              </select>
            </div>

            <div className="grupo-input">
              <textarea
                name="description"
                placeholder="Detalles de su proyecto"
                onChange={handleChange}
                value={formData.description}
              ></textarea>
            </div>

            <div className="grupo-input">
              <button className={validateForm() ? "active" : ""}>Enviar</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form_Publicidad;
