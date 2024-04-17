import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import CloseIcon from "@mui/icons-material/Close";

const Proyectos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proyectos, setProyectos] = useState([]);

  const [ProyectosDetails, setProyectosDetails] = useState("");

  const [id_project, setId_project] = useState("");
  const [setter_name, setSetter_name] = useState("");
  const [prospect_name, setProspect_name] = useState("");
  const [prospect_lname, setProspect_lname] = useState("");
  const [status, setStatus] = useState(false);
  const [budget, setBudget] = useState("");
  const [commission, setCommission] = useState("");
  const [note, setNote] = useState("");
  const [attended, setAttended] = useState(false);
  const [registered_date, setRegistered_date] = useState("");
  const [registered_time, setRegistered_time] = useState("");

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_projects_list_limit.php`;

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProyectos(data);
        } else {
          // Manejar el caso de error
          Swal.fire({
            icon: "error",
            title: "Error al obtener proyectos",
            text: "Hubo un error al obtener los proyectos.",
          });
        }
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al obtener proyectos",
          text: "Hubo un error al obtener los proyectos.",
        });
      }
    };

    fetchProyectos();
  }, []);

  const handleManageProjects = () => {
    window.location = "/admin/proyectos";
  };

  const editProject = async (proyecto) => {
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_project_detail.php?id=${proyecto.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const projectDetails = await response.json();

      if (!response.ok) {
        console.error("Error al obtener detalles del proyecto");
        Swal.fire({
          title: "Error al obtener detalles del proyecto",
          text: "Hubo un error al obtener los detalles del proyecto",
          icon: "error",
        });
        return;
      } else {
        setProyectosDetails(projectDetails);

        setId_project(projectDetails.id || "");
        setSetter_name(projectDetails.setter_name || "");
        setProspect_name(projectDetails.prospect_name || "");
        setProspect_lname(projectDetails.prospect_lname || "");
        setStatus(projectDetails.status === "finalizado");
        setBudget(projectDetails.budget || "");
        setCommission(projectDetails.commission || "");
        setNote(projectDetails.note || "");
        setAttended(projectDetails.attended === "si");
        setRegistered_date(projectDetails.registered_date || "");
        setRegistered_time(projectDetails.registered_time || "");
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Cerrar el modal si se hace clic fuera de él
        closeModal();
      }
    };

    // Añadir el evento de escucha al hacer clic fuera del modal
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpiar el evento de escucha al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const updateProjectInfo = async () => {
    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}update_project_prospect.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_project: ProyectosDetails.id,
            id_prospect: ProyectosDetails.id_prospect,
            prospect_name: prospect_name,
            prospect_lname: prospect_lname,
            budget: budget,
            commission: commission,
            note: note,
            attended: attended ? "si" : "no",
            status: status ? "finalizado" : "pendiente",
          }),
        }
      );

      if (response.ok) {
        // Actualización exitosa
        Swal.fire({
          title: "¡Proyecto actualizado!",
          text: "La información del proyecto ha sido actualizada con éxito.",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
        // Cerrar modal
        setIsModalOpen(false);
      } else {
        // Error al actualizar
        console.error("Error al actualizar el proyecto");
        Swal.fire({
          title: "Error al actualizar el proyecto",
          text: "Hubo un error al actualizar la información del proyecto",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      Swal.fire({
        title: "Error",
        text: "Error inesperado al actualizar el proyecto",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="proyectos">
        <div className="head">
          <h2>Proyectos</h2>
          <button onClick={handleManageProjects}>Gestionar</button>
        </div>

        <div className="lista_proyectos">
          {proyectos.map((proyecto, index) => (
            <div key={index} className="proyecto">
              <div className="info">
                <div className="icono">
                  <h4>{proyecto.project_name.charAt(0)}</h4>
                </div>

                <div className="text">
                  <span>{proyecto.project_name}</span>
                  <p>Presupuesto: $ {proyecto.budget}</p>
                </div>
              </div>

              <button onClick={() => editProject(proyecto)}>
                <VisibilityIcon />
              </button>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <button className="close-modal" onClick={closeModal}>
                <CloseIcon />
              </button>
              <h3>Proyecto #{id_project}</h3>
              <p>
                <strong>Setter a cargo: </strong> {setter_name}
              </p>

              <div className="content-modal">
                <div className="left">
                  <div className="input">
                    <label htmlFor="name_prospect">Nombre del prospecto</label>
                    <input
                      id="name_prospect"
                      className="swal2-input"
                      placeholder="Nombre del prospecto"
                      value={prospect_name}
                      onChange={(e) => setProspect_name(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="lname_prospect">
                      Apellido del prospecto
                    </label>
                    <input
                      id="lname_prospect"
                      className="swal2-input"
                      placeholder="Apellido del prospecto"
                      value={prospect_lname}
                      onChange={(e) => setProspect_lname(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="budget">Presupuesto del proyecto</label>
                    <input
                      id="budget"
                      className="swal2-input"
                      placeholder="Presupuesto del proyecto"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="commission">Comisión para el setter</label>
                    <input
                      id="commission"
                      className="swal2-input"
                      placeholder="Comisión para el setter"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                    />
                  </div>
                </div>
                <div className="right">
                  <div className="input">
                    <label htmlFor="">Fecha de registro</label>
                    <p>{registered_date}</p>
                  </div>
                  <div className="input">
                    <label htmlFor="">Hora de registro</label>
                    <p>{registered_time}</p>
                  </div>
                  <div className="inputs">
                    <div className="input ">
                      <p>
                        Estatus - {status != false ? "Finalizado" : "Pendiente"}
                      </p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={status}
                          onChange={() => setStatus(!status)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="input ">
                      <p>Atendido - {attended != false ? "Si" : "No"}</p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={attended}
                          onChange={() => setAttended(!attended)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="input">
                    <label htmlFor="note">Nota</label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="input">
                    <button className="update" onClick={updateProjectInfo}>
                      Actualizar información
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Proyectos;
