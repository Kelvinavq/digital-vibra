import "./Prospectos_a.css";
import React, { useState, useEffect, useRef } from "react";
import Config from "../../../config/Config";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

const List_prospectos_a = () => {
  const [ListProspects, setListProspects] = useState([]);
  const [selectedProspectProjects, setSelectedProspectProjects] = useState([]);
  const [setterList, setSetterList] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);

  useEffect(() => {
    const getProspects = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_list_prospects.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const ListaProspectos = await response.json();

        if (!response.ok) {
          console.error("Error al obtener lista de prospectos");
          Swal.fire({
            title: "Error al obtener lista de prospectos",
            text: "Hubo un error al obtener la lista de prospectos",
            icon: "error",
          });
          return;
        } else {
          setListProspects(ListaProspectos);
        }
      } catch (error) {
        console.error("Error al manejar la solicitud de detalles:", error);
        Swal.fire({
          title: "Error",
          text: "Error inesperado al manejar la solicitud de detalles",
          icon: "error",
        });
      }
    };

    const getSetters = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_setters.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Error al obtener lista de setters");
          Swal.fire({
            title: "Error al obtener lista de setters",
            text: "Hubo un error al obtener la lista de setters",
            icon: "error",
          });
          return;
        }

        const setterData = await response.json();
        setSetterList(setterData);
      } catch (error) {
        console.error("Error al manejar la solicitud de detalles:", error);
        Swal.fire({
          title: "Error",
          text: "Error inesperado al manejar la solicitud de detalles",
          icon: "error",
        });
      }
    };

    getSetters();
    getProspects();
  }, []);

  const getProspectProjects = async (idProspect) => {
    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_prospect_projects.php?id_prospect=${idProspect}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const prospectProjects = await response.json();
        setSelectedProspectProjects(prospectProjects);
      } else {
        console.error("Error al obtener proyectos del prospecto");
        Swal.fire({
          title: "Error al obtener proyectos del prospecto",
          text: "Hubo un error al obtener los proyectos del prospecto",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al manejar la solicitud de detalles:", error);
      Swal.fire({
        title: "Error",
        text: "Error inesperado al manejar la solicitud de detalles",
        icon: "error",
      });
    }
  };

  const handleAddProject = (id_prospect) => {
    // Construir la lista de opciones para el select de setters
    const setterOptions = setterList.map(
      (setter) =>
        `<option value="${setter.id}" data-team="${setter.team}">${setter.name}</option>`
    );

    // Aquí puedes definir la ventana modal de Swal para agregar un nuevo proyecto
    Swal.fire({
      title: "Agregar nuevo proyecto",
      html: `
        <input type="text" id="budget" class="swal2-input" placeholder="Presupuesto">
        <input type="text" id="commission" class="swal2-input" placeholder="Comisión">
        <textarea id="note" class="swal2-textarea" placeholder="Nota"></textarea>
        <label>Fue atendido ?</label>
        <select id="attended" class="swal2-select">
          <option value="Si">Si</option>
          <option value="No">No</option>
        </select>
        <label>Estado del proyecto</label>
        <select id="status" class="swal2-select">
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
        </select>
        <label>Seleccionar Setter</label>
        <select id="setter" class="swal2-select">
          ${setterOptions.join("")}
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const budget = Swal.getPopup().querySelector("#budget").value;
        const commission = Swal.getPopup().querySelector("#commission").value;
        const note = Swal.getPopup().querySelector("#note").value;
        const attended = Swal.getPopup().querySelector("#attended").value;
        const status = Swal.getPopup().querySelector("#status").value;
        const setterId = Swal.getPopup().querySelector("#setter").value;
        const setterTeam = Swal.getPopup().querySelector(
          `#setter option[value="${setterId}"]`
        ).dataset.team;

        // Realizar la solicitud al backend para guardar los datos del nuevo proyecto
        fetch(`${Config.backendBaseUrlAdmin}add_project.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_prospect: id_prospect,
            id_setter: setterId,
            team: setterTeam,
            budget: budget,
            commission: commission,
            note: note,
            attended: attended,
            status: status,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al agregar el proyecto");
            }
            return response.json();
          })
          .then((data) => {
            // Aquí puedes manejar la respuesta del backend si es necesario
            console.log("Respuesta del backend:", data);
          })
          .catch((error) => {
            console.error("Error al agregar el proyecto:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al agregar el proyecto",
              icon: "error",
            });
          });
      },
    });
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);

    // Mostrar ventana modal de edición
    Swal.fire({
      title: "Editar proyecto",
      html: `
        <input type="text" id="budget" class="swal2-input" placeholder="Presupuesto" value="${
          project.budget
        }">
        <input type="text" id="commission" class="swal2-input" placeholder="Comisión" value="${
          project.commission
        }">
        <textarea id="note" class="swal2-textarea" placeholder="Nota">${
          project.note
        }</textarea>
        <label>Fue atendido ?</label>
        <select id="attended" class="swal2-select">
          <option value="Si" ${
            project.attended === "Si" ? "selected" : ""
          }>Si</option>
          <option value="No" ${
            project.attended === "No" ? "selected" : ""
          }>No</option>
        </select>
        <label>Estado del proyecto</label>
        <select id="status" class="swal2-select">
          <option value="pendiente" ${
            project.status === "pendiente" ? "selected" : ""
          }>Pendiente</option>
          <option value="aprobado" ${
            project.status === "aprobado" ? "selected" : ""
          }>Aprobado</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const budget = Swal.getPopup().querySelector("#budget").value;
        const commission = Swal.getPopup().querySelector("#commission").value;
        const note = Swal.getPopup().querySelector("#note").value;
        const attended = Swal.getPopup().querySelector("#attended").value;
        const status = Swal.getPopup().querySelector("#status").value;

        // Realizar la solicitud al backend para actualizar los datos del proyecto
        fetch(`${Config.backendBaseUrlAdmin}update_project.php`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: project.id,
            budget: budget,
            commission: commission,
            note: note,
            attended: attended,
            status: status,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al actualizar el proyecto");
            }
            return response.json();
          })
          .then((data) => {
            // Actualizar la lista de proyectos después de la edición
            // (Puedes hacerlo de acuerdo a tu estructura de componentes)
            console.log("Respuesta del backend:", data);
          })
          .catch((error) => {
            console.error("Error al actualizar el proyecto:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error al actualizar el proyecto",
              icon: "error",
            });
          });
      },
    });
  };

  return (
    <div className="container_prospectos">
      <div className="title">
        <h2>prospectos</h2>
        <p>lista de prospectos y setters</p>
      </div>

      <div className="tablas_prospectos">
        <div className="left">
          <h2>tabla de prospectos</h2>

          <div className="tabla_prospectos tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Prospecto</th>
                  <th scope="col">¿Respondió?</th>
                  <th scope="col">¿Agendó?</th>
                  <th scope="col">Setter</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
                </tr>
              </thead>

              <tbody>
                {ListProspects.map((prospecto, index) => (
                  <tr key={index}>
                    <td data-label="Nº">{prospecto.id}</td>
                    <td data-label="Prospecto">
                      {prospecto.name} {prospecto.last_name}
                    </td>
                    <td data-label="¿Respondió?" className={prospecto.response}>
                      <span>{prospecto.response}</span>
                    </td>
                    <td data-label="¿Agendó?" className={prospecto.schedule}>
                      <span>{prospecto.schedule}</span>
                    </td>
                    <td data-label="Setter">
                      <span>{prospecto.setter_name}</span>

                    </td>

                    <td data-label="">
                      <button onClick={() => getProspectProjects(prospecto.id)}>
                        <VisibilityOutlinedIcon />
                      </button>
                    </td>
                    <td data-label="">
                      <button onClick={() => handleAddProject(prospecto.id)}>
                        <AddIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="right">
          <h2>Proyectos del prospecto</h2>
          <div className="tabla_proyectos tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">ID Setter</th>
                  <th scope="col">Presupuesto</th>
                  <th scope="col">Comisión</th>
                  <th scope="col">Nota</th>
                  <th scope="col">Atendido</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha de Registro</th>
                  <th scope="col">Hora de Registro</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {selectedProspectProjects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.id}</td>
                    <td>{project.id_setter}</td>
                    <td>{project.budget}</td>
                    <td>{project.commission}</td>
                    <td>{project.note}</td>
                    <td>{project.attended}</td>
                    <td>{project.status}</td>
                    <td>{project.registered_date}</td>
                    <td>{project.registered_time}</td>
                    <button onClick={() => handleEditProject(project)}>
                      <EditIcon />
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List_prospectos_a;
