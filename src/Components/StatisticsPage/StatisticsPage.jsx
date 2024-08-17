import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import "./StatisticsPage.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

function StatisticsPage() {
  const [statistics, setStatistics] = useState({
    applied: 0,
    approved: 0,
    rejected: 0,
    documentsRequested: 0, 
  });

  useEffect(() => {
    let url = "http://localhost:8080/api/v1/loan-applications/statistics";
    let token = localStorage.getItem("authToken");

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStatistics(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const data = {
    labels: ["Applied", "Approved", "Rejected", "Documents Requested"], 
    datasets: [
      {
        data: [
          statistics.applied,
          statistics.approved,
          statistics.rejected,
          statistics.documentsRequested, 
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 206, 86, 0.2)", 
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)", 
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: "Loan Application Statistics",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="statistics-page">
      <div className="background-blur"></div>
      <div className="overlay"></div>
      <div className="content">
        <h2>Loan Application Statistics</h2>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
