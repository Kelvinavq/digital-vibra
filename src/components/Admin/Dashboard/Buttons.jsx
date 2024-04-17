import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import CloseIcon from "@mui/icons-material/Close";

const Buttons = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [setters, setSetters] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [nameProject, setNameProject] = useState("");
  const [budget, setBudget] = useState("");
  const [commission, setCommission] = useState("");
  const [attended, setAttended] = useState(false);
  const [status, setStatus] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedProspect, setSelectedProspect] = useState("");
  const [Note, setNote] = useState("");
  const [Team, setTeam] = useState("");
  const [selectedSetter, setSelectedSetter] = useState(null); 

  useEffect(() => {
    const fetchSetters = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_active_setters.php`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSetters(data);
        } else {
          console.error("Error fetching setters:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching setters:", error);
      }
      
    };

    fetchSetters();
  }, [Team]);

  const handleSetterChange = async (event) => {
    const setterId = event.target.value;
    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_prospects_by_setter.php?id_setter=${setterId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProspects(data);
        // Obtener el equipo (team) del setter seleccionado
        const selectedSetter = setters.find(
          (setter) => setter.id === parseInt(setterId)
        );
        if (selectedSetter) {
          setTeam(selectedSetter.team);
          setSelectedSetter(selectedSetter.id);
        }

        console.log(selectedSetter.id)

      } else {
        console.error("Error fetching prospects:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching prospects:", error);
    }
  };

  const handleProspectChange = (event) => {
    setSelectedProspect(event.target.value);
  };

  const openAddProjectModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddProjectModal = () => {
    setIsAddModalOpen(false);
  };

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Cerrar el modal si se hace clic fuera de él
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

  const handleManageProjects = () => {
    window.location = "/admin/proyectos";
  };

  const handleRegisterProject = async () => {
    // Utilizar los estados en lugar de recoger los datos del DOM
    if (
      !nameProject ||
      !prospects ||
      !selectedProspect ||
      !budget ||
      !commission ||
      !paymentMethod
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos",
      });
      return;
    }

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}register_new_project.php`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            nameProject: nameProject,
            setterId: selectedSetter,
            prospectId: selectedProspect,
            budget: budget,
            commission: commission,
            attended: attended ? "si" : "no",
            status: status ? "aprobado" : "pendiente",
            paymentMethod: paymentMethod,
            Team: Team,
            Note: Note,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Proyecto registrado exitosamente",
          didClose: () => {
            window.location.reload();
          },
        });
        closeAddProjectModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al registrar el proyecto",
        });
      }
    } catch (error) {
      console.error("Error registrando proyecto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al registrar el proyecto",
      });
    }
  };

  return (
    <>
      <div className="buttons">
        <button onClick={openAddProjectModal}>Agregar proyecto</button>
        <button onClick={handleManageProjects}>Ver proyectos</button>
      </div>
      <div className="modal-buttons">
        {isAddModalOpen && (
          <div className="modal-overlay">
            <div className="modal" ref={modalRef}>
              <button className="close-modal" onClick={closeAddProjectModal}>
                <CloseIcon />
              </button>
              <h3>Agregar Proyecto</h3>
              <div className="content-modal">
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
                      value={nameProject}
                      onChange={(e) => setNameProject(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="Setter">
                      Selecciona el setter al que se le asignará este proyecto
                    </label>

                    <select
                      name="setter"
                      id="setter"
                      onChange={handleSetterChange}
                    >
                      <option value="">Seleccione un setter</option>
                      {setters.map((setter) => (
                        <option key={setter.id} value={setter.id}>
                          {setter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="prospecto">
                      Selecciona el prospecto al que se le asignará este
                      proyecto
                    </label>
                    <select
                      name="prospecto"
                      id="prospecto"
                      onChange={handleProspectChange}
                      value={selectedProspect}
                    >
                      <option value="">Seleccione un prospecto</option>
                      {prospects.map((prospect) => (
                        <option key={prospect.id} value={prospect.id}>
                          {prospect.name}
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
                          onChange={(e) => setStatus(e.target.checked)}
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
                          onChange={(e) => setAttended(e.target.checked)}
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
                    <label htmlFor="note">Nota</label>
                    <textarea
                      name="note"
                      id="note"
                      value={Note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Nota"
                    ></textarea>
                  </div>

                  <div className="input">
                    <button className="update" onClick={handleRegisterProject}>
                      Registrar proyecto
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

export default Buttons;
