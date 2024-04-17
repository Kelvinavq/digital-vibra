import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Config from "../../../config/Config";

const Prospectos_Obtenidos = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Prospectos",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
    options: {
      chart: {
        width: "100%",
        height: 250,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#fe9908", "#606064"],
      grid: {
        borderColor: "#00000000",
        strokeDashArray: 1,
      },
      xaxis: {
        categories: ["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"],
      },
    },
  });

  useEffect(() => {
    const chart = new ApexCharts(document.querySelector("#graphic_linear"), {
      series: chartData.series,
      ...chartData.options,
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartData]);

  useEffect(() => {
    const fetchProspectData = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlAdmin}get_prospect_count_by_day.php`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const prospectData = await response.json();
          const categories = prospectData.map((entry) => entry.date);
          const data = prospectData.map((entry) => entry.count);
          setChartData({
            series: [{ name: "Prospectos", data: data }],
            options: {
              ...chartData.options,
              xaxis: { categories: categories },
            },
          });
        } else {
          console.error("Error fetching prospect data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching prospect data:", error);
      }
    };

    fetchProspectData();
  }, []);
  return (
    <>
      <div className="prospectos_obtenidos">
        <div className="inner_prospectos_obtenidos">
          <div className="title">
            <h2>Prospectos obtenidos de la campaña</h2>
            <div id="graphic_linear"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prospectos_Obtenidos;
