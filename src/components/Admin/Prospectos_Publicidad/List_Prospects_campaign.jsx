import "./Prospectos_Publicidad.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

const List_Prospects_campaign = () => {
  const [prospectos, setProspectos] = useState([]);
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    const obtenerProspectos = async () => {
      try {
        const url = new URL(
          `${Config.backendBaseUrlAdmin}get_prospects_campaign.php`
        );

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
            setProspectos(data);
          } else {
            // Manejar el caso en que no hay prospectos
            Swal.fire({
              icon: "info",
              title: "Sin prospectos registrados",
              text: "No hay prospectos registrados en este momento.",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    obtenerProspectos();
  }, []);

  useEffect(() => {
    setIsButtonActive(selectedProspects.length > 0);
  }, [selectedProspects]);

  const handleCheckboxChange = (event, prospectId) => {
    if (event.target.checked) {
      setSelectedProspects([...selectedProspects, prospectId]);
    } else {
      setSelectedProspects(selectedProspects.filter((id) => id !== prospectId));
    }
  };

  const handleAssignButtonClick = async () => {
    if (selectedProspects.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar al menos un prospecto para asignar.",
      });
      return;
    }

    const prospectAssigned = prospectos.some(
      (prospecto) =>
        prospecto.id_setter !== null && selectedProspects.includes(prospecto.id)
    );

    if (prospectAssigned) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Uno o más prospectos seleccionados ya están asignados a un vendedor.",
      });
      return;
    }

    try {
      const setters = await fetch(
        `${Config.backendBaseUrlAdmin}get_users.php`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );

      if (!setters.ok) {
        throw new Error("Error al obtener la lista de setters.");
      }

      const settersData = await setters.json();

      const { value: setter_id } = await Swal.fire({
        title: "Selecciona un setter",
        input: "select",
        inputOptions: settersData.reduce((options, setter) => {
          options[setter.id] = setter.name;
          return options;
        }, {}),
        inputPlaceholder: "Selecciona un setter",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Asignar",
      });

      if (setter_id) {
        const url = new URL(
          `${Config.backendBaseUrlAdmin}asignar_prospectos.php`
        );
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            setter_id,
            prospects: selectedProspects,
          }),
        });

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Prospectos asignados",
            text: "Los prospectos han sido asignados al setter",
            didClose: () => {
              window.location.reload();
            },
          });
        } else {
          // Aquí puedes manejar la respuesta fallida, si es necesario
          console.error("Error al asignar usuarios:", response.statusText);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al asignar usuarios. Por favor, inténtalo de nuevo más tarde.",
          });
        }
      }
    } catch (error) {
      console.error("Error al asignar usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al asignar usuarios. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  const handleUnassignButtonClick = async () => {
    if (selectedProspects.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes seleccionar al menos un prospecto para marcar como sin asignar.",
      });
      return;
    }

    try {
      const url = new URL(
        `${Config.backendBaseUrlAdmin}marcar_sin_asignar.php`
      );
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prospects: selectedProspects,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Los prospectos han marcados como por asignar",
          didClose: () => {
            window.location.reload();
          },
        });
        console.log(
          "Prospectos marcados como sin asignar con éxito:",
          selectedProspects
        );
      } else {
        // Aquí puedes manejar la respuesta fallida, si es necesario
        console.error(
          "Error al marcar prospectos como sin asignar:",
          response.statusText
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al marcar prospectos como sin asignar. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error al marcar prospectos como sin asignar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al marcar prospectos como sin asignar. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <>
      <div className="tabla_prospectos_publicidad">
        <div className="title">
          <h2>Prospectos obtenidos de la campaña</h2>

          <div className="buttons">
            <button
              className={isButtonActive ? "active" : ""}
              onClick={handleAssignButtonClick}
            >
              Asignar usuarios
            </button>

            <button onClick={handleUnassignButtonClick}>
              Marcar sin asignar
            </button>
          </div>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nº</th>
                <th scope="col">Prospecto</th>
                <th scope="col">Correo</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Tipo</th>
                <th scope="col">Setter</th>
              </tr>
            </thead>

            <tbody>
              {prospectos.map((prospecto, index) => (
                <tr
                  key={index}
                  className={
                    selectedProspects.includes(prospecto.id) ? "active" : ""
                  }
                >
                  <td data-label="Seleccionar">
                    <input
                      type="checkbox"
                      onChange={(event) =>
                        handleCheckboxChange(event, prospecto.id)
                      }
                      checked={selectedProspects.includes(prospecto.id)}
                    />
                  </td>
                  <td data-label="Nº">{prospecto.id}</td>
                  <td data-label="Prospecto">
                    {prospecto.name} {prospecto.lname}
                  </td>
                  <td data-label="Correo">{prospecto.email}</td>
                  <td data-label="Teléfono">{prospecto.phone}</td>
                  <td data-label="Tipo">{prospecto.type}</td>
                  <td data-label="Setter">
                    {prospecto.id_setter === null ? (
                      <span>Sin asignar</span>
                    ) : (
                      prospecto.setter_name
                    )}
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

export default List_Prospects_campaign;
