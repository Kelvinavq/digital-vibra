import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./List_setters.css";
import Config from "../../../config/Config";

const List_setters = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Función para cargar la lista de equipos
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_teams.php`
        );
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          console.error("Hubo un problema al cargar la lista de equipos");
        }
      } catch (error) {
        console.error("Error al cargar la lista de equipos:", error);
      }
    };

    fetchTeams();
  }, []);

  const addSetter = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Usuario",
      html:
        '<input name="name" class="swal2-input" placeholder="Nombre">' +
        '<input name="email" class="swal2-input" placeholder="Email">' +
        '<input name="password" type="password" class="swal2-input" placeholder="Contraseña">' +
        '<input name="phone_number" class="swal2-input" placeholder="Número de teléfono">' +
        '<input name="address" class="swal2-input" placeholder="Dirección">' +
        '<select name="role" class="swal2-input" id="role"> ' +
        '  <option value="">Seleccionar rol</option>' +
        '  <option value="setter">Setter</option>' +
        '  <option value="admin">Admin</option>' +
        "</select>" +
        '<div id="dynamicFields"></div>',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.querySelector('input[name="name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const phone_number = document.querySelector('input[name="phone_number"]').value;
  const address = document.querySelector('input[name="address"]').value;
  const role = document.querySelector('select[name="role"]').value;
  const link_setter = Config.linkSetter;
  
  let formValues = { name, email, password, phone_number, address, role, link_setter };

  // Si el rol es "setter", agregar el ID del equipo seleccionado
  if (role === "setter") {
    const team_id = document.querySelector('select[name="team"]').value;
    formValues = { ...formValues, team_id };
  }

  return formValues;
      },
      didOpen: () => {
        const roleSelect = document.getElementById("role");
        const dynamicFieldsContainer = document.getElementById("dynamicFields");

        roleSelect.addEventListener("change", (e) => {
          const selectedRole = e.target.value;

          // Limpiar los campos dinámicos anteriores
          dynamicFieldsContainer.innerHTML = "";

          const additionalFields = [];

          if (selectedRole === "setter") {
            // Crear campo para el enlace
            additionalFields.push(`
            <select name="team" class="swal2-input" id="team">
              <option value="">Seleccionar equipo</option>
              ${teams
                .map(
                  (team) => `<option value="${team.id}">${team.name}</option>`
                )
                .join("")}
            </select>
            
            `);
          }

          // Agregar los campos adicionales al contenedor
          dynamicFieldsContainer.innerHTML = additionalFields.join("");
        });
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}register_user.php`,
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
          Swal.fire(
            "¡Registro exitoso!",
            "El usuario se ha registrado correctamente.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al registrar el usuario.",
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
    <div className="list_setters">
      <button onClick={addSetter}>Añadir</button>
    </div>
  );
};

export default List_setters;
