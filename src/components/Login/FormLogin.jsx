import "./Login.css";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Config from "../../config/Config";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, password } = formData;

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ingrese un correo electrónico válido",
      });
      return false;
    } else if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe contener al menos 8 carácteres",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar al servidor
    if (!validateForm()) {
      return;
    }

    // Enviar datos al servidor
    try {
      const response = await fetch(
        `${Config.backendBaseUrl}Login.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          mode: "cors",
          credentials: "include",
        }
      );

      const responseData = await response.json();

      if (response.ok) {

        localStorage.setItem("user_role", responseData.user_role);
        localStorage.setItem("user_id", responseData.user_id);

        if (responseData.user_role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/user/dashboard";
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.message || "Correo o contraseña inválidos",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al iniciar sesión",
      });
    }
  };

  return (
    <div className="container login">
      <form className="box" onSubmit={handleLogin}>
        <h4>
          Vibra<span>Digital</span>
        </h4>
        <h5>Bienvenido a tu Agencia</h5>
        <input
          type="email"
          placeholder="Correo electrónico"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <input type="submit" value="Iniciar Sesión" className="btn1" />
      </form>
    </div>
  );
};

export default FormLogin;
