import "./Equipos_a.css";
import { useEffect, useState, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";

import Swal from "sweetalert2";
import Config from "../../../config/Config";

const Equipos_a = () => {
  const [Equipos, setEquipos] = useState([]);

  useEffect(() => {
    const obtenerEquipos = async () => {
      try {
        const url = new URL(`${Config.backendBaseUrlAdmin}get_all_teams.php`);

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data) {
            setEquipos(data);
          } else {
            // Manejar el caso en que no hay equipos
            Swal.fire({
              icon: "info",
              title: "Sin equipos registrados",
              text: "No hay equipos registrados en este momento.",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };

    obtenerEquipos();
  }, []);

  const handleAddTeam = async () => {
    const { value: teamName } = await Swal.fire({
      title: "Añadir equipo",
      input: "text",
      inputLabel: "Nombre del equipo",
      inputPlaceholder: "Ingrese el nombre del equipo",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Debe ingresar un nombre para el equipo!";
        }
      },
    });

    if (teamName) {
      // Realizar el fetch al backend para añadir el equipo
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}add_team.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: teamName }),
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "¡Equipo añadido!",
            text: "El equipo ha sido añadido correctamente.",
            icon: "success",
            didClose: () => {
              window.location.reload();
            },
          });
        } else {
          Swal.fire("Error", "Hubo un error al añadir el equipo.", "error");
        }
      } catch (error) {
        console.error("Error al añadir el equipo:", error);
        Swal.fire("Error", "Hubo un error al añadir el equipo.", "error");
      }
    }
  };

  const handleEditTeam = async (teamId, currentName) => {
    const { value: newName } = await Swal.fire({
      title: "Editar equipo",
      input: "text",
      inputValue: currentName,
      inputLabel: "Nuevo nombre del equipo",
      inputPlaceholder: "Ingrese el nuevo nombre del equipo",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "¡Debe ingresar un nuevo nombre para el equipo!";
        }
      },
    });

    if (newName) {
      // Realizar el fetch al backend para actualizar el nombre del equipo
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}update_team.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: teamId, name: newName }),
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "¡Nombre del equipo actualizado!",
            text: "El nombre del equipo ha sido actualizado correctamente.",
            icon: "success",
            didClose: () => {
              window.location.reload();
            },
          });
        } else {
          Swal.fire(
            "Error",
            "Hubo un error al actualizar el nombre del equipo.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error al actualizar el nombre del equipo:", error);
        Swal.fire(
          "Error",
          "Hubo un error al actualizar el nombre del equipo.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="tabla_equipos">
        <div className="title">
          <h2>Equipos registrados</h2>
          <button onClick={handleAddTeam}>Añadir equipo</button>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Nombre</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
              {Equipos.map((equipo, index) => (
                <tr key={index}>
                  <td data-label="Nº">{equipo.id}</td>
                  <td data-label="Nombre">{equipo.name}</td>
                  <td data-label="Editar">
                    <button onClick={() => handleEditTeam(equipo.id, equipo.name)}>
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Equipos_a;
