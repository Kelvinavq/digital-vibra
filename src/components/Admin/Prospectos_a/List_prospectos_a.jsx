import "./Prospectos_a.css";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const List_prospectos_a = () => {
  const [prospectos, setProspectos] = useState([]);
  const [countProspects, setCountProspects] = useState(0);

  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("id");
  const [nombreSetter, setNombreSetter] = useState("");

  const [responseFilter, setResponseFilter] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProspects, setFilteredProspects] = useState([...prospectos]);



  useEffect(() => {
    const fetchProspectos = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_prospects.php`;
        if (userId) {
          url += `?id_setter=${userId}`;
          // Si se proporciona el ID del setter en la URL, obtener su nombre
          const responseSetter = await fetch(
            `${Config.backendBaseUrlAdmin}get_user_details.php?id=${userId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (responseSetter.ok) {
            const dataSetter = await responseSetter.json();
            setNombreSetter(dataSetter.name);
          }
        }

        const responseProspectos = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (responseProspectos.ok) {
          const dataProspectos = await responseProspectos.json();
          setProspectos(dataProspectos);
          setCountProspects(dataProspectos.length);
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

    fetchProspectos();
  }, [userId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prospectosDetails, setProspectosDetails] = useState("");

  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [responseCheck, setResponseCheck] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [meetDate, setMeetDate] = useState("");
  const [meetTime, setMeetTime] = useState("");
  const [socialLink, setSocialLink] = useState("");

  const abrirCalendly = () => {
    window.open(
      "https://calendly.com/vibradigital/reunion-nahuel-veliz",
      "_blank"
    );
    return false;
  };

  const editProspect = async (prospecto) => {
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlUser}get_prospect_detail.php?id=${prospecto.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const prospectDetails = await response.json();

      if (!response.ok) {
        console.error("Error al obtener detalles del prospecto");
        Swal.fire({
          title: "Error al obtener detalles del prospecto",
          text: "Hubo un error al obtener los detalles del prospecto",
          icon: "error",
        });
        return;
      } else {
        setProspectosDetails(prospectDetails);
        setName(prospectDetails.name || "");
        setLastName(prospectDetails.last_name || "");
        setEmail(prospectDetails.email || "");
        setNote(prospectDetails.note || "");
        setSocialLink(prospectDetails.social_link || "");

        setContactInfo(prospectDetails.contact_info || "");
        setResponseCheck(prospectDetails.response === "si");
        setSchedule(prospectDetails.schedule === "si");
        setMeetDate(prospectDetails.meet_date || "");
        setMeetTime(prospectDetails.meet_time || "");
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

  const updateProspectInfo = async () => {
    try {
      const response = await fetch(
        `${Config.backendBaseUrlUser}update_prospect_info.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: prospectosDetails.id,
            name,
            lastname,
            email,
            note,
            socialLink,
            contactInfo,
            responseCheck: responseCheck ? "si" : "no",
            schedule: schedule ? "si" : "no",
            meetDate,
            meetTime,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "¡Información actualizada!",
          text: "Los datos del prospecto han sido actualizados correctamente.",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
        // Cerrar el modal después de editar
        closeModal();
      } else {
        Swal.fire(
          "Error",
          "Hubo un problema al actualizar la información del prospecto.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al actualizar la información del prospecto:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al conectar con el servidor.",
        "error"
      );
    }
  };

  const redirectToProjects = (userId) => {
    window.location = `/admin/proyectos?prospecto=${userId}`;
  };


// Función para aplicar los filtros
const applyFilters = () => {
  let filteredData = [...prospectos];

  // Filtrar por respuesta
  if (responseFilter !== "") {
    filteredData = filteredData.filter((prospecto) => prospecto.response === responseFilter);
  }

  // Filtrar por agendamiento
  if (scheduleFilter !== "") {
    filteredData = filteredData.filter((prospecto) => prospecto.schedule === scheduleFilter);
  }

  // Filtrar por búsqueda de nombre y apellido o email
  if (searchTerm !== "") {
    const searchTermLowerCase = searchTerm.toLowerCase();
    filteredData = filteredData.filter((prospecto) =>
      `${prospecto.name} ${prospecto.last_name} ${prospecto.email}`.toLowerCase().includes(searchTermLowerCase)
    );
  }

  // Actualizar los prospectos filtrados
  setFilteredProspects(filteredData);
};

useEffect(() => {
  applyFilters();
}, [responseFilter, scheduleFilter, searchTerm, prospectos]);

  return (
    <div className="container_prospectos">
      <div className="title">
        <h2>{userId != null ? `Prospectos registrados por ${nombreSetter}` : "Prospectos"}</h2>
        <p>Lista de prospectos</p>
      </div>

      <div className="filtro">
        <div className="filtros">
          <div>
            <span>Prospectos Registrados:</span>
            <p>{countProspects}</p>
          </div>

          <div>
            <select
              value={responseFilter}
              onChange={(e) => setResponseFilter(e.target.value)}
            >
              <option value="">¿Respondió?</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
            >
              <option value="">¿Agendó Reunión?</option>
              <option value="si">Si</option>
              <option value="no">No</option>
            </select>
          </div>
          {/* <div>
            <button>Filtrar</button>
          </div> */}
        </div>
        <div className="buscador">
          <SearchIcon />
          <input
            type="text"
            placeholder="Buscar prospecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="tablas_prospectos">
        <div className="tabla_prospectos tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Prospecto</th>
                <th scope="col">¿Respondió?</th>
                <th scope="col">¿Agendó?</th>
                <th scope="col">Setter</th>
                <th scope="col">Proyectos</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
            {filteredProspects.map((prospecto, index) => (
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

                  <td data-label="Setter">{prospecto.user_name}</td>
                  <td data-label="Proyectos" className="buttons">
                    <button onClick={() => redirectToProjects(prospecto.id)}>
                      {prospecto.project_count}
                      <VisibilityIcon />
                    </button>
                  </td>
                  <td data-label="Editar">
                    <button onClick={() => editProspect(prospecto)}>
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <button className="close-modal" onClick={closeModal}>
              <CloseIcon />
            </button>
            <h3>
              Prospecto -{" "}
              {prospectosDetails.name + " " + prospectosDetails.last_name}
            </h3>

            <div className="content-modal">
              <div className="left">
                <div className="input">
                  <label htmlFor="name">Nombre del prospecto</label>
                  <input
                    id="name"
                    className="swal2-input"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="input">
                  <label htmlFor="lname">Apellido del prospecto</label>
                  <input
                    id="lname"
                    className="swal2-input"
                    placeholder="Apellido"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="input">
                  <label htmlFor="email">Email del prospecto</label>

                  <input
                    id="email"
                    className="swal2-input"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input">
                  <label htmlFor="note">Nota</label>
                  <textarea
                    id="note"
                    className="swal2-textarea"
                    placeholder="Nota"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>

                <div className="input">
                  <label htmlFor="link">Enlace</label>
                  <input
                    id="link"
                    className="swal2-input"
                    placeholder="Enlace"
                    value={socialLink}
                    onChange={(e) => setSocialLink(e.target.value)}
                  />
                </div>
                <div className="input">
                  <label htmlFor="contact">Número o contacto adicional</label>
                  <input
                    id="contact"
                    className="swal2-input"
                    placeholder="Información de contacto"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                </div>
              </div>
              <div className="right">
                <div className="inputs">
                  <div className="input ">
                    <p>¿Respondió?</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={responseCheck}
                        onChange={() => setResponseCheck(!responseCheck)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="input ">
                    <p>¿Agendó?</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={schedule}
                        onChange={() => setSchedule(!schedule)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="input">
                  <button onClick={abrirCalendly}>Agendar en Calendly</button>
                </div>

                <p>
                  ¡IMPORTANTE! Registra la fecha y hora de la reunión una vez
                  registrada en calendly
                </p>
                <div className="input">
                  <label htmlFor="date">Fecha de la reunión agendada</label>

                  <input
                    id="date"
                    type="date"
                    value={meetDate}
                    onChange={(e) => setMeetDate(e.target.value)}
                  />
                </div>
                <div className="input">
                  <label htmlFor="time">Hora de la reunión agendada</label>

                  <input
                    id="time"
                    type="time"
                    value={meetTime}
                    onChange={(e) => setMeetTime(e.target.value)}
                  />
                </div>
                <div className="input">
                  <button className="update" onClick={updateProspectInfo}>
                    Actualizar información
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List_prospectos_a;
