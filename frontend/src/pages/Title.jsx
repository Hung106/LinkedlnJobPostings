import React, { useEffect, useState } from 'react';

const TopKeywordsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/posting_title')
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setData(result.data);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: 'green' }}>
        TOP 15 từ khóa xuất hiện nhiều nhất trong Posting title
      </h2>
      <div style={{ padding: '10px', maxWidth: '600px', margin: '0 auto' }}>
        {data.map(([keyword, count], index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ width: '150px', fontWeight: 'bold', textAlign: 'left', fontSize: '25px' }}>
              {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
            </span>
            <div
              style={{
                width: `${(count / data[0][1]) * 100}%`,
                backgroundColor: '#90d890',
                color: '#000',
                textAlign: 'right',
                padding: '5px',
                borderRadius: '4px',
              }}
            >
              {count}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          backgroundColor: '#d7f0d7',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          fontSize: '20px',
          color: '#333',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        <strong>Ghi chú:</strong> Những từ khóa ở trên giúp nắm bắt xu hướng thị trường lao động và các lĩnh vực
        đang được tuyển dụng nhiều nhất, từ đó xác định ngành nghề tiềm năng và kỹ năng quan trọng trong thị trường
        việc làm hiện tại và tương lai.
      </div>
    </div>
  );
};

export default TopKeywordsChart;
