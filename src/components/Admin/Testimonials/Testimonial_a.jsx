import { useState, useEffect, useRef } from "react";
import "./Testimonial.css";
import Swal from "sweetalert2";
import Config from "../../../config/Config";
import CloseIcon from "@mui/icons-material/Close";

const Testimonial_a = () => {
  const [testimonios, setTestimonios] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimoniosDetails, setTestimoniosDetails] = useState("");

  const [name, setName] = useState("");
  const [testimonio, setTestimonio] = useState("");
  const [status, setStatus] = useState(false);
  const [statusDetail, setStatusDetail] = useState("");
  const [image, setImage] = useState("");

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

  useEffect(() => {
    fetch(`${Config.backendBaseUrlAdmin}get_testimonials.php`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener los testimonios");
        }
      })
      .then((data) => {
        setTestimonios(data.testimonios);
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

  const editTestimonial = async (testimonio) => {
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}get_testimonial_detail.php?id=${testimonio.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const testimonioDetails = await response.json();

      if (!response.ok) {
        console.error("Error al obtener detalles del testimonio");
        Swal.fire({
          title: "Error al obtener detalles del testimonio",
          text: "Hubo un error al obtener los detalles del testimonio",
          icon: "error",
        });
        return;
      } else {
        setTestimoniosDetails(testimonioDetails);
        setName(testimonioDetails.name || "");
        setTestimonio(testimonioDetails.testimonial || "");
        setStatusDetail(testimonioDetails.status || "");
        setImage(testimonioDetails.image || "");
        setStatus(testimonioDetails.status === "active");
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

  const updateTestimonialInfo = async () => {

      // Verificar que los campos no estén vacíos
  if (!name.trim() || !testimonio.trim()) {
    Swal.fire({
      title: "Error",
      text: "Por favor, complete todos los campos.",
      icon: "error",
    });
    return;
  }

    try {
      const response = await fetch(
        `${Config.backendBaseUrlAdmin}update_testimonial_info.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: testimoniosDetails.id,
            name,
            testimonio,
            status: status ? "active" : "inactive",
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "¡Información actualizada!",
          text: "Los datos del testimonio han sido actualizados correctamente.",
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
          "Hubo un problema al actualizar la información del testimonio.",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Error al actualizar la información del testimonio:",
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
    <div className="details list_testimonial">
      <div className="recentOrders">
        <div className="cardHeader">
          <h2>Testimonios Recientes</h2>
        </div>

        {testimonios.length > 0 ? (
          <div className="tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Testimonio</th>
                  <th scope="col">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map((testimonio) => (
                  <tr
                    key={testimonio.id}
                    className="li-testimonio"
                    data-id={testimonio.id}
                    onClick={() => editTestimonial(testimonio)}
                  >
                    <td data-label="Nombre">{testimonio.name}</td>
                    <td data-label="Testimonio">{testimonio.testimonial}</td>
                    <td data-label="Estatus">
                      <span className={`status ${testimonio.status}`}>
                        {testimonio.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aún no hay testimonios</p>
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
                <label htmlFor="testimonial">Testimonio</label>
                <textarea
                  name="testimonial"
                  id="testimonial"
                  value={testimonio}
                  onChange={(e) => setTestimonio(e.target.value)}
                ></textarea>
              </div>

              {testimonios.image !== "" ? (
                <div className="input">
                  <img src={Config.imgTestimonial + image}  alt="" />
                </div>
              ) : (
                ""
              )}

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
              <button className="update" onClick={updateTestimonialInfo}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial_a;
