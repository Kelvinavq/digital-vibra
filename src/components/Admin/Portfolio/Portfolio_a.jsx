import { useState, useEffect, useRef } from "react";
import "./Portfolio.css";
import Config from "../../../config/Config";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";

const Portfolio_a = () => {
  const [listaPortafolio, setListaPortafolio] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [imagePortrait, setImagePortrait] = useState("");
  const [imageLandscape, setImageLandscape] = useState("");
  const [status, setStatus] = useState(false);
  const [projectDetails, setProjectDetails] = useState("");
  const [statusDetail, setStatusDetail] = useState("");

  const addProject = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir proyecto",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre del proyecto">
        <input id="swal-input2" class="swal2-input" placeholder="Descripción">
        <input id="swal-input3" class="swal2-input" placeholder="Enlace del proyecto">
        <label for="" class="swal2-input-label">Imágen vertical</label>
        <input id="swal-input-portrait" type="file" accept="image/*" class="swal2-file">
        <label for="" class="swal2-input-label">Imágen horizontal</label>
        <input id="swal-input-landscape" type="file" accept="image/*" class="swal2-file">
      `,
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        const name =
          Swal.getHtmlContainer().querySelector("#swal-input1").value;
        const description =
          Swal.getHtmlContainer().querySelector("#swal-input2").value;
        const link =
          Swal.getHtmlContainer().querySelector("#swal-input3").value;
        const imagePortrait = Swal.getHtmlContainer().querySelector(
          "#swal-input-portrait"
        ).files[0];
        const imageLandscape = Swal.getHtmlContainer().querySelector(
          "#swal-input-landscape"
        ).files[0];

        if (
          !name ||
          !description ||
          !link ||
          !imagePortrait ||
          !imageLandscape
        ) {
          Swal.showValidationMessage("Por favor, complete todos los campos.");
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("link", link);
        formData.append("image_portrait", imagePortrait);
        formData.append("image_landscape", imageLandscape);

        return formData;
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}register_project.php`,
          {
            method: "POST",
            body: formValues,
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "¡Registro exitoso!",
            text: "El proyecto se ha registrado correctamente.",
            icon: "success",
            didClose: () => {
              window.location.reload();
            },
          });
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al registrar el proyecto.",
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

  useEffect(() => {
    fetch(`${Config.backendBaseUrlAdmin}get_projects.php`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener los testimonios");
        }
      })
      .then((data) => {
        setListaPortafolio(data.proyectos);
      })
      .catch((error) => {
        console.error("Error al obtener testimonios:", error);
        Swal.fire({
          title: "Error",
          text: "Se produjo un error al obtener los testimonios. Por favor, inténtelo de nuevo.",
          icon: "error",
        });
      });
  }, []);

  const editProject = async (proyecto) => {
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_project_details.php?id=${proyecto.id}`,
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
        setProjectDetails(projectDetails);
        setName(projectDetails.name || "");
        setLink(projectDetails.link || "");
        setDescription(projectDetails.description || "");
        setImageLandscape(projectDetails.image_landscape || "");
        setImagePortrait(projectDetails.image_portrait || "");
        setStatus(projectDetails.status === "active");
        setStatusDetail(projectDetails.status || "");

      }
    } catch (error) {
      console.error(
        "Error al manejar la solicitud de detalles del proyecto:",
        error
      );
      Swal.fire({
        title: "Error",
        text: "Error inesperado al manejar la solicitud de detalles del proyecto",
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

  const updatePortfolioInfo = async () => {
    // Verificar que los campos no estén vacíos
    if (!name.trim() || !link.trim() || !description.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos.",
        icon: "error",
      });
      return;
    }
  
    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}update_project_info.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: projectDetails.id,
            name,
            link,
            description,
            status: status ? "active" : "inactive",
          }),
        }
      );
  
      if (response.ok) {
        Swal.fire({
          title: "¡Información actualizada!",
          text: "Los datos del proyecto han sido actualizados correctamente.",
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
          "Hubo un problema al actualizar la información del proyecto.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Error al actualizar la información del proyecto:",
        error
      );
      Swal.fire(
        "Error",
        "Hubo un problema al conectar con el servidor.",
        "error"
      );
    }
  };

  
  return (
    <div className="details portfolio">
      <div className="recentOrders">
        <div className="cardHeader">
          <h2>Proyectos recientes</h2>
          <button onClick={addProject}>Añadir</button>
        </div>

        {listaPortafolio.length > 0 ? (
          <div className="tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Link</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Imagen vertical</th>
                  <th scope="col">Imagen horizontal</th>
                </tr>
              </thead>
              <tbody>
                {listaPortafolio.map((proyecto, index) => (
                  <tr
                    key={index}
                    className="li-portfolio"
                    onClick={() => editProject(proyecto)}
                  >
                    <td data-label="Nombre">{proyecto.name}</td>
                    <td data-label="Link">{proyecto.link}</td>
                    <td data-label="Descripción">{proyecto.description}</td>
                    <td data-label="Imagen vertical">
                      <img
                        src={`${Config.imgPortfolio}${proyecto.image_portrait}`}
                        alt=""
                      />
                    </td>
                    <td data-label="Imagen horizontal">
                      <img
                        src={`${Config.imgPortfolio}${proyecto.image_landscape}`}
                        alt=""
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aún no hay proyectos</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <button className="close-modal" onClick={closeModal}>
              <CloseIcon />
            </button>
            <h3>Testimonio - {name}</h3>

            <div className="content-modal">
              <div className="input">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  className="swal2-input"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="link">Enlace del proyecto</label>
                <input
                  id="link"
                  className="swal2-input"
                  placeholder="Enlace"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div className="input">
                <label htmlFor="description">Descripción del proyecto</label>
                <input
                  id="description"
                  className="swal2-input"
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="input">
                <label htmlFor="">Imagen vertical</label>
                <img src={Config.imgPortfolio + imagePortrait}  alt="" />
              </div>
              <div className="input">
                <label htmlFor="">Imagen horizontal</label>
                <img src={Config.imgPortfolio + imageLandscape}  alt="" />
              </div>

              <div className="input ">
                <p>Estatus - {statusDetail}</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={() => setStatus(!status)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <button className="update" onClick={updatePortfolioInfo}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio_a;
