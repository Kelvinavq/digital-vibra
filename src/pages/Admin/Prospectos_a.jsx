import { useState, useEffect } from "react";
import Sidebar_a from "../../components/Admin/Sidebar/Sidebar_a";
import List_prospectos_a from "../../components/Admin/Prospectos_a/List_prospectos_a";
import Swal from "sweetalert2";
import Config from "../../config/Config";

const Prospectos_a = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container_admin ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar_a isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main>
        <List_prospectos_a />
      </main>
    </div>
  );
};

export default Prospectos_a;
