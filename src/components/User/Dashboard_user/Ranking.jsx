import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';

const Ranking = () => {
  const [chartData, setChartData] = useState({
    series: [{
      name: 'Equipo A',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 21, 44, 32]
    }, {
      name: 'Equipo B',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 31, 54, 66]
    },],
    options: {
      chart: {
        type: 'bar',
        height: 200
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
      
      },
      fill: {
        opacity: 1
      },
      colors: ["#ff9702", "#252830"],
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " USD"
          }
        }
      }
    },
  });

  useEffect(() => {
    const domContainer = document.querySelector('#chart-rank');
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
