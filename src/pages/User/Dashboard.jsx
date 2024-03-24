import { useState } from "react";

import Sidebar_u from "../../components/User/Sidebar_user/Sidebar_u";
import Card_bienvenida from "../../components/User/Dashboard_user/Card_bienvenida";
import Items_list from "../../components/User/Dashboard_user/Items_list";
import Prospectos_list from "../../components/User/Dashboard_user/Prospectos_list";
import Ranking from "../../components/User/Dashboard_user/Ranking";
import Estadisticas from "../../components/User/Dashboard_user/Estadisticas";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
