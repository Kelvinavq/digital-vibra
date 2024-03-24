import { useState } from "react";
import Sidebar_a from "../../components/Admin/Sidebar/Sidebar_a";
import Testimonial_a from "../../components/Admin/Testimonials/Testimonial_a";

const Testimonials = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className={`container_admin ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar_a isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main>
        <Testimonial_a />
      </main>
    </div>
  );
};

export default Testimonials;
