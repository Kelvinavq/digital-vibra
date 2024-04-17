import React, { useEffect, useState, useRef } from "react";
import ApexCharts from "apexcharts";
import Config from "../../../config/Config"

const Progreso_Equipos = () => {
  const chartRef = useRef(null);
  const [donutChartData, setDonutChartData] = useState({
    series: [],
    options: {
      chart: {
        width: "100%",
        height: 250,
        type: "pie",
      },
      labels: [],
      colors: [
        "#ff9702",
        "#252830",
        "#41f1b6",
        "#9c2328",
        "#2b327e",
        "#144a38",
      ],
      responsive: [
        {
          breakpoint: 490,
          options: {
            chart: {
              width: "100%",
              height: 220,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    if (chartRef.current) {
      // Inicializar el gráfico una vez que el componente se monte completamente
      const donutChart = new ApexCharts(chartRef.current, {
        series: donutChartData.series,
        ...donutChartData.options,
      });

      donutChart.render();

      // Devolver una función de limpieza para destruir el gráfico al desmontar el componente
      return () => {
        donutChart.destroy();
      };
    }
  }, [donutChartData]);

  useEffect(() => {
    const fetchTeamRanking = async () => {
      try {
        const response = await fetch(`${Config.backendBaseUrlAdmin}get_ranking_teams.php`, {
          credentials: "include",
        });
        if (response.ok) {
          const ranking = await response.json();
          const series = ranking.map((team) => Number(team.total_budget));

          const labels = ranking.map((team) => team.name);
          // Actualizar los datos del gráfico
          setDonutChartData({
            series: series,
            options: {
              ...donutChartData.options,
              labels: labels,
            },
          });
        } else {
          console.error("Error fetching team ranking:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching team ranking:", error);
      }
    };

    fetchTeamRanking();
  }, []);

    

  return (
    <>
      <div className="progreso_equipos">
        <div className="inner_progreso_equipos">
          <div className="title">
            <h2>Progreso de equipos</h2>

            <div id="graphic_rounded" ref={chartRef}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Progreso_Equipos;
