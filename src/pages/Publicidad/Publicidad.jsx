import "./Publicidad.css";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";

import Form_Publicidad from "../../components/Publicidad/Form_Publicidad";

const Publicidad = () => {
  return (
    <>
      <div className="publicidad">
        <img className="wave" src={wave} />
        <div className="container_publicidad">
          <div className="img">
            <img src={bg} alt="Background" />
          </div>

          <Form_Publicidad />
        </div>
      </div>
    </>
  );
};

export default Publicidad;
