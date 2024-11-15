import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Rating, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";

import { fetchBookReportById, deleteBookReport } from "../../api/studyAPI";
import useLoading from "../../hooks/useLoading";

const BookReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const { isLoading, setIsLoading, LoadingIndicator } = useLoading();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 삭제 확인 다이얼로그 상태

  useEffect(() => {
    const getReport = async () => {
      try {
        const data = await fetchBookReportById(reportId);
        console.log('data', data);
        
        setReport(data);
      } catch (error) {
        console.error("Error fetching book report:", error);
      }
    };
    getReport();
  }, [reportId, setIsLoading]);

  const handleEdit = () => {
    navigate(`/mystudy/writereport`, { state: { mode: "voice", report } });
  };

  const handleDelete = async () => {
    try {
      await deleteBookReport(reportId); // 삭제 API 호출
      navigate('/mystudy/mybookreport'); // 삭제 후 목록 페이지로 이동
    } catch (error) {
      console.error("Error deleting book report:", error);
    } finally {
      setIsDeleteDialogOpen(false); // 다이얼로그 닫기
    }
  };

  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);

  if (isLoading || !report) return <LoadingIndicator />;

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
      
      <Container maxWidth="xl" sx={{ mt: 3, marginTop: "0px" }}>
        <Card
          sx={{
            width: 1200,
            margin: "auto",
            mt: 4,
            p: 10,
            borderRadius: 5,
            boxShadow: 10,
            bgcolor: "#EAF7FF",
            mb: 10,
          }}
        >
          <CardContent>
          <Box
                sx={{
                  mb: 4,
                  marginTop: "-50px",
                  padding: 2,
                  bgcolor: "#FFF",
                  borderRadius: 3,
                }}
              >
        <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ fontSize: "24px", mb: -1 }}
                >
              {report.REPORT_TITLE}
        </Typography>
        </Box>

        

          <Box sx={{ mt: 4 }}>

          <Box sx={{ mt: 4 }}>
<Box display= 'flex' align= 'right' justifyContent={'right'} sx={{mb: 1, gap: 1}}>


          <Typography variant="h5" sx={{fontSize: '20px'}}>
              평점 :
            </Typography>
            <Rating value={report.RATING} readOnly sx={{ fontSize: 24 }} />
            </Box>
            <Box display= 'flex' justifyContent={'right'} sx={{mb: 4, gap: 1}}>
            <Typography variant="h5" sx={{fontSize: '20px'}}>
              작성자 : {report.nickname}
            </Typography>
            </Box>
            <Typography variant="body1"  sx={{ padding: 1, bgcolor: "#FFFFFF", borderRadius: 1, fontSize: 20 }}>
              {report.REPORT_DETAIL}
            </Typography>

          </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: -4, gap: 10 }}>
            <Button variant="outlined" color="primary" onClick={handleEdit}  sx={{
        maxWidth: 400,
        fontWeight: 'bold',
        width: "60%",
        fontSize: "16px",
        color: "#72A8FF",
        bgcolor: "#FFFFFF",
        borderColor: "#72A8FF",
        "&:hover": {
          backgroundColor: "#72A8FF", // hover 시 배경색 변경
          color: "#ffffff", // hover 시 글자색 변경
        }, }}>
              수정
            </Button>
            <Button variant="outlined" color="error" onClick={openDeleteDialog}  sx={{
        maxWidth: 400,
        width: "60%",
        fontSize: "16px",
                    color: "#FF440D",
                    bgcolor: "#FFFFFF",
                    borderColor: "#FF440D",
                    "&:hover": {
                      backgroundColor: "#FF440D", // hover 시 배경색 변경
                      color: "#ffffff", // hover 시 글자색 변경
                    }, }}>
              삭제
            </Button>
          </Box>
        </CardContent>
        </Card>
      </Container>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 이 독서노트를 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} sx={{color: '#72A8FF'}}>취소</Button>
          <Button onClick={handleDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookReportDetail;
