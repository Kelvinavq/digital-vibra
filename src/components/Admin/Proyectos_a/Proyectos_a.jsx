import "./Proyectos_a.css";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const Proyectos_a = () => {
  const location = useLocation();

  const [proyectos, setProyectos] = useState([]);

  const setterId = new URLSearchParams(location.search).get("setter");
  const prospectId = new URLSearchParams(location.search).get("prospecto");
  const [nombreSetter, setNombreSetter] = useState("");
  const [nombreProspecto, setNombreProspecto] = useState("");

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_projects_list.php`;

        // Verificar si hay un ID de setter en la URL
        if (setterId) {
          url += `?id_setter=${setterId}`;
        }
        // Verificar si hay un ID de prospecto en la URL
        else if (prospectId) {
          url += `?id_prospect=${prospectId}`;
        }

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
          setNombreSetter(data[0].setter_name);
          setNombreProspecto(data[0].prospect_name);
          setProyectos(data);
          console.log(proyectos);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
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
        closeAddProjectModal();
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

  // agregar
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [setters, setSetters] = useState([]);
  const [selectedSetter, setSelectedSetter] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [NameProject, setNameProject] = useState("");

  // Cargar setters y prospectos al abrir el modal
  useEffect(() => {
    const fetchSettersAndProspects = async () => {
      try {
        if (setterId) {
          // Si existe el parámetro GET "setter=x"
          const responseSetter = await fetch(
            `${Config.backendBaseUrlAdmin}get_setter.php?id=${setterId}`
          );
          if (responseSetter.ok) {
            const setterData = await responseSetter.json();
            setSelectedSetter(setterData);
          }

          // Cargar prospectos del setter especificado
          const responseProspects = await fetch(
            `${Config.backendBaseUrlAdmin}get_prospects_by_setter.php?id_setter=${setterId}`
          );
          if (responseProspects.ok) {
            const prospectsData = await responseProspects.json();
            setProspects(prospectsData);
          }
        } else {
          // Si no existe el parámetro GET "setter=x"
          const responseSetters = await fetch(
            `${Config.backendBaseUrlAdmin}get_active_setters.php`
          );
          if (responseSetters.ok) {
            const settersData = await responseSetters.json();
            setSetters(settersData);
          }
        }
      } catch (error) {
        console.error("Error al obtener setters y prospectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al cargar setters y prospectos",
          text: "Hubo un error al cargar los setters y prospectos.",
        });
      }
    };

    // Llamar a la función para cargar setters y prospectos al montar el componente
    fetchSettersAndProspects();
  }, [setterId]); // Se ejecutará cada vez que cambie setterId

  const handleSetterChange = async (setterId) => {
    console.log(setterId)
    try {
      // Realizar una solicitud al backend para obtener los prospectos asociados al setter seleccionado
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_prospects_by_setter.php?id_setter=${setterId}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Si la solicitud es exitosa, obtener los prospectos del cuerpo de la respuesta
        const data = await response.json();
        setProspects(data);
      } else {
        // Si la solicitud no es exitosa, mostrar un mensaje de error
        Swal.fire({
          icon: "error",
          title: "Error al obtener prospectos",
          text: "Hubo un error al obtener los prospectos asociados al setter.",
        });
      }
    } catch (error) {
      console.error("Error al obtener prospectos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al obtener prospectos",
        text: "Hubo un error al obtener los prospectos asociados al setter.",
      });
    }
  };

  const openAddProjectModal = () => {
    setIsAddModalOpen(true);
  };

  // Función para cerrar el modal de agregar proyecto
  const closeAddProjectModal = () => {
    setIsAddModalOpen(false);
  };

  const addProject = async () => {
    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}add_project.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_setter: selectedSetter.id,
            team: selectedSetter.team,
            id_prospect: selectedProspect,
            budget: budget,
            commission: commission,
            attended: attended ? "si" : "no",
            status: status ? "aprobado" : "pendiente",
            payment_type: paymentMethod,
            name_project: NameProject,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "¡Proyecto agregado!",
          text: "El proyecto ha sido agregado exitosamente.",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
        setIsAddModalOpen(false);
      } else {
        console.error("Error al agregar proyecto");
        Swal.fire({
          title: "Error al agregar proyecto",
          text: "Hubo un error al agregar el proyecto.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al agregar proyecto:", error);
      Swal.fire({
        title: "Error",
        text: "Error inesperado al agregar proyecto",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="proyectos">
        <div className="title">
          <div className="content">
            <h2>
              {setterId != null
                ? `Prospectos registrados por el setter ${nombreSetter}`
                : prospectId != null
                ? `Proyectos del prospecto ${nombreProspecto}`
                : "Proyectos"}
            </h2>
            <p>Lista de proyectos</p>
          </div>

          <div className="button">
            <button onClick={openAddProjectModal}>Agregar proyecto</button>
          </div>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Proyecto</th>
                <th scope="col">Setter</th>
                <th scope="col">Prospecto</th>
                <th scope="col">Fecha y hora</th>
                <th scope="col">Estatus</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
              {proyectos.map((proyecto, index) => (
                <tr key={index}>
                  <td data-label="Nº">{proyecto.id}</td>
                  <td data-label="Nº">{proyecto.project_name}</td>
                  <td data-label="Setter">{proyecto.setter_name}</td>
                  <td data-label="Prospecto">
                    {proyecto.prospect_name} {proyecto.prospect_last_name}
                  </td>
                  <td data-label="Fecha y hora">
                    {proyecto.registered_date} {proyecto.registered_time}
                  </td>
                  <td data-label="Estatus" className={proyecto.status}>
                    <span>{proyecto.status}</span>
                  </td>
                  <td data-label="Editar">
                    <button onClick={() => editProject(proyecto)}>
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                        Estatus - {status != false ? "finalizado" : "pendiente"}
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

        {/* Modal para agregar proyecto */}
        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <button className="close-modal" onClick={closeAddProjectModal}>
                <CloseIcon />
              </button>
              <h3>Agregar Proyecto</h3>
              <div className="content-modal">

                Bugueado por el momento
              {/* 
                <div className="left">
                  <div className="input">
                    <label htmlFor="nameProject">
                      Ingrese un nombre al proyecto
                    </label>
                    <input
                      type="text"
                      id="nameProject"
                      name="nameProject"
                      placeholder="Nombre del proyecto"
                      value={NameProject}
                      onChange={(e) => setNameProject(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="Setter">
                      Selecciona el setter al que se le asignará este proyecto
                    </label>

                    {setterId != null ? (
                      <select
                        name="setter"
                        id="setter"
                        value={selectedSetter ? selectedSetter.id : ""}
                        onChange={(e) => handleSetterChange(e.target.value)}
                      >
                        <option value={selectedSetter.id}>
                          {selectedSetter.name}
                        </option>
                      </select>
                    ) : (
                      <select
                        name="setter"
                        id="setter"
                        value={selectedSetter}
                        onChange={(e) => handleSetterChange(e.target.value)}
                      >
                        {setters.map((setter) => (
                          <option key={setter.id} value={setter.id}>
                            {setter.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="input">
                    <label htmlFor="prospecto">
                      Selecciona el prospecto al que se le asignará este
                      proyecto
                    </label>
                    <select
                      name="prospecto"
                      id="prospecto"
                      value={selectedProspect}
                      onChange={(e) => setSelectedProspect(e.target.value)}
                    >
                      <option value="">Selecciona un prospecto</option>
                      {prospects.map((prospect) => (
                        <option key={prospect.id} value={prospect.id}>
                          {prospect.name} {prospect.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="budget">Ingrese el presupuesto</label>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      placeholder="0.00"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="comission">
                      Ingrese la comisión para el setter
                    </label>
                    <input
                      type="text"
                      id="comission"
                      name="comission"
                      placeholder="0.00"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                    />
                  </div>
                </div>

                <div className="right">
                  <div className="inputs">
                    <div className="input ">
                      <p>Estatus</p>
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
                      <p>Atendido</p>
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
                    <label htmlFor="payment_method">Método de pago</label>
                    <select
                      name="payment_method"
                      id="payment_method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Selecciona un metodo</option>
                      <option value="contado">De contado</option>
                      <option value="cuotas">Cuotas</option>
                    </select>
                  </div>

                  <div className="input">
                    <button className="update" onClick={addProject}>
                      Registrar proyecto
                    </button>
                  </div>
                </div>
              */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Proyectos_a;
