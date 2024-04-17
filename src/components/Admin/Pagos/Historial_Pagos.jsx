import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "../../../config/Config";

import "./Pagos.css";
import EditIcon from "@mui/icons-material/Edit";

const Historial_Pagos = () => {
  const [Pagos, setPagos] = useState([]);
  const setterId = new URLSearchParams(location.search).get("setter");
  const prospectId = new URLSearchParams(location.search).get("prospecto");

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        let url = `${Config.backendBaseUrlAdmin}get_payments_list.php`;

        // Verificar si hay un ID de setter en la URL
        if (setterId) {
          url += `?id_setter=${setterId}`;
        }
        // Verificar si hay un ID de prospecto en la URL
        else if (prospectId) {
          url += `?id_prospect=${prospectId}`;
        }

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPagos(data);
        } else {
          // Manejar el caso de error
          Swal.fire({
            icon: "error",
            title: "Error al obtener pagos",
            text: "Hubo un error al obtener los pagos.",
          });
        }
      } catch (error) {
        console.error("Error al obtener pagos:", error);
        Swal.fire({
          icon: "error",
          title: "Error al obtener pagos",
          text: "Hubo un error al obtener los pagos.",
        });
      }
    };

    fetchPagos();
  }, []);

  const handleEditAmount = async (pagoId, currentAmount, deuda) => {
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add("swal2-input");
    input.value = formatAmount(currentAmount);
    input.addEventListener('input', (e) => {
      e.target.value = formatAmount(e.target.value);
    });
  
    const { value: newAmount } = await Swal.fire({
      title: "Editar monto abonado",
      html: input,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const enteredAmount = parseFloat(input.value.replace(/[^\d.]/g, ''));
          if (isNaN(enteredAmount) || enteredAmount <= 0) {
            throw new Error('Ingrese un monto válido');
          }
          if (enteredAmount > deuda) {
            throw new Error('El monto ingresado no puede ser mayor que la deuda');
          }
          const response = await fetch(
            `${Config.backendBaseUrlAdmin}update_payment_amount.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pagoId: pagoId,
                newAmount: enteredAmount,
              }),
            }
          );
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return await response.json();
        } catch (error) {
          Swal.showValidationMessage(`Error al actualizar el monto: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  
    if (newAmount) {
      Swal.fire({
        icon: "success",
        title: "Monto actualizado correctamente",
        didClose: () => {
          window.location.reload();
        },
      });
    }
  };
  

  const formatAmount = (value) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^\d]/g, "");

    // Formatear con separador de miles y decimales
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(numericValue) / 100);

    return formattedValue;
  };

  return (
    <>
      <div className="pagos">
        <div className="title">
          <h2>Historial de pagos</h2>
        </div>

        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Proyecto</th>
                <th scope="col">Setter</th>
                <th scope="col">Prospecto</th>
                <th scope="col">Fecha y hora</th>
                <th scope="col">Abonado</th>
                <th scope="col">Restante</th>
                <th scope="col"></th>
              </tr>
            </thead>

            <tbody>
              {Pagos.map((pago, index) => (
                <tr key={index}>
                  <td data-label="Nº">{pago.id}</td>
                  <td data-label="Proyecto">{pago.project_name}</td>
                  <td data-label="Setter">{pago.setter_name}</td>
                  <td data-label="Prospecto">
                    {pago.prospect_name} {pago.prospect_last_name}
                  </td>
                  <td data-label="Fecha y hora">
                    {pago.payment_date} {pago.payment_time}
                  </td>
                  <td data-label="Abonado">{pago.amount}</td>
                  <td data-label="Restante">{pago.remaining}</td>
                  <td data-label="Editar">
                    <button
                      onClick={() => handleEditAmount(pago.id, pago.amount, pago.project_budget)}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Historial_Pagos;
