import { useEffect, useState, useRef } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";
import Config from "../../../config/Config";
import CloseIcon from "@mui/icons-material/Close";

const Prospectos_list = () => {
  const [prospectos, setProspectos] = useState([]);
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

  const verProspectos = () => {
    window.location = "/user/prospectos";
  };

  const abrirCalendly = () => {
    window.open(
      "https://calendly.com/vibradigital/reunion-nahuel-veliz",
      "_blank"
    );
    return false;
  };

  useEffect(() => {
    const getProspects = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_prospects_limit.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProspectos(data);
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
  }, []);

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

  return (
    <div className="prospectos_list">
      <div className="title">
        <h2>Prospectos Registrados</h2>
        <button onClick={verProspectos}>
          <MoreHorizIcon />
        </button>
      </div>

      <div className="tabla_prospectos">
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Prospecto</th>
              <th scope="col">¿Respondió?</th>
              <th scope="col">¿Agendó?</th>
            </tr>
          </thead>

          <tbody>
            {prospectos.length > 0 ? (
              prospectos.map((prospecto, index) => (
                <tr key={index} onClick={() => editProspect(prospecto)}>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aún no hay prospectos registrados</td>
              </tr>
            )}
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

export default Prospectos_list;
