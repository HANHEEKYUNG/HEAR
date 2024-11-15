import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { fetchCategoryCounts } from '../../api/predictAPI';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0', '#FF9800'];

const CategoryChart = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 후 약간의 지연을 주어 데이터 로딩
    const timer = setTimeout(() => {
      const getCategoryCounts = async () => {
        try {
          const result = await fetchCategoryCounts();
          console.log('result', result);
          
          // 데이터 구조 확인 및 변환이 필요한 경우
          const formattedData = Array.isArray(result) ? result : [];
          setData(formattedData);
        } catch (error) {
          console.error("Error fetching category data:", error);
        }
      };

      getCategoryCounts();
    }, 300); // 300ms 지연

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate('/admin/predict');
  };

  // 커스텀 레이블 함수 (퍼센트만 표시 및 위치 조정)
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card
      sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%', padding: 2, cursor: 'pointer' }}
      onClick={handleClick}
    >
      <CardHeader
        title={<Typography variant="h6" sx={{ marginBottom: 1 }}>공유마당 분류 현황</Typography>}
        subheader={<Typography variant="body2" sx={{ marginBottom: 1 }}>공유마당 데이터 주제 분류를 시각적으로 보여줍니다.</Typography>}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 0, mt: -3 }}>
        <PieChart width={320} height={320}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Custom Legend (3개씩 2줄로 나누어 표시) */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: -2, ml: 6, mb: -2 }}>
          {data.map((entry, index) => (
            <Box key={`legend-${index}`} sx={{ width: '30%', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: COLORS[index % COLORS.length],
                  marginRight: 1,
                }}
              />
              <Typography variant="body2">{entry.name}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
