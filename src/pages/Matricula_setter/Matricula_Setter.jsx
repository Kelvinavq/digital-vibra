import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";
import "./Matricula_Setter.css";

import Form_Matricula from "../../components/Matricula/Form_Matricula";

const Matricula_Setter = () => {
  return (
    <div className="matricula_user">
      <img className="wave" src={wave} />
      <div className="container_matricula">
        <div className="img">
          <img src={bg} alt="Background" />
        </div>

        <Form_Matricula />
      </div>
    </div>
  );
};

export default Matricula_Setter;
