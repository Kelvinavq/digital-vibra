import { useState } from "react";
import Sidebar_u from "../../components/User/Sidebar_user/Sidebar_u";
import Prospectos_u from "../../components/User/Prospectos/Prospectos_u";

const Prospectos_user = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    
  return (
    <div className={`container_user prospectos_user ${isSidebarOpen ? "sidebar-open" : ""}`}>
    <Sidebar_u isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <main>
     <Prospectos_u/>
    </main>
  </div>
  )
}

export default Prospectos_user
