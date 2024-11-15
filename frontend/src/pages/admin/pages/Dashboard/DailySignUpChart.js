import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { fetchDailySignUpCounts } from '../../api/UserAPI';

const DailySignUpChart = () => {
  const [data, setData] = useState([]);
  const [yAxisMax, setYAxisMax] = useState(10);

  useEffect(() => {
    // 지연 로딩 추가
    const timer = setTimeout(() => {
      const getSignUpData = async () => {
        try {
          const result = await fetchDailySignUpCounts();
          
          const processedData = result.map(entry => ({
            name: new Date(entry.date).toLocaleDateString('ko-KR'),
            value: entry.value
          }));
          
          setData(processedData);

          const maxValue = Math.max(...processedData.map(entry => entry.value));
          if (maxValue <= 10) {
            setYAxisMax(10);
          } else if (maxValue <= 50) {
            setYAxisMax(50);
          } else {
            setYAxisMax(100);
          }
        } catch (error) {
          console.error("Error fetching daily sign-up data:", error);
        }
      };

      getSignUpData();
    }, 300); // 300ms 지연

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', padding: 2, height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6" sx={{ marginBottom: 1 }}>일별 회원가입 건수</Typography>}
        subheader={<Typography variant="body2">일별로 회원가입 회원의 건수를 시각적으로 나타냅니다.</Typography>}
      />
      <CardContent sx={{mt: 3, ml: -8}}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <BarChart
            width={550}
            height={250}
            data={data}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => value.toFixed(0)}
              allowDecimals={false}
              domain={[0, yAxisMax]}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" name="가입자수" barSize={20} isAnimationActive={true} animationBegin={0} animationDuration={1500} animationEasing="ease-out"/>
          </BarChart>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailySignUpChart;
