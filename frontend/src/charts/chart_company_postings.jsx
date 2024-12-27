import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './DynamicChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart_company_postings = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Lấy danh sách các công ty
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/company");
        const data = await response.json();
        setCompanies(data.data);

        if (data.data.length > 0) {
          setSelectedCompanyId(data.data[0].company_id);
        }
      } catch (error) {
        console.error("Lỗi khi lấy công ty: ", error);
      }
    }

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      async function fetchData() {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/company/chart_company_postings/${selectedCompanyId}`);
          const data = await response.json();
          const days = data.data.map(item => item.original_listed_time);
          const postCounts = data.data.map(item => item.post_count);

          setChartData({
            labels: days,
            datasets: [
              {
                label: "Số lượng bài đăng",
                data: postCounts,
                borderColor: "blue",
                backgroundColor: "rgba(0, 123, 255, 0.3)",
                pointRadius: 5,
                pointHoverRadius: 8,
              },
            ],
          });
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu: ", error);
        }
      }

      fetchData();
    }
  }, [selectedCompanyId]);

  // Biểu đồ
  const renderChart = () => {
    if (!chartData) {
      return <div>Chưa có dữ liệu để hiển thị</div>;
    }

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Số lượng bài đăng theo tháng của công ty 06/2024",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Ngày",
          },
        },
        y: {
          title: {
            display: true,
            text: "Số lượng bài đăng",
          },
          beginAtZero: true,
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  return (
    <div className="dynamic-chart-container">
      <div className="content-container">
        <div className="table-container">
          <table className="company-table">
            <thead>
              <tr>
                <th>Tên công ty</th>
                <th>Chọn</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.company_id}>
                  <td>{company.company_name}</td>
                  <td>
                    <button
                      className="view-chart-btn"
                      onClick={() => setSelectedCompanyId(company.company_id)}
                    >
                      Xem biểu đồ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="chart-container">{selectedCompanyId && renderChart()}</div>
      </div>
    </div>
  );
};

export default Chart_company_postings;
