import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import "./Pagos.css";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from '@mui/icons-material/Visibility';

const Pagos_a = () => {
  const [proyectos, setProyectos] = useState([]);

  // agregar pago
  const [setters, setSetters] = useState([]);
  const [prospectos, setProspectos] = useState([]);
  const [selectedSetter, setSelectedSetter] = useState("");
  const [selectedProspecto, setSelectedProspecto] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [proyectosSelected, setProyectosSelected] = useState([]);
  const [proyectoInfo, setProyectoInfo] = useState(null);
  const [Amount, setAmount] = useState("");

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_projects_payments.php`;

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

    const fetchSetters = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_setters.php`;

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
          setSetters(data);
        } else {
          // Manejar el caso de error
          Swal.fire({
            icon: "error",
            title: "Error al obtener setters",
            text: "Hubo un error al obtener los setters.",
          });
        }
      } catch (error) {
        console.error("Error al obtener setters:", error);
        Swal.fire({
          icon: "error",
          title: "Error al obtener setters",
          text: "Hubo un error al obtener los setters.",
        });
      }
    };

    fetchSetters();
    fetchProyectos();
  }, []);

  // agregar pago
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSetter("");
    setSelectedProspecto("");
    setSelectedProject("");
    setProyectoInfo(null);
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

  const handleSetterChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedSetter(selectedValue);

    try {
      let url = `${Config.backendBaseUrlAdmin}get_prospectos_by_setter.php?id_setter=${selectedValue}`;

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
        setProspectos(data);
      } else {
        // Manejar el caso de error
        Swal.fire({
          icon: "error",
          title: "Error al obtener prospectos",
          text: "Hubo un error al obtener los prospectos.",
        });
      }
    } catch (error) {
      console.error("Error al obtener prospectos:", error);
      Swal.fire({
        icon: "error",
        title: "Error al obtener prospectos",
        text: "Hubo un error al obtener los prospectos.",
      });
    }
  };

  const handleProspectoChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedProspecto(selectedValue);

    try {
      let url = `${Config.backendBaseUrlAdmin}get_proyectos_by_setter_and_prospect.php?id_setter=${selectedSetter}&id_prospect=${selectedValue}`;

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
        setProyectosSelected(data);
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

  const handleProjectChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedProject(selectedValue);

    try {
      let url = `${Config.backendBaseUrlAdmin}get_project_info.php?id_project=${selectedValue}`;

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
        setProyectoInfo(data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al obtener información del proyecto",
          text: "Hubo un error al obtener la información del proyecto.",
        });
      }
    } catch (error) {
      console.error("Error al obtener información del proyecto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al obtener información del proyecto",
        text: "Hubo un error al obtener la información del proyecto.",
      });
    }
  };

  const registrarPago = async () => {
    try {
      // Validar que se hayan seleccionado todos los campos necesarios
      if (
        !selectedSetter ||
        !selectedProspecto ||
        !selectedProject ||
        !Amount
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, completa todos los campos antes de registrar el pago.",
        });
        return;
      }
  
      // Validar que se haya ingresado un monto válido
      const numericAmount = parseFloat(Amount.replace(",", ""));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, ingresa un monto válido para el pago.",
        });
        return;
      }
  
        // Validar que el monto del pago no sea mayor al monto pendiente
    if (proyectoInfo && numericAmount > proyectoInfo.restante) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El monto ingresado es mayor al monto pendiente de pago.",
      });
      return;
    }


      const url = `${Config.backendBaseUrlAdmin}registrar_pago.php`;
      const data = {
        setter_id: selectedSetter,
        prospect_id: selectedProspecto,
        project_id: selectedProject,
        amount: numericAmount,
      };
  
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setIsModalOpen(false);
        setSelectedSetter("");
        setSelectedProspecto("");
        setSelectedProject("");
        setProyectoInfo(null);
        setAmount("");
        Swal.fire({
          icon: "success",
          title: "Pago registrado",
          text: "El pago se ha registrado exitosamente.",
          didClose: () => {
            window.location.reload();
          },
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al registrar el pago. Por favor, intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error al registrar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al registrar el pago. Por favor, intenta nuevamente.",
      });
    }
  };
  

  const handleAmountChange = (e) => {
    const formattedAmount = formatAmount(e.target.value);
    setAmount(formattedAmount);
  };

  const formatAmount = (value) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^\d]/g, "");

    // Formatear con separador de miles y decimales
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(numericValue) / 100);

    return formattedValue;
  };

  const redirectToHistory = (setter, prospect) => {
    window.location = `/admin/historial-pagos?setter=${setter}&prospect=${prospect}`;
  };


  // editar pago

  return (
    <>
      <div className="pagos">
        <div className="title">
          <h2>Gestión de pagos</h2>
        </div>

        <div className="buttons">
          <div className="left">
            <button className="active">Proyectos</button>
            <button>Setters</button>
            <button>Administradores</button>
          </div>

          <div className="right">
          <button onClick={() => setIsModalOpen(true)}>Registrar pago</button>
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
                <th scope="col">Presupuesto</th>
                <th scope="col">Abonado</th>
                <th scope="col">Restante</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
              {proyectos.map((proyecto, index) => (
                <tr key={index}>
                  <td data-label="Nº">{proyecto.id}</td>
                  <td data-label="Proyecto">{proyecto.project_name}</td>
                  <td data-label="Setter">{proyecto.setter_name}</td>
                  <td data-label="Prospecto">
                    {proyecto.prospect_name} {proyecto.prospect_last_name}
                  </td>
                  <td data-label="Presupuesto">{proyecto.budget}</td>
                  <td data-label="Abonado">{proyecto.total_pagado}</td>
                  <td data-label="Restante">{proyecto.restante}</td>
                  <td data-label="Editar">
                    <button onClick={() => redirectToHistory(proyecto.id_setter, proyecto.id_prospect)}>
                      <VisibilityIcon />
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
              <h3>Registrar pago</h3>

              <div className="content-modal">
                <div className="left">
                  <div className="input">
                    <label htmlFor="setter">Selecciona el setter</label>
                    <select
                      name="setter"
                      id="setter"
                      value={selectedSetter}
                      onChange={handleSetterChange}
                    >
                      <option value="">Seleccionar setter</option>
                      {setters.map((setter) => (
                        <option key={setter.id} value={setter.id}>
                          {setter.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="prospect">Selecciona el prospecto</label>
                    <select
                      name="prospect"
                      id="prospect"
                      value={selectedProspecto}
                      onChange={handleProspectoChange}
                    >
                      <option value="">Selecciona el prospecto</option>
                      {prospectos.map((prospecto) => (
                        <option key={prospecto.id} value={prospecto.id}>
                          {prospecto.name} {prospecto.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="project">Selecciona el proyecto</label>
                    <select
                      name="project"
                      id="project"
                      value={selectedProject}
                      onChange={handleProjectChange}
                    >
                      <option value="">Selecciona el proyecto</option>
                      {proyectosSelected.map((proyecto) => (
                        <option key={proyecto.id} value={proyecto.id}>
                          {proyecto.project_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="right">
                  {proyectoInfo && (
                    <div className="input">
                      <p>
                        <strong>Presupuesto registrado: </strong> $
                        {proyectoInfo.budget}
                      </p>
                      <p>
                        <strong>Abonado: </strong> ${proyectoInfo.total_pagado}
                      </p>
                      <p>
                        <strong>Restante: </strong> ${proyectoInfo.restante}
                      </p>
                    </div>
                  )}
                  <div className="input">
                    <label htmlFor="amount">Monto del pago</label>
                    <input
                      type="text"
                      id="amount"
                      placeholder="0.00"
                      value={Amount}
                      onChange={handleAmountChange}
                    />
                  </div>

                  <div className="input">
                    <button className="update" onClick={registrarPago}>Registrar pago</button>
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

export default Pagos_a;
