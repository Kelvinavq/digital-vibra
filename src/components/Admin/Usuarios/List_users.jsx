import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./List_users.css";
import Config from "../../../config/Config";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

const List_users = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  const [UsersDetails, setUsersDetails] = useState("");

  const [RoleFilter, setRoleFilter] = useState("");
  const [TeamFilter, setTeamFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalProspectsOpen, setModalProspectsOpen] = useState(false);
  const [ModalProspectDetail, setModalProspectDetail] = useState(false);
  const [ListProspects, setListProspects] = useState([]);
  const [prospectoDetail, setProspectoDetail] = useState("");

  // prospectos
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

  useEffect(() => {
    // Función para cargar la lista de equipos
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_teams.php`
        );
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          console.error("Hubo un problema al cargar la lista de equipos");
        }
      } catch (error) {
        console.error("Error al cargar la lista de equipos:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_users.php`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setCountUsers(data.length);
        } else {
          console.error("Hubo un problema al cargar la lista de usuarios");
        }
      } catch (error) {
        console.error("Error al cargar la lista de usuarios:", error);
      }
    };

    fetchUsers();
    fetchTeams();
  }, [UsersDetails]);

  // Filtrar usuarios según los criterios seleccionados por el usuario
  let filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Aplicar filtros adicionales si se seleccionan
  if (RoleFilter !== "") {
    filteredUsers = filteredUsers.filter((user) => user.role === RoleFilter);
  }

  if (TeamFilter !== "") {
    filteredUsers = filteredUsers.filter((user) => user.team === TeamFilter);
  }

  const addUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Usuario",
      html:
        '<input name="name" class="swal2-input" placeholder="Nombre">' +
        '<input name="email" class="swal2-input" placeholder="Email">' +
        '<input name="password" type="password" class="swal2-input" placeholder="Contraseña">' +
        '<input name="phone_number" class="swal2-input" placeholder="Número de teléfono">' +
        '<input name="address" class="swal2-input" placeholder="Dirección">' +
        '<select name="role" class="swal2-input" id="role"> ' +
        '  <option value="">Seleccionar rol</option>' +
        '  <option value="setter">Setter</option>' +
        '  <option value="admin">Admin</option>' +
        "</select>" +
        '<div id="dynamicFields"></div>',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const phone_number = document.querySelector(
          'input[name="phone_number"]'
        ).value;
        const address = document.querySelector('input[name="address"]').value;
        const role = document.querySelector('select[name="role"]').value;
        const link_setter = Config.linkSetter;

        let formValues = {
          name,
          email,
          password,
          phone_number,
          address,
          role,
          link_setter,
        };

        // Si el rol es "setter", agregar el ID del equipo seleccionado
        if (role === "setter") {
          const team_id = document.querySelector('select[name="team"]').value;
          formValues = { ...formValues, team_id };
        }

        return formValues;
      },
      didOpen: () => {
        const roleSelect = document.getElementById("role");
        const dynamicFieldsContainer = document.getElementById("dynamicFields");

        roleSelect.addEventListener("change", (e) => {
          const selectedRole = e.target.value;

          // Limpiar los campos dinámicos anteriores
          dynamicFieldsContainer.innerHTML = "";

          const additionalFields = [];

          if (selectedRole === "setter") {
            // Crear campo para el enlace
            additionalFields.push(`
            <select name="team" class="swal2-input" id="team">
              <option value="">Seleccionar equipo</option>
              ${teams
                .map(
                  (team) => `<option value="${team.id}">${team.name}</option>`
                )
                .join("")}
            </select>
            
            `);
          }

          // Agregar los campos adicionales al contenedor
          dynamicFieldsContainer.innerHTML = additionalFields.join("");
        });
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}register_user.php`,
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
            "El usuario se ha registrado correctamente.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al registrar el usuario.",
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

  const viewProspects = async (user) => {
    setModalProspectsOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_prospects.php?id=${user.id}`,
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModalProspects = () => {
    setModalProspectsOpen(false);
  };

  const closeModalProspectDetail = () => {
    setModalProspectDetail(false);
  };

  const modalRef = useRef();

  const modalProspectRef = useRef();

  const modalProspectDetailRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalProspectRef.current &&
        !modalProspectRef.current.contains(event.target)
      ) {
        // Cerrar el modal si se hace clic fuera de él
        closeModalProspects();
      }
    };

    // Añadir el evento de escucha al hacer clic fuera del modal
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpiar el evento de escucha al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalProspectRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalProspectDetailRef.current &&
        !modalProspectDetailRef.current.contains(event.target)
      ) {
        // Cerrar el modal si se hace clic fuera de él
        closeModalProspectDetail();
      }
    };

    // Añadir el evento de escucha al hacer clic fuera del modal
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpiar el evento de escucha al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalProspectDetailRef]);

  const editProspect = async (prospecto) => {
    setModalProspectDetail(true);

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
        setProspectoDetail(prospectDetails);
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

  const abrirCalendly = () => {
    window.open(
      "https://calendly.com/vibradigital/reunion-nahuel-veliz",
      "_blank"
    );
    return false;
  };

  const prospectCash = async (prospecto) => {
    const { value: formValues } = await Swal.fire({
      title: "Prospecto: ",
      html:
        `<label for="attendedMeeting">¿Se conectó a la reunión?</label>` +
        `<select id="attendedMeeting" class="swal2-input">
           <option value="Si">Sí</option>
           <option value="No">No</option>
         </select>` +
        '<input id="note" class="swal2-input" placeholder="Nota">' +
        '<input id="finalBudget" type="number" class="swal2-input" placeholder="Presupuesto estimado">' +
        '<input id="commission" type="number" class="swal2-input" placeholder="Comisión estimada">',
      focusConfirm: false,
      confirmButtonText: "Guardar",
      preConfirm: () => {
        const attendedMeeting =
          document.getElementById("attendedMeeting").value;
        const note = document.getElementById("note").value;
        const finalBudget = document.getElementById("finalBudget").value;
        const commission = document.getElementById("commission").value;

        // Validación de campos vacíos
        if (!attendedMeeting || !note || !finalBudget || !commission) {
          Swal.showValidationMessage("Por favor, complete todos los campos");
          return;
        }

        return {
          attendedMeeting,
          note,
          finalBudget,
          commission,
          prospectId: prospecto.id,
          id_setter: prospecto.id_setter,
          id_team: prospecto.team,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}prospect_cash.php`,
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
            "Los datos del prospecto se registraron correctamente.",
            "success"
          );
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al registrar los datos del prospecto.",
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

  const updateProspectInfo = async () => {};

  return (
    <div className="list_users">
      <div className="title">
        <div className="text">
          <h2>Usuarios registrados</h2>
          <p>Lista de los usuarios registrados</p>
        </div>

        <div className="button">
          <button onClick={addUser}>Añadir</button>
        </div>
      </div>

      <div className="tabla_usuarios">
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Rol</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td data-label="Nº">{user.id}</td>
                <td data-label="Nombre">{user.name}</td>
                <td data-label="Correo">
                  <span>{user.email}</span>
                </td>
                <td data-label="Rol" className={user.response}>
                  <span>{user.role}</span>
                </td>
                <td data-label="">
                  <button onClick={() => editUser(user)}>
                    <EditIcon />
                  </button>
                </td>
                <td data-label="">
                  <button onClick={() => viewProspects(user)}>
                    <VisibilityOutlinedIcon />
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
            <h3>Prospectos registrados por </h3>

            <div className="content-modal">
              <div className="tabla_usuarios">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Nº</th>
                      <th scope="col">Prospecto</th>
                      <th scope="col">¿Respondió?</th>
                      <th scope="col">¿Agendó?</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td data-label="Nº">{user.id}</td>
                        <td data-label="Nombre">{user.name}</td>
                        <td data-label="Correo">
                          <span>{user.email}</span>
                        </td>
                        <td data-label="Rol" className={user.response}>
                          <span>{user.role}</span>
                        </td>
                        <td data-label="">
                          <button onClick={() => editUser(user)}>
                            <EditIcon />
                          </button>
                        </td>
                        <td data-label="">
                          <button onClick={() => viewProspects(user)}>
                            <VisibilityOutlinedIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {ModalProspectsOpen && (
        <div className="modal-overlay">
          <div className="modal prospectos" ref={modalProspectRef}>
            <button className="close-modal" onClick={closeModalProspects}>
              <CloseIcon />
            </button>
            <h3>Prospectos - </h3>

            <div className="content-modal">
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
                    {ListProspects.map((prospecto, index) => (
                      <tr key={index}>
                        <td data-label="Nº">{prospecto.id}</td>
                        <td data-label="Prospecto">
                          {prospecto.name} {prospecto.last_name}
                        </td>
                        <td
                          data-label="¿Respondió?"
                          className={prospecto.response}
                        >
                          <span>{prospecto.response}</span>
                        </td>
                        <td
                          data-label="¿Agendó?"
                          className={prospecto.schedule}
                        >
                          <span>{prospecto.schedule}</span>
                        </td>
                        <td data-label="">
                          <button onClick={() => editProspect(prospecto)}>
                            <EditIcon />
                          </button>
                        </td>
                        <td data-label="">
                          <button onClick={() => prospectCash(prospecto)}>
                            <GridViewOutlinedIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {ModalProspectDetail && (
        <div className="modal-overlay">
          <div className="modal" ref={modalProspectDetailRef}>
            <button className="close-modal" onClick={closeModalProspectDetail}>
              <CloseIcon />
            </button>
            <h3>
              Prospecto -{" "}
              {prospectoDetail.name + " " + prospectoDetail.last_name}
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

export default List_users;
