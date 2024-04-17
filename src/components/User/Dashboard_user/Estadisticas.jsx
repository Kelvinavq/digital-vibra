import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Config from "../../../config/Config";

const Estadisticas = () => {
  const [donutChartData, setDonutChartData] = useState({
    series: [10, 10, 10],
    options: {
      chart: {
        width: "100%",
        height: 220,
        type: "pie",
      },
      labels: [
        "Mensajes enviados",
        "Mensajes respondidos",
        "Mensajes agendados",
      ],
      colors: ["#f39c12", "#17181d", "#03a18b"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
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
    series: [],
    options: {
      chart: {
        width: "100%",
        height: 320,
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
              show: true,
              offsetY: -20,
              fontSize: "22px",
            },
            total: {
              show: true,
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

  const [radialBarChartData2, setRadialBarChartData2] = useState({
    series: [],
    options: {
      chart: {
        width: "100%",
        height: 320,
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
              show: true,
              offsetY: -2,
              fontSize: "22px",
            },
            total: {
              show: true,
              offsetY: 15,
              label: "", // La etiqueta se establecerá dinámicamente
              formatter: function () {
                return ""; // El texto se establecerá dinámicamente
              },
            },
            total: {
              show: true,
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

  const [radialBarChartData3, setRadialBarChartData3] = useState({
    series: [],
    options: {
      chart: {
        width: "100%",
        height: 320,
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
              show: true,
              offsetY: -2,
              fontSize: "22px",
            },
            total: {
              show: true,
              offsetY: 15,
              label: "", // La etiqueta se establecerá dinámicamente
              formatter: function () {
                return ""; // El texto se establecerá dinámicamente
              },
            },
            total: {
              show: true,
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

  const [radialBarChartData4, setRadialBarChartData4] = useState({
    series: [],
    options: {
      chart: {
        width: "100%",
        height: 320,
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
              show: true,
              offsetY: -20,
              fontSize: "22px",
            },
            total: {
              show: true,
              offsetY: 15,
              label: "", // La etiqueta se establecerá dinámicamente
              formatter: function () {
                return ""; // El texto se establecerá dinámicamente
              },
            },
            total: {
              show: true,
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

  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch para obtener los datos del backend
        const responseDonut = await fetch(
          `${Config.backendBaseUrlUser}get_data_donut.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!responseDonut.ok) {
          throw new Error("Error al obtener los datos del backend");
        }

        const dataDonut = await responseDonut.json();
        // Verificar si hay datos disponibles o no
        if (
          dataDonut.mensajesEnviados === 0 &&
          dataDonut.mensajesRespondidos === 0 &&
          dataDonut.mensajesAgendados === 0
        ) {
          // No hay datos disponibles, establecer valores predeterminados
          setDonutChartData({
            series: [0, 0, 0], // Todas las series se establecen en 0
            options: donutChartData.options, // Mantener las opciones del gráfico
          });
          setShowChart(false);
        } else {
          // Hay datos disponibles, actualizar el gráfico
          setDonutChartData((prevData) => ({
            ...prevData,
            series: [
              dataDonut.mensajesEnviados,
              dataDonut.mensajesRespondidos,
              dataDonut.mensajesAgendados,
            ],
          }));
          setShowChart(true);
        }

        // Fetch para obtener el total de mensajes enviados
        const responseTotalMensajes = await fetch(
          `${Config.backendBaseUrlUser}get_total_mensajes_enviados.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!responseTotalMensajes.ok) {
          throw new Error("Error al obtener el total de mensajes enviados");
        }

        // Fetch para obtener el total de mensajes respondidos
        const responseTotalMensajesRespondidos = await fetch(
          `${Config.backendBaseUrlUser}get_total_mensajes_respondidos.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!responseTotalMensajesRespondidos.ok) {
          throw new Error("Error al obtener el total de mensajes respondidos");
        }

        const totalMensajesRespondidos =
          await responseTotalMensajesRespondidos.json();

        // Actualizar el gráfico radial-bar-chart2 con el total de mensajes respondidos
        setRadialBarChartData2((prevData) => ({
          ...prevData,
          series: [totalMensajesRespondidos.total_mensajes_respondidos],
        }));

        // Fetch para obtener el total de reuniones agendadas
        const responseTotalReunionesAgendadas = await fetch(
          `${Config.backendBaseUrlUser}get_total_reuniones_agendadas.php`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!responseTotalReunionesAgendadas.ok) {
          throw new Error("Error al obtener el total de reuniones agendadas");
        }

        const totalReunionesAgendadas =
          await responseTotalReunionesAgendadas.json();

        setRadialBarChartData3((prevData) => ({
          ...prevData,
          series: [totalReunionesAgendadas.total_reuniones_agendadas],
        }));

        const totalReuniones =
          totalReunionesAgendadas.total_reuniones_agendadas;

        // Calcular el valor para el gráfico radial-bar-chart4
        const valorRadialBarChart4 = (totalReuniones / 100) * 15;

        // Actualizar el gráfico radial-bar-chart4 con el valor calculado
        setRadialBarChartData4((prevData) => ({
          ...prevData,
          series: [valorRadialBarChart4],
        }));

        const totalMensajesEnviados = await responseTotalMensajes.json();
        // Actualizar el gráfico radial-bar-chart con el total de mensajes enviados

        // Calcular el porcentaje de mensajes respondidos sobre el total de mensajes enviados
        const porcentajeEnviados =
          (totalMensajesRespondidos.total_mensajes_respondidos /
          totalMensajesEnviados.total_mensajes_enviados) *
          100;


        setRadialBarChartData((prevData) => ({
          ...prevData,
          series: [porcentajeEnviados],
        }));
      } catch (error) {
        console.error("Error en la solicitud fetch:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let donutChart = null;
    const donutDomContainer = document.querySelector("#donut-chart");
    if (donutDomContainer) {
      if (donutChartData.series.every((value) => value === 0)) {
        // No hay datos disponibles, establecer valores predeterminados
        donutChart = new ApexCharts(donutDomContainer, {
          ...donutChartData.options,
          series: [1, 0, 0], // Todas las series se establecen en 0
        });
      } else {
        // Hay datos disponibles, actualizar el gráfico
        donutChart = new ApexCharts(donutDomContainer, {
          ...donutChartData.options,
          series: donutChartData.series,
        });
      }
      donutChart.render();
    }

    // Radial Bar Charts
    const radialBarDomContainer = document.querySelector("#radial-bar-chart");
    const radialBarChart = new ApexCharts(radialBarDomContainer, {
      ...radialBarChartData.options,
      series: radialBarChartData.series,
      colors: ["#f39c12"],
    });
    radialBarChart.render();

    const radialBarDomContainer2 = document.querySelector("#radial-bar-chart2");
    const radialBarChart2 = new ApexCharts(radialBarDomContainer2, {
      ...radialBarChartData.options,
      series: radialBarChartData2.series,
      colors: ["#17181d"],
    });
    radialBarChart2.render();

    const radialBarDomContainer3 = document.querySelector("#radial-bar-chart3");
    const radialBarChart3 = new ApexCharts(radialBarDomContainer3, {
      ...radialBarChartData.options,
      series: radialBarChartData3.series,
      colors: ["#58d1b9"],
    });
    radialBarChart3.render();

    const radialBarDomContainer4 = document.querySelector("#radial-bar-chart4");
    const radialBarChart4 = new ApexCharts(radialBarDomContainer4, {
      ...radialBarChartData4.options, // Utiliza las opciones del gráfico radial correcto
      series: radialBarChartData4.series, // Utiliza las series del gráfico radial correcto
      colors: ["#ff7782"],
    });

    radialBarChart4.render();

    return () => {
      if (donutChart) donutChart.destroy();
      radialBarChart.destroy();
      radialBarChart2.destroy();
      radialBarChart3.destroy();
      radialBarChart4.destroy();
    };
  }, [
    donutChartData,
    radialBarChartData,
    radialBarChartData2,
    radialBarChartData3,
    radialBarChartData4,
  ]);

  return (
    <div className="estadisticas">
      <div className="title">
        <h2>Estadísticas</h2>
      </div>
      <div className="container_estadisticas">
        {showChart ? (
          <div id="donut-chart"></div>
        ) : (
          <p>No hay datos disponibles para mostrar.</p>
        )}
        <div className="grafico">
          <div id="radial-bar-chart"></div>
          <p>Mensajes enviados</p>
        </div>
      </div>

      <div className="container_estadisticas_dos">
        <div className="grafico">
          <div id="radial-bar-chart2"></div>
          <p>Mensajes respondidos</p>
        </div>
        <div className="grafico">
          <div id="radial-bar-chart3"></div>
          <p>Reuniones agendadas</p>
        </div>
        <div className="grafico">
          <div id="radial-bar-chart4"></div>
          <p>Posibilidad de ventas</p>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
