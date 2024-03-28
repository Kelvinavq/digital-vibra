import { useState, useEffect } from "react";


import Sidebar_u from "../../components/User/Sidebar_user/Sidebar_u";
import Card_bienvenida from "../../components/User/Dashboard_user/Card_bienvenida";
import Items_list from "../../components/User/Dashboard_user/Items_list";
import Prospectos_list from "../../components/User/Dashboard_user/Prospectos_list";
import Ranking from "../../components/User/Dashboard_user/Ranking";
import Estadisticas from "../../components/User/Dashboard_user/Estadisticas";

import Swal from "sweetalert2";
import Config from "../../config/Config";


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = localStorage.getItem("user_role");
  const [showAlert, setShowAlert] = useState(false);


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
          if (userRole !== "setter") {
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
    <div className={`container_user dashboard_user ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar_u isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main>
        <div className="left">
          <div className="container_bienvenida">
            <Card_bienvenida />
            <Items_list />
          </div>
          <Prospectos_list />
        </div>

        <div className="right">
          <Ranking />
          <Estadisticas />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
