import "./Prospectos.css";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

const Prospectos_u = () => {
  const [prospectos, setProspectos] = useState([]);
  const [countProspects, setCountProspects] = useState(0);
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

  const [responseFilter, setResponseFilter] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProspects = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_prospects.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProspectos(data);
          setCountProspects(data.length);
        } else {
          console.error("Error al obtener la lista de prospectos");
          Swal.fire({
            title: "Error al obtener la lista de prospectos",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener la lista de prospectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener la lista de prospectos",
        });
      }
    };

    getProspects();
  }, [prospectosDetails]);

  const abrirCalendly = () => {
    window.open(
      "https://calendly.com/vibradigital/reunion-nahuel-veliz",
      "_blank"
    );
    return false;
  };

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
          Swal.fire(
            "¡Registro exitoso!",
            "El prospecto se ha registrado correctamente.",
            "success"
          );
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
        Swal.fire(
          "¡Información actualizada!",
          "Los datos del prospecto han sido actualizados correctamente.",
          "success"
        );
        // Actualizar el estado de prospectos después de la edición
        const updatedProspects = prospectos.map((prospecto) =>
          prospecto.id === prospectosDetails.id
            ? { ...prospecto, name, last_name: lastname, email }
            : prospecto
        );
        setProspectos(updatedProspects);

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

  // Filtrar prospectos según los criterios seleccionados por el usuario
  let filteredProspects = prospectos.filter((prospecto) => {
    return (
      prospecto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospecto.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Aplicar filtros adicionales si se seleccionan
  if (responseFilter !== "") {
    filteredProspects = filteredProspects.filter(
      (prospecto) => prospecto.response === responseFilter
    );
  }

  if (scheduleFilter !== "") {
    filteredProspects = filteredProspects.filter(
      (prospecto) => prospecto.schedule === scheduleFilter
    );
  }

  const redirectToProjects = (userId) => {
    window.location = `/user/proyectos?prospecto=${userId}`;
  };

  return (
    <div className="prospectos">
      <div className="title">
        <div className="text">
          <h2>Prospectos registrados</h2>
          <p>Lista de los prospectos registrados</p>
        </div>

        <div className="button">
          <button onClick={addProspect}>Añadir</button>
        </div>
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

      <div className="tabla_prospectos">
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Prospecto</th>
              <th scope="col">¿Respondió?</th>
              <th scope="col">¿Agendó?</th>
              <th scope="col"></th>
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
                <td data-label="Ver proyectos">
                  <button onClick={() => redirectToProjects(prospecto.id)}>
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

export default Prospectos_u;
