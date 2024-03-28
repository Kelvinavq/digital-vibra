import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Config from "../../../config/Config";

const Ranking = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 200,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {},
      fill: {
        opacity: 1,
      },
      colors: [
        "#ff9702",
        "#252830",
        "#41f1b6",
        "#9c2328",
        "#2b327e",
        "#144a38",
      ],
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " USD";
          },
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${Config.backendBaseUrlUser}get_ranking_data.php`
        );
        if (response.ok) {
          const data = await response.json();
          setChartData({ ...chartData, series: data.series });
        } else {
          console.error("Error al obtener los datos del ranking");
        }
      } catch (error) {
        console.error("Error al obtener los datos del ranking:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const domContainer = document.querySelector("#chart-rank");
    const chart = new ApexCharts(domContainer, {
      ...chartData.options,
      series: chartData.series,
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [chartData]);

  return (
    <div className="ranking">
      <div className="title">
        <h2>Ranking de Equipos</h2>
      </div>
      <div id="chart-rank"></div>
    </div>
  );
};

export default Ranking;
