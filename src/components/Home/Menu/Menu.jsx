import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/Simple.png";
import "./Menu.css";

const Menu = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  useEffect(() => {
    const handleHashChange = () => {
      closeMenu();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section>
      <div className="circle uno"></div>
      <nav className={menuActive ? "active" : ""}>
        <div className="logo">
          <a href="/">
            <img width="100" src={logo} alt="logo vibra digital" />
          </a>
        </div>

        <ul>
          <li className="active menu-inicio" onClick={closeMenu}>
            <a href="#inicio">Inicio</a>
          </li>
          <li className="menu-ventajas" onClick={closeMenu}>
            <a href="#ventajas">Ventajas</a>
          </li>
          <li className="menu-procesos" onClick={closeMenu}>
            <a href="#procesos">Proceso</a>
          </li>
          <li className="menu-testimonios" onClick={closeMenu}>
            <a href="#testimonios">Testimonios</a>
          </li>
          <li className="menu-portafolio" onClick={closeMenu}>
            <a href="#portafolio">Portafolio</a>
          </li>

          <button className="cerrar" onClick={closeMenu}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          <button
            className="cotizacion"
            onClick={() => (window.location = "#contacto")}
          >
            <i className="fa-sharp fa-solid fa-phone fa-shake"></i>
            Cotización
          </button>
        </ul>

        <button className="btn" onClick={() => (window.location = "#contacto")}>
          <i className="fa-sharp fa-solid fa-phone fa-shake"></i>
          Cotización
        </button>

        <button className="btn-menu" onClick={toggleMenu}>
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
      </nav>
    </section>
  );
};

export default Menu;
