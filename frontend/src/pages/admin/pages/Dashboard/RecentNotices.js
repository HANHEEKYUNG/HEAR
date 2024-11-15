import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';
import { fetchRecentNotices } from '../../api/NoticeAPI'; // 공지사항 API 호출 함수 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

const RecentNotices = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const getNotices = async () => {
      try {
        const result = await fetchRecentNotices();
        setNotices(result.slice(0, 3)); // 처음 3개만 설정
      } catch (error) {
        console.error("Error fetching recent notices:", error);
      }
    };

    getNotices();
  }, []);

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    navigate('/admin/noticelist'); // 버튼 클릭 시 경로 이동
  };

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, width: '100%', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6">최근 공지사항</Typography>}
        action={
          <Button variant="outlined" size="small" onClick={handleButtonClick} sx={{  bgcolor: '#FFFFFF', fontWeight: 'bold', fontSize: '12px',
            '&:hover': {
          bgcolor: '#FFB74D',
          color: '#FFFFFF', // 흰색 텍스트
        },}}>
            더보기
          </Button>
        }
      />
      <CardContent>
        {notices.length > 0 ? (
          notices.map((notice, index) => (
            <Typography key={index} variant="body2">
              - {notice.NOTICE_TITLE}
            </Typography>
          ))
        ) : (
          <Typography variant="body2">공지사항이 없습니다.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentNotices;
