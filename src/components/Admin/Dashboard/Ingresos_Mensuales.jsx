import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Config from "../../../config/Config"


const Ingresos_Mensuales = () => {

    const [chartData, setChartData] = useState({
        series: [{
            name: 'Ingresos',
            data: [500,225,100,845,120,648,412,315,50,694,1105,985]
          }],
        options: {
          chart: {
            type: "bar",
            height: 250,
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
          grid: {
            borderColor: "#00000000",
            strokeDashArray: 1,
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
        const graphic_bar = new ApexCharts(
          document.querySelector("#graphic_bar"),
          {
            series: chartData.series,
            ...chartData.options
          }
        );
    
        graphic_bar.render();
    
        return () => {
            graphic_bar.destroy();
        };
      }, [chartData]); 

      useEffect(() => {
        const fetchMonthlyIncomes = async () => {
          try {
            const response = await fetch(`${Config.backendBaseUrlAdmin}get_monthly_incomes.php`, {
              credentials: "include",
            });
            if (response.ok) {
              const monthlyIncomes = await response.json();
              const data = monthlyIncomes.map(item => item.total_amount);
              setChartData({
                series: [{ name: 'Ingresos', data: data }],
                options: chartData.options,
              });
            } else {
              console.error("Error fetching monthly incomes:", response.statusText);
            }
          } catch (error) {
            console.error("Error fetching monthly incomes:", error);
          }
        };
    
        fetchMonthlyIncomes();
      }, []);

  return (
    <>
    <div className="ingresos_mensuales">
      <div className="inner_ingresos_mensuales">
        <div className="title">
          <h2>Ingresos mensuales</h2>

          <div id="graphic_bar"></div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Ingresos_Mensuales
