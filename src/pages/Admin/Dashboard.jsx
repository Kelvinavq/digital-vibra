import { useState, useEffect } from "react";
import Sidebar_a from "../../components/Admin/Sidebar/Sidebar_a";
import Card_Ingresos from "../../components/Admin/Dashboard/Card_Ingresos";
import Buttons from "../../components/Admin/Dashboard/Buttons";
import Teams from "../../components/Admin/Dashboard/Teams";
import Proyectos from "../../components/Admin/Dashboard/Proyectos";
import Tarjetas from "../../components/Admin/Dashboard/Tarjetas";
import Progreso_Equipos from "../../components/Admin/Dashboard/Progreso_Equipos";
import Prospectos_Obtenidos from "../../components/Admin/Dashboard/Prospectos_Obtenidos";
import Ingresos_Mensuales from "../../components/Admin/Dashboard/Ingresos_Mensuales";

import Swal from "sweetalert2";
import Config from "../../config/Config";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = localStorage.getItem("user_role");
  const [showAlert, setShowAlert] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrl}check-session.php`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        );

        const responseData = await response.json();

        if (response.ok) {
          setIsLoggedIn(true);

          // Verificar el rol del usuario después de la autenticación
          if (userRole !== "admin") {
            setShowAlert(true);
            // Si el rol no es user, redirigir al usuario al inicio de sesión
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Acceso no permitido para el rol actual.",
              timer: 3000,
              didClose: () => {
                window.history.back();
              },
            });
          }
        } else {
          setShowAlert(true);
          // Si la sesión no es válida, redirige al usuario al inicio de sesión
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes iniciar sesión para acceder a esta página.",
            timer: 3000,
            didClose: () => {
              window.location.href = "/login";
            },
          });
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    // Llamar a la función para verificar la sesión
    checkAuthStatus();
  }, []);

  // Si el usuario no ha iniciado sesión o no tiene el rol adecuado, no renderizar el componente
  if (!isLoggedIn || showAlert) {
    return null;
  }

  return (
    <div
      className={`container_admin dashboard_admin ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <Sidebar_a isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main>
        <div className="left">
          <Card_Ingresos />
          <Buttons />
          <Teams />
          <Proyectos />
        </div>
        <div className="right">
          <Tarjetas />

          <div className="graficos_dobles">
            <Progreso_Equipos />
            <Prospectos_Obtenidos />
          </div>

          <Ingresos_Mensuales />

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
