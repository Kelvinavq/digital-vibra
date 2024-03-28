import "./Sidebar_a.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/Simple-claro.png";
import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BadgeIcon from '@mui/icons-material/Badge';

const menuItems = [
  {
    name: "Dashboard",
    icon: <HomeIcon />,
  },
  {
    name: "Testimonios",
    icon: <ForumIcon />,
    // items: ["Display", "Editor", "Theme", "Interface"],
  },
  {
    name: "Portafolio",
    icon: <BusinessCenterIcon />,
  },
  {
    name: "Usuarios",
    icon: <BadgeIcon />,
  },
  {
    name: "Prospectos",
    icon: <BadgeIcon />,
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

const NavButton = ({ onClick, name, icon, isActive, hasSubNav, path }) => (
  <Link to={path}>
    <button
      type="button"
      onClick={() => onClick(name)}
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

const Sidebar_a = ({ isSidebarOpen, toggleSidebar }) => {
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
                path={`/admin/${item.name.toLowerCase()}`}
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
                  path={`/admin/${item.name.toLowerCase()}`}
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
  );
};

export default Sidebar_a;
