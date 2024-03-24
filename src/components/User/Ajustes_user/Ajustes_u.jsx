import { useState, useEffect } from "react";
import "./Ajustes_u.css";
import Swal from "sweetalert2";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Config from "../../../config/Config";

const Ajustes_u = () => {
  const [userData, setUserData] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_user_detail.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Error al obtener la informacion del usuario");
          Swal.fire({
            title: "Error al obtener la informacion del usuario",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener la informacion del usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener la informacion del usuario",
        });
      }
    };

    getUserDetail();
  }, []);

  const CopiarAlPortapapeles = ({ texto }) => {
    const [copiado, setCopiado] = useState(false);

    const copiarAlPortapapeles = (e) => {
      e.preventDefault();

      navigator.clipboard.writeText(texto);
      setCopiado(true);

      // Mostrar el toast de éxito
      Swal.fire({
        icon: "success",
        title: "Matricula copiada al portapapeles",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      setTimeout(() => {
        setCopiado(false);
      }, 3000);
    };

    return (
      <button onClick={copiarAlPortapapeles}>
        {copiado ? (
          <span>
            <ContentCopyIcon />
          </span>
        ) : (
          <ContentCopyIcon />
        )}
      </button>
    );
  };

  const copiarMatriculaAlPortapapeles = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(userData.matricula);
    Swal.fire({
      icon: "success",
      title: "Matrícula copiada al portapapeles",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };
  const copiarLinkAlPortapapeles = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(userData.cuenta_link);
    Swal.fire({
      icon: "success",
      title: "Link copiada al portapapeles",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Validar la extensión del archivo
    const allowedExtensions = /\.(png|jpg|jpeg)$/i;
    if (!allowedExtensions.test(file.name)) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Por favor, seleccione un archivo de imágen válido (png, jpg, jpeg).",
      });
      return;
    }

    setNewProfilePicture(file);

    // Mostrar la ventana de Swal al seleccionar una imagen
    Swal.fire({
      title: "¿Estás seguro de actualizar tu foto de perfil?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Crear un objeto FormData y agregar la nueva imagen
        const formData = new FormData();
        formData.append("profile_picture", file);

        // Enviar la nueva imagen al servidor
        fetch(`${Config.backendBaseUrlUser}update_profile_picture.php`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // Actualizar la información del usuario en el estado
            setUserData((prevData) => ({
              ...prevData,
              profile_picture: data.newProfilePictureName,
            }));

            // Restablecer el estado de la nueva imagen
            setNewProfilePicture(null);

            Swal.fire("¡Foto de perfil actualizada!", "", "success");
            window.location.reload();
          })
          .catch((error) =>
            console.error("Error al actualizar la foto de perfil", error)
          );
      } else {
        // Restablecer el estado si el usuario cancela la actualización
        setNewProfilePicture(null);
      }
    });
  };

  return (
    <div className="ajustes">
      <div className="title">
        <h2>Ajustes</h2>
        <p>Ajustes de la cuenta Setter</p>
      </div>

      <div className="tarjeta_ajustes">
        <div className="title">
          <h4>Detalles del perfil</h4>
        </div>

        <div className="top_ajustes">
          <div className="perfil">
            <div className="foto">
              <img
                src={Config.imgProfileUser + userData.profile_picture}
                alt=""
              />
            </div>

            <div className="button">
              <input
                type="file"
                name="profile_picture"
                id="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file">Subir nueva foto</label>
              <p>Se recomienda 500 x 500</p>
            </div>
          </div>
        </div>

        <div className="info">
          <div className="nombreÑ">
            <h4>{userData.name}</h4>
            <p>{userData.email}</p>
          </div>

          <div className="matricula">
            <h4>Matrícula</h4>
            <div className="numero">
              <h2>{userData.matricula}</h2>
              <CopiarAlPortapapeles texto={userData.matricula} />
            </div>
          </div>
        </div>
      </div>

      <div className="compartir">
        <div className="content">
          <h2>Compartir perfil</h2>
          <p>
            Comparte este perfil para generar confianza con los prospectos,
            puedes compartirle tu link personal o el número de matricula para
            que el prospecto pueda corroborar que eres un SETTER de VIBRA
            DIGITAL
          </p>
          <div className="buttons">
            <button onClick={copiarLinkAlPortapapeles}>Copiar link</button>
            <button onClick={copiarMatriculaAlPortapapeles}>Copiar matricula</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ajustes_u;
