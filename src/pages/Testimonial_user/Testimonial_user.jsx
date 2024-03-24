import "./Testimonial_user.css";
import logo from "../../assets/images/Simple.png";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";

const Testimonial_user = () => {
  return (
    <div className="testimonio_user">
      <img className="wave" src={wave} />
      <div className="container_testimonio">
        <div className="img">
          <img src={bg} alt="Background" />
        </div>

        <div className="form_testimonio">
          <form method="post">
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
              />
              <span className="material-icons-outlined"> person </span>
            </div>
            <div className="grupo-input">
              <span className="material-icons-outlined"> comment </span>
              <textarea
                name="message"
                id="message"
                placeholder="Escriba su testimonio..."
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
                <input type="file" name="image" id="image" />
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
