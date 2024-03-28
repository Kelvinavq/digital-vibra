import React, { useState } from "react";
import "./Testimonial_user.css";
import logo from "../../assets/images/Simple.png";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";
import Swal from "sweetalert2";
import Config from "../../config/Config";

const Testimonial_user = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar campos vacíos
    if (!name.trim() || !message.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos obligatorios.",
        icon: "error",
      });
      return;
    }

      // Verificar formato de la imagen
      if (image && !allowedFormats.includes(image.type)) {
        Swal.fire({
          title: "Error",
          text: "El formato de la imagen no es válido. Por favor, elija un archivo JPEG, PNG o JPG.",
          icon: "error",
        });
        return;
      }
  

    // Realizar el fetch o enviar los datos al backend
    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    if (image) {
      formData.append("image", image);
    }

    // Realizar el fetch con formData
    fetch(`${Config.backendBaseUrl}create_testimonial.php`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al enviar el testimonio");
        }
      })
      .then((data) => {
        // Manejar la respuesta del servidor
        Swal.fire({
          title: "Éxito",
          text: "¡Tu testimonio ha sido enviado con éxito!",
          icon: "success",
          didClose: () =>{
            window.location = "/";
          }
        });
      })
      .catch((error) => {
        console.error("Error al enviar testimonio:", error);
        Swal.fire({
          title: "Error",
          text: "Se produjo un error al enviar el testimonio. Por favor, inténtelo de nuevo.",
          icon: "error",
        });
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="testimonio_user">
      <img className="wave" src={wave} />
      <div className="container_testimonio">
        <div className="img">
          <img src={bg} alt="Background" />
        </div>

        <div className="form_testimonio">
          <form method="post" onSubmit={handleSubmit}>
            <div className="head">
              <img src={logo} alt="Vibra Digital Logo" />
              <h2 className="title">
                Comparte tu Experiencia con <strong>Vibra Digital</strong>
              </h2>
              <p>
                ¡Nos encantaría escuchar tu opinión! Tu testimonio es invaluable
                para nosotros y ayuda a otros a conocer más sobre nuestra
                empresa. Por favor, tómate un momento para compartir tu
                experiencia con nosotros. Agradecemos sinceramente tu tiempo y
                confianza en nuestro trabajo.
              </p>
            </div>

            <div className="grupo-input">
              <input
                type="text"
                className="input"
                placeholder="Nombre y Apellido"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="material-icons-outlined"> person </span>
            </div>
            <div className="grupo-input">
              <span className="material-icons-outlined"> comment </span>
              <textarea
                name="message"
                id="message"
                placeholder="Escriba su testimonio..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div className="grupo-input">
              <label>Le gustaría compartir una foto o logo? (Opcional)</label>

              <label htmlFor="image" className="upload">
                <span className="material-icons-outlined file">
                  {" "}
                  file_upload{" "}
                </span>
                Subir Foto / Logo
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={handleImageChange}

                />
              </label>
              <p className="nombreArchivo"></p>
            </div>

            <div className="grupo-input">
              <input type="submit" className="btn" value="Enviar" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Testimonial_user;
