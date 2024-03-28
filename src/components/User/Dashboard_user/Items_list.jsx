import { useState, useEffect } from "react";
import GroupIcon from "@mui/icons-material/Group";
import PercentIcon from "@mui/icons-material/Percent";
import StarRateIcon from "@mui/icons-material/StarRate";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Config from "../../../config/Config";
import Swal from "sweetalert2";

const Items_list = () => {
  const [countProspects, setCountProspects] = useState("");
  const [UserDetail, setUserDetail] = useState("");
  const [commission, setCommission] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");
  const [teamRanking, setTeamRanking] = useState("");

  useEffect(() => {
    const getProspects = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_prospects.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCountProspects(data.length);
        } else {
          console.error("Error al obtener la lista de prospectos");
          Swal.fire({
            title: "Error al obtener la lista de prospectos",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener la lista de prospectos:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener la lista de prospectos",
        });
      }
    };

    const getInfoUser = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_info_user.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserDetail(data);
        } else {
          console.error("Error al obtener los detalles del usuario");
          Swal.fire({
            title: "Error al obtener los detalles del usuario",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener los detalles del usuario",
        });
      }
    };

    const getCommission = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_commission.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCommission(data.totalCommission);

           // Obtener el mes actual en español
           const currentMonthInSpanish = new Date().toLocaleDateString('es-ES', { month: 'long' });
           setCurrentMonth(currentMonthInSpanish);
        } else {
          console.error("Error al obtener la comisión de marzo");
          Swal.fire({
            title: "Error al obtener la comisión de marzo",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener la comisión de marzo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener la comisión de marzo",
        });
      }
    };

    const getTeamRanking = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_team_ranking.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTeamRanking(data);
        } else {
          console.error("Error al obtener el ranking del equipo");
          Swal.fire({
            title: "Error al obtener el ranking del equipo",
            text: "Recargue la página e intente nuevamente",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al obtener el ranking del equipo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error inesperado al obtener el ranking del equipo",
        });
      }
    };

    getCommission();
    getInfoUser();
    getProspects();
    getTeamRanking();
  }, []);



  return (
    <div className="items_list">
      <ul>
        <li>
          <div className="icono">
            <GroupIcon />
          </div>
          <div className="text">
            <span>Prospectos registrados</span>
            <p>{countProspects}</p>
          </div>
        </li>
        <li>
          <div className="icono">
            <PercentIcon />
          </div>
          <div className="text">
            <span>Comisión de {currentMonth}</span>
            <p>$ {commission !== null ? commission : '0'}</p>
          </div>
        </li>
        <li>
          <div className="icono">
            <StarRateIcon />
          </div>
          <div className="text">
            <span>Posición Actual</span>
            <p>Posición Nº {teamRanking.user_team_position}</p>
          </div>
        </li>
        <li>
          <div className="icono">
            <Diversity3Icon />
          </div>
          <div className="text">
            <span>Equipo Perteneciente</span>
            <p>Equipo {UserDetail.team_name}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Items_list;
