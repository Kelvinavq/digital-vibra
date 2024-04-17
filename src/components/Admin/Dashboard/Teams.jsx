import { useState, useEffect } from "react";
import Config from "../../../config/Config";
const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_teams_count.php`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTeams(data.teams);
        } else {
          console.error("Error fetching teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleManageTeams = () => {
    window.location = "/admin/equipos";
  };

  return (
    <>
      <div className="equipos">
        <div className="head">
          <h2>Equipos actuales</h2>
          <button onClick={handleManageTeams}>Gestionar</button>
        </div>

        <div className="lista_equipos">
          {teams.map((team, index) => (
            <div className="equipo" key={index}>
              <h4>{team.name}</h4>
              <p>{team.memberCount} Integrantes</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Teams;
