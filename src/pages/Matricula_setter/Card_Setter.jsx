import React, { useEffect, useState } from "react";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";
import Tarjeta_Matricula from "../../components/Matricula/Tarjeta_Matricula";
import Swal from "sweetalert2";
import "./Card_Setter.css";

const Card_Setter = () => {
  const [matricula, setMatricula] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const matriculaParam = urlParams.get("m");

    if (!matriculaParam) {
      Swal.fire({
        title: "Error",
        text: "No tiene acceso a esta página",
        icon: "error",
        didClose: () =>{
          window.history.back();
        }
      });
    } else {
      setMatricula(matriculaParam);
    }
  }, []);

  return (
    <div className="matricula_user">
      <img className="wave" src={wave} alt="Wave" />
      <div className="container_matricula">
        <div className="img">
          <img src={bg} alt="Background" />
        </div>

        {matricula && <Tarjeta_Matricula matricula={matricula} />}
      </div>
    </div>
  );
};

export default Card_Setter;
