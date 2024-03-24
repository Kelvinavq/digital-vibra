import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/images/Simple.png";
import Config from "../../config/Config";
import Swal from "sweetalert2";

const Form_Matricula = () => {
  const [inputs, setInputs] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, event) => {
    const { value } = event.target;
    if (!isNaN(value) && value.length <= 1) {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      } else if (value.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    const cleanedData = pasteData.replace(/\D/g, ""); // Remover caracteres no numéricos
    const newInputs = [...inputs];
    let currentIndex = 0;

    for (let i = 0; i < cleanedData.length && currentIndex < 6; i++) {
      newInputs[currentIndex] = cleanedData[i];
      currentIndex++;
    }

    setInputs(newInputs);
  };

  const handleVerification = (e) => {
    e.preventDefault();

    const matricula = inputs.join("").replace(/\s/g, ""); // Eliminar espacios en blanco
    const formData = new FormData();
    formData.append('matricula', matricula);

    fetch(`${Config.backendBaseUrl}verificar_matricula.php`, {
      method: "POST",
      body: formData,
      mode: "cors",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = `/perfil-setter?m=${matricula}`;
        } else {
          Swal.fire({
            title: "Usuario no registrado",
            text: "El número de matrícula ingresado no corresponde a ningún usuario dentro de VIBRA DIGITAL",
            icon: "warning",
          });
        }
      })
      .catch((error) => {
        console.error("Error al verificar matrícula:", error);
        alert(
          "Se produjo un error al verificar la matrícula. Por favor, inténtalo de nuevo."
        );
      });
  };



  return (
    <div className="form_matricula">
      <form method="post" className="">
        <div className="head">
          <img src={logo} alt="Vibra Digital Logo" />
          <h2 className="title">Verificar Matrícula</h2>
          <p>
            Para garantizar la autenticidad y seguridad de nuestros servicios,
            te pedimos que ingreses la matrícula de tu setter asignado a
            continuación.
          </p>
        </div>

        <div className="inputContainer">
          {inputs.map((value, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                value={value}
                onChange={(event) => handleChange(index, event)}
                onPaste={handlePaste}
                required
                maxLength={1}
                type="text"
                className="otp-input"
                id={`otp-input${index + 1}`}
              />
              {index === 2 && <span>-</span>}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={handleVerification}
          disabled={!inputs.every((value) => value.length === 1)}
          className={
            inputs.every((value) => value.length === 1)
              ? "btn_verificar active"
              : "btn_verificar"
          }
        >
          Verificar
        </button>
      </form>
    </div>
  );
};

export default Form_Matricula;
