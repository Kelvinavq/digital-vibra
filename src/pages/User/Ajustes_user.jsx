import { useState } from "react";
import Sidebar_u from "../../components/User/Sidebar_user/Sidebar_u";
import Ajustes_u from "../../components/User/Ajustes_user/Ajustes_u";

const Ajustes_user = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  
  return (
    <div className={`container_user ajustes_user ${isSidebarOpen ? "sidebar-open" : ""}`}>
    <Sidebar_u isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <main>
        <Ajustes_u/>
    </main>
  </div>
  )
}

export default Ajustes_user
