import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./css/Config.css"
import Home from "./pages/Home/Home";;
import Login from "./pages/Login/Login";
import Testimonial_user from "./pages/Testimonial_user/Testimonial_user";
import Matricula_Setter from "./pages/Matricula_setter/Matricula_Setter";
import Card_Setter from "./pages/Matricula_setter/Card_Setter";
import Publicidad from "./pages/Publicidad/Publicidad";

// admin
import Dashboard from "./pages/Admin/Dashboard";
import Testimonials from "./pages/Admin/Testimonials";
Testimonials
import Portfolios from "./pages/Admin/Portfolios";
import Setters from "./pages/Admin/Usuarios";
import Prospectos_a from "./pages/Admin/Prospectos_a";
import Usuarios_Registrados from "./pages/Admin/Usuarios_Registrados";
import Prospectos_Publicidad from "./pages/Admin/Prospectos_Publicidad";
import Proyectos from "./pages/Admin/Proyectos";
import Equipos from "./pages/Admin/Equipos"
import Pagos from "./pages/Admin/Pagos"
import Historial_Pagos_Proyectos from "./pages/Admin/Historial_Pagos_Proyectos"
 
// user
import Dashboard_u from "./pages/User/Dashboard";
import Prospectos_user from "./pages/User/Prospectos_user";
import Ajustes_user from "./pages/User/Ajustes_user";
import Proyectos_u from "./pages/User/Proyectos";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/enviar-testimonio",
    element: <Testimonial_user />,
  },
  {
    path: "/verificar-setter",
    element: <Matricula_Setter />,
  },
  {
    path: "/perfil-setter",
    element: <Card_Setter />,
  },

  {
    path: "/publicidad",
    element: <Publicidad />,
  },

  // user
  
  {
    path: "/user/dashboard",
    element: <Dashboard_u />,
  },
  {
    path: "/user/prospectos",
    element: <Prospectos_user />,
  },
  {
    path: "/user/ajustes",
    element: <Ajustes_user />,
  },
  {
    path: "/user/proyectos",
    element: <Proyectos_u />,
  },


  // admin

  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/testimonios",
    element: <Testimonials />,
  },
  {
    path: "/admin/usuarios",
    element: <Usuarios_Registrados />,
  },
  {
    path: "/admin/portafolio",
    element: <Portfolios />,
  },
  {
    path: "/admin/prospectos",
    element: <Prospectos_a />,
  },
  {
    path: "/admin/proyectos",
    element: <Proyectos />,
  },
  {
    path: "/admin/prospectos-publicidad",
    element: <Prospectos_Publicidad />,
  },
  {
    path: "/admin/equipos",
    element: <Equipos />,
  },
  {
    path: "/admin/pagos",
    element: <Pagos />,
  },
  {
    path: "/admin/historial-pagos",
    element: <Historial_Pagos_Proyectos />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)
