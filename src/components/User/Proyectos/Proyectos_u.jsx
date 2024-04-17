import "./Proyecto.css"
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

const Proyectos_u = () => {
  const [proyectos, setProyectos] = useState([]);
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("prospecto");
  const [nombreSetter, setNombreSetter] = useState("");

  useEffect(() => {
    const fetchProspectos = async () => {
      try {
        let url = `${Config.backendBaseUrlUser}get_projects.php`;
        if (userId) {
          url += `?prospecto=${userId}`;
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
          const proyectos = await responseProspectos.json();
          setProyectos(proyectos);
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

  return (
    <div className="proyectos">
      <div className="title">
        <h2>Proyectos registrados</h2>
      </div>

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Proyecto</th>
              <th scope="col">Presupuesto</th>
              <th scope="col">Comisión</th>
              <th scope="col">Estatus</th>
            </tr>
          </thead>

          <tbody>
            {proyectos.map((proyecto, index) => (
              <tr key={index}>
                <td data-label="Nº">{proyecto.id}</td>
                <td data-label="proyecto">{proyecto.project_name}</td>
                <td data-label="Presupuesto">
                  <span>$ {proyecto.budget}</span>
                </td>
                <td data-label="Comisión">
                  <span>$ {proyecto.commission}</span>
                </td>
                <td data-label="Estatus" className={proyecto.status}>
                  <span>{proyecto.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Proyectos_u;
