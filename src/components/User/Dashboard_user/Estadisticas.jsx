import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";

const Estadisticas = () => {
  const [donutChartData, setDonutChartData] = useState({
    series: [44, 55, 13],
    options: {
      chart: {
        width: "100%", // Hacer el ancho del gráfico al 100% para ser responsivo
        type: "pie",
      },
      labels: ["Team A", "Team B", "Team C"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%", // Ajusta el ancho para dispositivos móviles
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [radialBarChartData, setRadialBarChartData] = useState({
    series: [76],
    options: {
      chart: {
        width: "100%",
        type: "radialBar",
        offsetY: -20,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: "#999",
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "22px",
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      labels: ["Average Results"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    // Donut Chart
    const donutDomContainer = document.querySelector("#donut-chart");
    const donutChart = new ApexCharts(donutDomContainer, {
      ...donutChartData.options,
      series: donutChartData.series,
    });
    donutChart.render();

    // Radial Bar Charts
    const radialBarDomContainer = document.querySelector("#radial-bar-chart");
    const radialBarChart = new ApexCharts(radialBarDomContainer, {
      ...radialBarChartData.options,
      series: radialBarChartData.series,
    });
    radialBarChart.render();

    const radialBarDomContainer2 = document.querySelector("#radial-bar-chart2");
    const radialBarChart2 = new ApexCharts(radialBarDomContainer2, {
      ...radialBarChartData.options,
      series: [60],
    });
    radialBarChart2.render();

    const radialBarDomContainer3 = document.querySelector("#radial-bar-chart3");
    const radialBarChart3 = new ApexCharts(radialBarDomContainer3, {
      ...radialBarChartData.options,
      series: [30],
    });
    radialBarChart3.render();

    const radialBarDomContainer4 = document.querySelector("#radial-bar-chart4");
    const radialBarChart4 = new ApexCharts(radialBarDomContainer4, {
      ...radialBarChartData.options,
      series: [15],
    });
    radialBarChart4.render();

    return () => {
      donutChart.destroy();
      radialBarChart.destroy();
      radialBarChart2.destroy();
      radialBarChart3.destroy();
      radialBarChart4.destroy();
    };
  }, [donutChartData, radialBarChartData]);

  return (
    <div className="estadisticas">
      <div className="title">
        <h2>Estadísticas</h2>
      </div>
      <div className="container_estadisticas">
        <div id="donut-chart"></div>
        <div id="radial-bar-chart"></div>
      </div>

      <div className="container_estadisticas_dos">
        <div id="radial-bar-chart2"></div>
        <div id="radial-bar-chart3"></div>
        <div id="radial-bar-chart4"></div>
      </div>
    </div>
  );
};

export default Estadisticas;
