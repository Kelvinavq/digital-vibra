import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./css/Config.css"
import Home from "./pages/Home/Home";;
import Login from "./pages/Login/Login";
import Testimonial_user from "./pages/Testimonial_user/Testimonial_user";
import Matricula_Setter from "./pages/Matricula_setter/Matricula_Setter";
import Card_Setter from "./pages/Matricula_setter/Card_Setter";

// admin
import Dashboard from "./pages/Admin/Dashboard";
import Testimonials from "./pages/Admin/Testimonials";
Testimonials
import Portfolios from "./pages/Admin/Portfolios";
import Setters from "./pages/Admin/Setters";

// user
import Dashboard_u from "./pages/User/Dashboard";
import Prospectos_user from "./pages/User/Prospectos_user";
import Ajustes_user from "./pages/User/Ajustes_user";

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
    path: "/admin/setters",
    element: <Setters />,
  },
  {
    path: "/admin/portafolio",
    element: <Portfolios />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
)
