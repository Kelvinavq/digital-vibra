import { useEffect, useState, useRef } from "react";
import "./Tabla_Usuarios.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import Swal from "sweetalert2";
import Config from "../../../config/Config";

const Tabla_Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [team_list, setTeam_list] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [address, setAddress] = useState("");
  const [profile_picture, setProfile_picture] = useState("");
  const [registration_date, setRegistration_date] = useState("");
  const [registration_time, setRegistration_time] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [teamId, setTeamId] = useState("");
  const [status, setStatus] = useState(false);
  const [usersDetails, setusersDetails] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const url = new URL(
          `${Config.backendBaseUrlAdmin}get_appointments_setters.php`
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
            setUsuarios(data);
          } else {
            // Manejar el caso en que no hay usuarios
            Swal.fire({
              icon: "info",
              title: "Sin usuarios registrados",
              text: "No hay usuarios registrados en este momento.",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    obtenerUsuarios();

    const obtenerEquipos = async () => {
      try {
        const url = new URL(`${Config.backendBaseUrlAdmin}get_teams.php`);

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
            setTeam_list(data);
          } else {
            // Manejar el caso en que no hay equipos
            Swal.fire({
              icon: "info",
              title: "Sin equipos registrados",
              text: "No hay equipos registrados en este momento.",
            });
          }
        }
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };

    obtenerEquipos();
  }, []);

  const editUser = async (usuario) => {
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_user_details.php?id=${usuario.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const userDetail = await response.json();

      if (!response.ok) {
        console.error("Error al obtener detalles del usuario");
        Swal.fire({
          title: "Error al obtener detalles del usuario",
          text: "Hubo un error al obtener los detalles del usuario",
          icon: "error",
        });
        return;
      } else {
        setusersDetails(userDetail);
        setName(userDetail.name || "");
        setEmail(userDetail.email || "");
        setPhone_number(userDetail.phone_number || "");
        setAddress(userDetail.address || "");
        setProfile_picture(userDetail.profile_picture || "");
        setRegistration_date(userDetail.registration_date || "");
        setRegistration_time(userDetail.registration_time || "");
        setRole(userDetail.role || "");
        setTeamId(userDetail.team || "");
        setTeam(userDetail.team_name || "");
        setStatus(userDetail.status === "active");
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

  const updateUserInfo = async () => {
    // Validación de campos de entrada
    if (
      !name.trim() ||
      !email.trim() ||
      !phone_number.trim() ||
      !address.trim()
    ) {
      Swal.fire({
        title: "Error",
        text: "Por favor completa todos los campos.",
        icon: "error",
      });
      return;
    }

    if (
      password.trim().length > 0 &&
      (password.trim().length < 8 || password.trim().length > 16)
    ) {
      Swal.fire({
        title: "Error",
        text: "La contraseña debe tener entre 8 y 16 caracteres.",
        icon: "error",
      });
      return;
    }

    // Construir el objeto de datos a enviar al backend
    const userData = {
      id: usersDetails.id,
      name,
      email,
      phone_number,
      address,
      profile_picture,
      role,
      team: teamId,
      status,
      password,
    };

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}update_user_info.php`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        // La información se actualizó correctamente
        Swal.fire({
          title: "Éxito",
          text: "Información de usuario actualizada correctamente.",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
        closeModal(); // Cerrar el modal después de actualizar la información
      } else {
        // Error al actualizar la información
        Swal.fire({
          title: "Error",
          text: "Hubo un error al actualizar la información del usuario.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar la información del usuario:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al actualizar la información del usuario. Por favor, inténtalo de nuevo más tarde.",
        icon: "error",
      });
    }
  };

  const redirectToProspects = (userId) => {
    window.location = `/admin/prospectos?id=${userId}`;
  };

  const redirectToProjects = (userId) => {
    window.location = `/admin/proyectos?setter=${userId}`;
  };

  return (
    <>
      <div className="tabla_usuarios">
        <div className="title">
          <h2>Appointments Setters</h2>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Usuario</th>
                <th scope="col">Prospectos</th>
                <th scope="col">Proyectos</th>
                <th scope="col">Equipo</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={index}>
                  <td data-label="Nº">{usuario.id}</td>
                  <td data-label="Nombre">{usuario.name}</td>
                  <td data-label="Prospectos" className="buttons">
                    <button onClick={() => redirectToProspects(usuario.id)}>
                      {usuario.prospect_count}
                      <VisibilityIcon />
                    </button>
                  </td>
                  <td data-label="Proyectos" className="buttons">
                    <button onClick={() => redirectToProjects(usuario.id)}>
                      {usuario.project_count}
                      <VisibilityIcon />
                    </button>
                  </td>
                  <td data-label="Equipo">{usuario.team_name}</td>
                  <td data-label="Editar">
                    <button onClick={() => editUser(usuario)}>
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
                {role} - {name}
              </h3>

              <div className="content-modal">
                <div className="left">
                  <div className="input">
                    <label htmlFor="name">Nombre del usuario</label>
                    <input
                      id="name"
                      className="swal2-input"
                      placeholder="Nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="email">Correo del usuario</label>
                    <input
                      id="email"
                      className="swal2-input"
                      placeholder="Correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="phone">Teléfono del usuario</label>
                    <input
                      id="phone"
                      className="swal2-input"
                      placeholder="Teléfono"
                      value={phone_number}
                      onChange={(e) => setPhone_number(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <label htmlFor="address">Dirección del usuario</label>
                    <input
                      id="address"
                      className="swal2-input"
                      placeholder="Dirección"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <p>
                    <strong>Fecha de registro: </strong> {registration_date}
                  </p>
                  <p>
                    <strong>Hora de registro: </strong> {registration_time}
                  </p>
                </div>

                <div className="right">
                  <div className="inputs">
                    <div className="input ">
                      <p>Estatus del usuario</p>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={status}
                          onChange={() => setStatus(!status)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="input">
                    <label htmlFor="role">Rol del usuario</label>
                    <select
                      name="role"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value={role}>{role}</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="team">Equipo del usuario</label>
                    <select
                      name="team"
                      id="team "
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                    >
                      <option value={teamId}>
                        Pertenece al equipo: {team}
                      </option>

                      {team_list.map((equipo, index) => (
                        <option key={index} value={equipo.id}>
                          Cambiar al equipo: {equipo.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input">
                    <label htmlFor="password">
                      Ingresa una nueva contraseña para el usuario
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="swal2-input"
                      placeholder="Al menos 8 carácteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="input">
                    <button className="update" onClick={updateUserInfo}>
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

export default Tabla_Usuarios;
