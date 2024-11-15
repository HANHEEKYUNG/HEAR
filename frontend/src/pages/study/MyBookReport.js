import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container, Card, CardContent, Pagination, Rating, Button, Dialog, DialogActions, DialogContent, PaginationItem, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { fetchBookReports } from '../../api/studyAPI';
import { useAuth } from '../../context/AuthContext';
import usePagination from '../../hooks/usePagination';
import { formatInTimeZone } from 'date-fns-tz';

const MyBookReport = () => {
  const { userObject } = useAuth();
  const navigate = useNavigate();
  const [bookReports, setBookReports] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const rowsPerPage = 5;
  const { currentData, totalPages, page, handlePageChange } = usePagination(bookReports, rowsPerPage);

  useEffect(() => {
    if (userObject) {
      const getBookReports = async () => {
        try {
          const data = await fetchBookReports(userObject.USER_SEQ);
          setBookReports(data);
        } catch (error) {
          console.error("Error fetching book reports:", error);
        }
      };
      getBookReports();
    }
  }, [userObject]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleTextWrite = () => {
    setDialogOpen(false);
    navigate('/mystudy/writereport', { state: { mode: 'text' } });
  };

  const handleVoiceWrite = () => {
    setDialogOpen(false);
    navigate('/mystudy/writereport', { state: { mode: 'voice' } });
  };

  const handleRowClick = (reportId) => {
    setSelectedRow(reportId);
    navigate(`/mystudy/mybookreport/${reportId}`, { state: { reportId } });
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
        <Card component="form"  sx={{ width: 1200, margin: 'auto', mt: 5, p: 12, mb: 10, borderRadius: 5, boxShadow: 10, alignItems: "center", bgcolor: '#EAF7FF', justifyContent: "center"}}>

          <Box sx={{ mb: 4, marginTop: '-30px', }}>
            <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "36px", mb: -1 }}>
              독서노트
            </Typography>
          </Box>
          <Box sx={{ maxWidth: '92%', textAlign: 'right' }}>
            <Button variant="outlined" sx={{
              mr: 1,
              bgcolor: '#72A8FF',
              color: '#000000',
              borderColor: '#72A8FF',
              border: '1px solid',
              fontSize: '18px',
              fontWeight: 'bold',
              padding: '6px 12px',
              minWidth: '100px',
              minHeight: '30px',
              "&:hover": {
                bgcolor: '#FFFFFF',
                color: '#72A8FF',
                borderColor: '#72A8FF',
                border: '1px solid'
              }
            }} onClick={handleDialogOpen}>
              글쓰기
            </Button>
          </Box>
          <CardContent>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>입력 방식 선택</DialogTitle>
              <DialogContent>어떻게 글을 작성하시겠습니까?</DialogContent>
              <DialogActions>
                <Button onClick={handleTextWrite} sx={{color: '#72A8FF'}}>글쓰기</Button>
                <Button onClick={handleVoiceWrite} sx={{color: '#72A8FF'}}>말하기</Button>
                <Button onClick={handleDialogClose} color="secondary">취소</Button>
              </DialogActions>
            </Dialog>

            {bookReports.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="body1" color="text.secondary">
                  아직 작성된 독서노트가 없습니다...
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} sx={{ maxWidth: '90%', margin: 'auto', padding: 2, marginTop: 2 }}>
                  <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{  fontSize: "18px", fontWeight: 'bold', width: '10%' }}>번호</TableCell>
                        <TableCell align="center" sx={{  fontSize: "18px", fontWeight: 'bold',  width: '15%' }}>책 제목</TableCell>
                        <TableCell  align="center" sx={{  fontSize: "18px", fontWeight: 'bold',  width: '35%' }}>요약</TableCell>
                        <TableCell  align="center" sx={{  fontSize: "18px", fontWeight: 'bold',  width: '20%' }}>평점</TableCell>
                        <TableCell  align="center" sx={{  fontSize: "18px", fontWeight: 'bold',  width: '20%' }}>작성 날짜</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentData.map((report, index) => (
                        <TableRow 
                          key={report.REPORT_SEQ} 
                          onClick={() => handleRowClick(report.REPORT_SEQ)} 
                          tabIndex={0}
                          sx={{ 
                            backgroundColor: selectedRow === report.REPORT_SEQ ? '#e0f7fa' : 'inherit',
                            '&:hover': { backgroundColor: '#72A8FF', cursor: 'pointer' },
                            '&:focus': { backgroundColor: '#72A8FF' }
                          }}
                        >
                          <TableCell sx={{ textAlign: "center" }}>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{report.REPORT_TITLE}</TableCell>
                          <TableCell sx={{ textAlign: "left" }}>{truncateText(report.REPORT_DETAIL, 45)}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Rating value={report.RATING} readOnly />
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{formatInTimeZone(new Date(report.REPORT_CrtDt), 'UTC', 'yyyy.MM.dd')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: -10 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        sx={{
                          "&.Mui-selected": {
                            bgcolor: "#72A8FF",
                            color: "#ffffff",
                          },
                          "&:hover": {
                            bgcolor: "#72A8FF",
                            color: "#ffffff",
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default MyBookReport;
