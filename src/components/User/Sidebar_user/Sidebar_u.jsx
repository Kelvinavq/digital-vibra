import "./Sidebar_u.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/Simple-claro.png";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Config from "../../../config/Config"

const menuItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon />,
    },
    {
      name: "Prospectos",
      icon: <GroupIcon />,
      // items: ["Display", "Editor", "Theme", "Interface"],
    },
    {
      name: "Ajustes",
      icon: <SettingsIcon />,
    },
    {
      name: "Cerrar Sesión",
      icon: <LogoutIcon />,
    },
  ];
  
  const Icon = ({ icon }) => icon;
  
  const NavHeader = () => (
    <header className="sidebar-header">
      <img src={logo} alt="" />
      <span>Admin</span>
    </header>
  );

  const handleLogout = async () => {
    try {
      const response = await fetch(`${Config.backendBaseUrl}logout.php`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
  
      if (response.ok) {
        // Elimina la información de la sesión del almacenamiento local
        sessionStorage.removeItem('user_role');
        sessionStorage.removeItem('user_id');
  
        // Redirige al usuario a la página de inicio de sesión
        window.location.href = '/login';
      } else {
        // Maneja errores si es necesario
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  const NavButton = ({ onClick, name, icon, isActive, hasSubNav, path }) => (
    <Link to={path}>
       <button
      type="button"
      onClick={name === "Cerrar Sesión" ? handleLogout : () => onClick(name)}
      className={isActive ? "active" : ""}
    >
        {icon && <Icon icon={icon} />}
        <span>{name}</span>
        {hasSubNav && (
          <KeyboardArrowDownIcon
            style={{
              transform: isActive ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        )}
      </button>
    </Link>
  );
  
  const SubMenu = ({ item, activeItem, handleClick }) => {
    const navRef = useRef(null);
  
    const isSubNavOpen = (item, items) =>
      items.some((i) => i === activeItem) || item === activeItem;
  
    return (
      <div
        className={`sub-nav ${isSubNavOpen(item.name, item.items) ? "open" : ""}`}
        style={{
          height: !isSubNavOpen(item.name, item.items)
            ? 0
            : navRef.current?.clientHeight,
        }}
      >
        <div ref={navRef} className="sub-nav-inner">
          {item?.items.map((subItem) => (
            <NavButton
              onClick={handleClick}
              name={subItem}
              isActive={activeItem === subItem}
            />
          ))}
        </div>
      </div>
    );
  };



  

const Sidebar_u = ({ isSidebarOpen, toggleSidebar }) => {

    const [activeItem, setActiveItem] = useState("");

    const handleClick = (item) => {
      console.log("activeItem", activeItem);
      setActiveItem(item !== activeItem ? item : "");
    };

  return (
   <>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={toggleSidebar} className="floatBtn">
          <MenuIcon />
        </button>

        <NavHeader />

        {menuItems.map((item, index) => (
          <div key={index}>
            {!item.items && (
              <NavButton
                onClick={handleClick}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                hasSubNav={!!item.items}
                path={`/user/${item.name.toLowerCase()}`}
              />
            )}
            {item.items && (
              <>
                <NavButton
                  onClick={handleClick}
                  name={item.name}
                  icon={item.icon}
                  isActive={activeItem === item.name}
                  hasSubNav={!!item.items}
                  path={`/user/${item.name.toLowerCase()}`}
                />
                <SubMenu
                  activeItem={activeItem}
                  handleClick={handleClick}
                  item={item}
                />
              </>
            )}
          </div>
        ))}
      </aside>
    </>
  )
}

export default Sidebar_u
