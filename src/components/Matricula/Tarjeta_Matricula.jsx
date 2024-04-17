import { useState, useEffect } from "react";
import logo from "../../assets/images/Simple.png";
import Config from "../../config/Config";

const Tarjeta_Matricula = ({ matricula }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`${Config.backendBaseUrl}buscar_matricula.php?m=${matricula}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, [matricula]);

  return (
    <div className="form_matricula">
      <form method="post" className="">
        <div className="head">
          <img src={logo} alt="Vibra Digital Logo" />
          <h2 className="title">Matricula Verificada</h2>
          <p>
            Para garantizar la autenticidad y seguridad de nuestros servicios,
            te ofrecemos la información de nuestros colaboradores registrados en
            nuestro sistema.
          </p>
          <p>
            Puedes continuar con tu experiencia con{" "}
            <strong>Vibra Digital</strong> con la confianza de que estás siendo
            atendido por un profesional registrado en nuestra plataforma.
            ¡Gracias por verificar la matrícula del setter!
          </p>
        </div>
        <div className="tarjeta_setter">
          <div className="left"></div>
          <div className="right">
            <div className="nombre">
              <div className="content">
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
              </div>

              <div className="foto">
                <img
                  src={Config.imgProfileUser + userData.profile_picture}
                  alt=""
                />
              </div>
            </div>

            <div className="info">
              <div className="cargo">
                <h4>Appointment Setter</h4>
              </div>

              <div className="fecha">
                <p>
                  Pertenece a <strong>VibraDIGITAL</strong> desde {userData.registration_date}
                </p>
              </div>

              <div className="matricula">
                <h4>{userData.matricula}</h4>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tarjeta_Matricula;
