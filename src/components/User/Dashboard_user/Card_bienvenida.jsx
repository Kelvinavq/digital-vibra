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

  const addProspect = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Prospecto",
      html: `
        <input id="name" class="swal2-input" placeholder="Nombre">
        <input id="lname" class="swal2-input" placeholder="Apellido">
        <input id="email" class="swal2-input" placeholder="Email">
        <select id="socialSelect" class="swal2-select">
          <option value="">Medio de contacto</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="otra">Otra</option>
        </select>
        <div id="dynamicFields"></div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const lname = document.getElementById("lname").value;
        const email = document.getElementById("email").value;
        const social = document.getElementById("socialSelect").value;
        const link = document.querySelector('input[name="link"]')?.value;
        const otherSocial = document.querySelector(
          'input[name="otherSocial"]'
        )?.value;

        return { name, lname, email, social, link, otherSocial };
      },
      didOpen: () => {
        const socialSelect = document.getElementById("socialSelect");
        const dynamicFieldsContainer = document.getElementById("dynamicFields");

        socialSelect.addEventListener("change", (e) => {
          const selectedSocial = e.target.value;

          // Limpiar los campos dinámicos anteriores
          dynamicFieldsContainer.innerHTML = "";

          const additionalFields = [];

          if (
            selectedSocial === "facebook" ||
            selectedSocial === "instagram" ||
            selectedSocial === "linkedin"
          ) {
            // Crear campo para el enlace
            additionalFields.push(`
              <input name="link" class="swal2-input" placeholder="Enlace">
            `);
          } else if (selectedSocial === "otra") {
            // Crear campos para la red social y el enlace
            additionalFields.push(`
              <input name="otherSocial" class="swal2-input" placeholder="Red Social">
              <input name="link" class="swal2-input" placeholder="Enlace">
            `);
          }

          // Agregar los campos adicionales al contenedor
          dynamicFieldsContainer.innerHTML = additionalFields.join("");
        });
      },
      confirmButtonText: "Registrar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}register_prospect.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formValues),
          }
        );

        if (response.ok) {
          Swal.fire({
              title: "¡Registro exitoso!",
              text: "El prospecto se ha registrado correctamente.",
              icon: "success",
              didClose: () =>{
                window.location.reload();
              }
            });
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al registrar el prospecto.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error al realizar la llamada al backend:", error);
        Swal.fire(
          "Error",
          "Hubo un problema al conectar con el servidor.",
          "error"
        );
      }
    }
  };

  return (
    <div className="bienvenida">
      <div className="title">
        <h2>Hola, {userData.name}</h2>
        <p>¿Tienes un nuevo prospecto ?</p>
      </div>

      <div className="button">
        <button onClick={addProspect}>¡Registralo!</button>
      </div>
    </div>
  );
};

export default Card_bienvenida;
