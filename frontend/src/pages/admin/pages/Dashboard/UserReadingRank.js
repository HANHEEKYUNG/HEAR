import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';
import { fetchUserReadingRank } from '../../api/UserAPI'; // API 호출 함수 임포트

const UserReadingRank = () => {
  const [userRanks, setUserRanks] = useState([]);

  useEffect(() => {
    const getUserRanks = async () => {
      try {
        const result = await fetchUserReadingRank();
        console.log('result', result);
        
        setUserRanks(result); // 백엔드에서 가져온 데이터를 설정
      } catch (error) {
        console.error("Error fetching user reading ranks:", error);
      }
    };

    getUserRanks();
  }, []);

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">유저 독서량 순위</Typography>}
        action={
          <Button variant="outlined" size="small" sx={{  bgcolor: '#FFFFFF', fontWeight: 'bold', fontSize: '12px',
            '&:hover': {
          bgcolor: '#FFB74D',
          color: '#FFFFFF', // 흰색 텍스트
        },}}>
            더보기
          </Button>
        }
      />
      <CardContent>
        {userRanks.length > 0 ? (
          userRanks.map((user, index) => (
            <Typography key={index} variant="body2">
              {index + 1}. {user.NICKNAME} - 독서량: {user.total_reading_seconds}초
            </Typography>
          ))
        ) : (
          <Typography variant="body2">순위 데이터가 없습니다.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReadingRank;
