import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../context/AuthContext"; // AuthContext에서 useAuth 가져오기
import Header from '../../components/Header';
import Breadcrumb from '../../components/BreadCrumb';
import ProfileSection from '../../components/ProfileSection';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container,CardContent, Chip, Box, Card, Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchWishBooks, cancelWishBook } from '../../api/studyAPI';
import { formatInTimeZone } from 'date-fns-tz';

const approvalStatus = {
  1: { label: '대기', color: 'default' },
  2: { label: '승인', color: 'success' },
  3: { label: '승인거절', color: 'error' }
};

const MyWishBook = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  
  const [wishBooks, setWishBooks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWishBook, setSelectedWishBook] = useState(null);

  const loadWishBooks = useCallback(async () => {
    if (!userObject) return; // userObject가 없으면 실행하지 않음
    try {
      const userSeq = userObject.USER_SEQ;
      const data = await fetchWishBooks(userSeq);
      setWishBooks(data);
    } catch (error) {
      console.error("Error fetching wish books:", error);
    }
  }, [userObject]);

  useEffect(() => {
    loadWishBooks();
  }, [loadWishBooks]);

  const handleOpenDialog = (wishBookId) => {
    setSelectedWishBook(wishBookId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWishBook(null);
  };

  const handleCancelWishBook = async () => {
    if (!selectedWishBook) return;
    try {
      await cancelWishBook(selectedWishBook);
      handleCloseDialog();
      loadWishBooks(); // 삭제 후 새로고침
    } catch (error) {
      console.error("Error cancelling wish book:", error);
    }
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
 <Card component="form"  sx={{ width: 1200, margin: 'auto', mt: 5, p: 12, mb: 10, borderRadius: 5, boxShadow: 10, alignItems: "center", bgcolor: '#EAF7FF',
          justifyContent: "center"}}>

<Box sx={{ mb: 4, marginTop: '-30px', }}>
       <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "36px", mb: -1 }}>
          희망 도서 신청 목록
        </Typography>
        </Box>

        <CardContent>
        {wishBooks.map((book, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
              <Box display="flex" alignItems="center" width="100%" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontSize: 20 }}>{book.WB_NAME}</Typography>
                  <Typography variant="body2" color="textSecondary">{book.WB_AUTHOR}</Typography>
                </Box>
                <Chip
                  label={approvalStatus[book.WB_APPROVAL].label}
                  color={approvalStatus[book.WB_APPROVAL].color}
                  style={{ marginLeft: '10px' }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>신청 날짜: {formatInTimeZone(new Date(book.WB_AplDt), 'UTC', 'yyyy.MM.dd')}</Typography>
              {book.WB_APPROVAL >= 2 && (
                <>
                  {book.WB_DelDt && (
                    <Typography>처리 일자: {formatInTimeZone(new Date(book.WB_DelDt), 'UTC', 'yyyy.MM.dd')}</Typography>
                  )}
                  {book.WB_COMENT && (
                    <Typography>처리 내용: {book.WB_COMENT}</Typography>
                  )}
                </>
              )}
              {book.WB_APPROVAL === '1' && (
                <Box display="flex" justifyContent="flex-end" marginTop="10px">
                  <Button variant="outlined" color="error" onClick={() => handleOpenDialog(book.WB_SEQ)}>
                    취소
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>정말로 신청을 취소하시겠습니까?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelWishBook} sx={{color: '#72A8FF'}}>네</Button>
            <Button onClick={handleCloseDialog} color="secondary">아니오</Button>
          </DialogActions>
        </Dialog>
        </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default MyWishBook;
