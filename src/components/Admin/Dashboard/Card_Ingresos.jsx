import  "./Dashboard_a.css";
import React, { useState, useEffect } from "react";
import Config from "../../../config/Config"

const Card_Ingresos = () => {
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [ingresosMesActual, setIngresosMesActual] = useState(0);
  const [mesActual, setMesActual] = useState("");

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        // Obtener la fecha actual
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; 

        // Realizar la solicitud al backend para obtener los pagos
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_payments.php`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los pagos");
        }
        const data = await response.json();

        // Filtrar los pagos del mes actual
        const pagosMesActual = data.filter((pago) => {
          const paymentDate = new Date(pago.payment_date);
          return paymentDate.getMonth() + 1 === currentMonth; 
        });

        // Calcular los ingresos totales y para el mes actual
        const totalIngresos = data.reduce(
          (total, pago) => total + parseFloat(pago.amount),
          0
        );
        const totalIngresosMesActual = pagosMesActual.reduce(
          (total, pago) => total + parseFloat(pago.amount),
          0
        );

        // Establecer los valores en el estado
        setIngresosTotales(totalIngresos);
        setIngresosMesActual(totalIngresosMesActual);
        setMesActual(currentDate.toLocaleString("es-ES", { month: "long" }));
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchIngresos();
  }, []);

  return (
    <>
      <div className="card_ingresos">
        <p>Ingresos Totales</p>
        <h2>$ {ingresosTotales.toFixed(2)}</h2>

        <div className="mes">
          <span>{mesActual}:</span>
          <p>$ {ingresosMesActual.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
};

export default Card_Ingresos;
