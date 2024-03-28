import { useState } from "react";
import Sidebar_a from "../../components/Admin/Sidebar/Sidebar_a";
import List_setters from "../../components/Admin/Usuarios/List_users";

const Setters = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container_admin ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar_a isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main>
      <List_setters/>
      </main>
    </div>
  );
};

export default Setters;
