import { useState, useEffect } from "react";
import logo from "../../assets/images/Simple.png";
import Config from "../../config/Config";

const Tarjeta_Matricula = ({ matricula })  => {
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
          <div className="title">
            <h4>Detalles del perfil</h4>
          </div>

          <div className="top_setter">
            <div className="perfil">
              <div className="foto">
                <img
                  src={Config.imgProfileUser + userData.profile_picture}
                  alt=""
                />
              </div>

              <div className="button">
                <h4>Perfil de <strong>{userData.role}</strong></h4>
              </div>
            </div>
          </div>

          <div className="info">
            <div className="nombre">
              <h4>{userData.name}</h4>
              <p>{userData.email}</p>
            </div>

            <div className="matricula">
              <h4>Matrícula</h4>
              <div className="numero">
                <h2>{userData.matricula}</h2>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tarjeta_Matricula;
