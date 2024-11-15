import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress, Card, CardContent, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchHistory } from '../../api/studyAPI';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { formatInTimeZone } from 'date-fns-tz';

const timeToSeconds = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
};

const History = () => {
  const navigate = useNavigate();
  const { userObject } = useAuth();
  const [history, setHistory] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(2);
  const itemsPerPage = 2;

  useEffect(() => {
    const getHistory = async () => {
      try {
        const fetchedHistory = await fetchHistory(userObject?.USER_SEQ || null);
        console.log('fetchedHistory', fetchedHistory);
        
        if (userObject?.USER_SEQ) {
          const userHistory = fetchedHistory.filter(item => item.USER_SEQ === userObject.USER_SEQ);
          const sortedHistory = userHistory.sort((a, b) => new Date(b.HIST_VwDt) - new Date(a.HIST_VwDt));
          setHistory(sortedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    if (userObject?.USER_SEQ) {
      getHistory();
    }
  }, [userObject]);

  const handleLoadMore = () => {
    setDisplayedItems((prevItems) => prevItems + itemsPerPage);
  };

  const handleShowLess = () => {
    setDisplayedItems(itemsPerPage);
  };

  const handleNavigate = (bookSeq, lastPosition) => {
    const positionInSeconds = timeToSeconds(lastPosition);
    lastPosition = positionInSeconds;
    navigate('/library/book/play', { state: { lastPosition, selected: bookSeq } });
  };

  const handleLibrary = () => {
    navigate('/library');
  };

  return (
    <Box
    bgcolor="#FFFEFE"
    sx={{
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}
  >
      <Header />
      <Breadcrumb />
      <ProfileSection />

      <Container maxWidth="xl" sx={{ mt: 3, marginTop: '0px' }} >
        <Card
         sx={{ width: 1500, margin: 'auto', mt: 4, p: 10, borderRadius: 5, boxShadow: 10,  bgcolor: '#EAF7FF', mb: 10
        }}
        >
            <Box sx={{ mb: 4, marginTop: '-30px', }}>
        <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "36px", mb: -1 }}>
          최근 읽은 기록
        </Typography>
            </Box>


            <CardContent sx={{mt:20}}>
        {history.length > 0 ? (
          <>
            <Timeline position="alternate">
              {history.slice(0, displayedItems).map((row, index) => {
                let progressValue = 0;
                if (row.HIST_EdPt && row.RUN_TIME) {
                  const elapsedSeconds = timeToSeconds(row.HIST_EdPt);
                  const totalSeconds = timeToSeconds(row.RUN_TIME);
                  progressValue = totalSeconds > 0 ? Math.min((elapsedSeconds / totalSeconds) * 100, 100) : 0;
                }

                return (
                  <TimelineItem key={index}>
  <TimelineSeparator>
    <Box 
      onClick={() => handleNavigate(row.BOOK_SEQ, row.HIST_EdPt)}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <CircularProgress variant="determinate" value={progressValue} size={120}  sx={{ color: '#72A8FF' }}/>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(progressValue)}%`}
        </Typography>
      </Box>
    </Box>
    {index !== displayedItems - 1 && <TimelineConnector />}
  </TimelineSeparator>

  <TimelineContent sx={{ display: 'flex', justifyContent: 'center' }}>
    <Card sx={{ width: 450,
            height: 300, mt:-10 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* 좌측 이미지 */}
        <Box
          component="img"
          src={`/static/image/bookcover/${row.IMG_PATH}`}
          alt={"책 커버 사진 없음"}
          sx={{
            width: 180,
            height: 240,
            objectFit: 'cover',
            borderRadius: 1,
            borderColor: '#000000',
            cursor: 'pointer',
            mb: 1,
          }}
          onClick={() => handleNavigate(row.BOOK_SEQ, row.HIST_EdPt)}
        />

        {/* 우측 텍스트 정보 */}
        <Box
          onClick={() => handleNavigate(row.BOOK_SEQ, row.HIST_EdPt)}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: '15%' }}
        >
          <Typography 
            variant="h6" 
            sx={{ cursor: 'pointer', textAlign: 'center', fontSize: '24px' }}
          >
            [ {row.BOOK_NAME} ]
          </Typography>
          <Box sx={{ mt: 5 }}></Box>
          <Typography variant="body2" color="textSecondary">{row.AUTHOR}</Typography>
          <Box sx={{ mt: 1 }}></Box>
          <Typography variant="body2" color="textSecondary">{`${row.HIST_EdPt} / ${row.RUN_TIME}`}</Typography>
          <Box sx={{ mt: 1 }}></Box>
          <Typography variant="body2" color="textSecondary">{formatInTimeZone(new Date(row.HIST_VwDt), 'UTC', 'yyyy.MM.dd')}</Typography>
        </Box>
      </CardContent>
    </Card>
  </TimelineContent>
</TimelineItem>


                );
              })}
            </Timeline>



            <Box
  sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: -6, padding: 2 }}
>
  {displayedItems < history.length ? (
    <Button
      onClick={handleLoadMore}
      variant="contained"
      sx={{
        mr: 1,
        bgcolor: '#72A8FF',
        color: '#000000',
        fontSize: '24px',
        fontWeight: 'bold',
        padding: '12px 24px', // 내부 여백 증가
        minWidth: '200px', // 최소 너비 설정
        minHeight: '60px', // 최소 높이 설정
        "&:hover": {
          bgcolor: '#FFFFFF',
          color: '#72A8FF',
          borderColor: '#72A8FF',
          border: '1px solid'
        }
      }}
    >
      더보기
    </Button>
  ) : (
    history.length > itemsPerPage && (
      <Button
        onClick={handleShowLess}
        variant="contained"
        sx={{
          mr: 1,
          bgcolor: '#72A8FF',
          color: '#000000',
          fontSize: '24px',
          fontWeight: 'bold',
          padding: '12px 24px',
          minWidth: '200px',
          minHeight: '60px',
          "&:hover": {
            bgcolor: '#FFFFFF',
            color: '#72A8FF',
            borderColor: '#72A8FF',
            border: '1px solid'
          }
        }}
      >
        줄이기
      </Button>
    )
  )}
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
  <Typography variant="body1" fontSize='24px' fontWeight={'bold'} color="textSecondary" sx={{ mt: -3, mb:2}}>
    아직 책을 읽은 적이 없습니다. 
    </Typography>
    <Typography variant="body1" fontSize='24px' fontWeight={'bold'} color="textSecondary" sx={{ mb: 15 }}>
    새로운 책을 만나러 가보시겠어요?
  </Typography>
  <Button
    onClick={handleLibrary}
    variant="contained"
    color="primary"
    sx={{
      bgcolor: '#72A8FF',
      color: '#000000',
      fontSize: '24px',
      fontWeight: 'bold',
      padding: '12px 24px',
      minWidth: '200px',
      minHeight: '60px',
      "&:hover": {
        bgcolor: '#FFFFFF',
        color: '#72A8FF',
        borderColor: '#72A8FF',
        border: '1px solid'
      }
    }}
  >
    도서마당으로 이동
  </Button>
</Box>
        )}
        </CardContent>
      </Card>
    </Container>
  </Box>
  );
};

export default History;
