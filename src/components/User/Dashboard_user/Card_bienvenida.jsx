import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./Dashboard_u.css";
import Config from "../../../config/Config";

const Card_bienvenida = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_user_detail.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Error al obtener la informacion del usuario");
          Swal.fire({
            title: "Error al obtener la informacion del usuario",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener la informacion del usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener la informacion del usuario",
        });
      }
    };

    getUserDetail();
  }, []);

  return (
    <div className="bienvenida">
      <div className="title">
        <h2>Hola, {userData.name}</h2>
        <p>¿Tienes un nuevo prospecto ?</p>
      </div>

      <div className="button">
        <button>¡Registralo!</button>
      </div>
    </div>
  );
};

export default Card_bienvenida;
