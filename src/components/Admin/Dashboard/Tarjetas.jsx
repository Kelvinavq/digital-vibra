import GroupIcon from "@mui/icons-material/Group";
import React, { useState, useEffect } from "react";
import Config from "../../../config/Config"

const Tarjetas = () => {
  const [totalSetters, setTotalSetters] = useState(0);
  const [settersActivos, setSettersActivos] = useState(0);
  const [totalProspectos, setTotalProspectos] = useState(0);
  const [prospectosActivos, setProspectosActivos] = useState(0);
  const [totalEquipos, setTotalEquipos] = useState(0);
  const [equiposActivos, setEquiposActivos] = useState(0);
  const [totalProyectosAprobados, setTotalProyectosAprobados] = useState(0);
  const [totalProyectosPendientes, setTotalProyectosPendientes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };
  
        // Consulta para obtener los datos de Setters
        const responseSetters = await fetch(
          `${Config.backendBaseUrlAdmin}get_setters_info.php`,
          requestOptions
        );
        if (responseSetters.ok) {
          const data = await responseSetters.json();
          setTotalSetters(data.total_setters);
          setSettersActivos(data.activos);
        }
  
        // Consulta para obtener los datos de Prospectos
        const responseProspectos = await fetch(
          `${Config.backendBaseUrlAdmin}get_prospectos_info.php`,
          requestOptions
        );
        if (responseProspectos.ok) {
          const data = await responseProspectos.json();
          setTotalProspectos(data.total_prospectos);
          setProspectosActivos(data.activos);
        }
  
        // Consulta para obtener los datos de Equipos
        const responseEquipos = await fetch(
          `${Config.backendBaseUrlAdmin}get_equipos_info.php`,
          requestOptions
        );
        if (responseEquipos.ok) {
          const data = await responseEquipos.json();
          setTotalEquipos(data.total_equipos);
          setEquiposActivos(data.activos);
        }
  
        // Consulta para obtener los datos de Proyectos Aprobados
        const responseProyectosAprobados = await fetch(
          `${Config.backendBaseUrlAdmin}get_proyectos_aprobados_info.php`,
          requestOptions
        );
        if (responseProyectosAprobados.ok) {
          const data = await responseProyectosAprobados.json();
          setTotalProyectosAprobados(data.total_proyectos_aprobados);
        }
  
        // Consulta para obtener los datos de Proyectos Pendientes
        const responseProyectosPendientes = await fetch(
          `${Config.backendBaseUrlAdmin}get_proyectos_pendientes_info.php`,
          requestOptions
        );
        if (responseProyectosPendientes.ok) {
          const data = await responseProyectosPendientes.json();
          setTotalProyectosPendientes(data.total_proyectos_pendientes);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    fetchData();
  }, []);
  


  return (
    <>
      <div className="tarjetas">
        <div className="tarjeta">
          <div className="tarjeta_inner">
            <div className="icono">
              <GroupIcon />
            </div>

            <div className="content">
              <p>Setters registrados</p>
              <span>{totalSetters}</span>
              <small>
                Activos: <strong>{settersActivos}</strong>
              </small>
            </div>
          </div>
        </div>
        <div className="tarjeta">
          <div className="tarjeta_inner">
            <div className="icono">
              <GroupIcon />
            </div>

            <div className="content">
              <p>Prospectos registrados</p>
              <span>{totalProspectos}</span>
              <small>
                Posibles clientes: <strong>{prospectosActivos}</strong>
              </small>
            </div>
          </div>
        </div>
        <div className="tarjeta">
          <div className="tarjeta_inner">
            <div className="icono">
              <GroupIcon />
            </div>

            <div className="content">
              <p>Equipos registrados</p>
              <span>{totalEquipos}</span>
              <small>
                Activos: <strong>{equiposActivos}</strong>
              </small>
            </div>
          </div>
        </div>
        <div className="tarjeta">
          <div className="tarjeta_inner">
            <div className="icono">
              <GroupIcon />
            </div>

            <div className="content">
              <p>Proyectos</p>
              <span>{totalProyectosAprobados}</span>
              <small>
                Pendientes: <strong>{totalProyectosPendientes}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tarjetas;
