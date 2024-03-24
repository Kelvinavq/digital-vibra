import { useState } from "react";
import Sidebar_a from "../../components/Admin/Sidebar/Sidebar_a";
import Portfolio_a from "../../components/Admin/Portfolio/Portfolio_a";

const Portfolios = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    <div className={`container_admin ${isSidebarOpen ? "sidebar-open" : ""}`}>
    <Sidebar_a isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <main>
      <Portfolio_a />
    </main>
  </div>
  )
}

export default Portfolios
