import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Container, CardContent, Card  } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { useAuth } from '../../context/AuthContext';
import { fetchSuggestDetail,fetchSuggestDelete } from "../../api/boardAPI";
import { formatInTimeZone } from 'date-fns-tz';


const SuggestDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  const [report, setReport] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 삭제 확인 다이얼로그 상태
  const notice_seq = location.state.selected;

  useEffect(() => {
    console.log("selected", notice_seq);

    const getReport = async () => {
      try {
        const data = await fetchSuggestDetail(notice_seq);
        console.log('data', data.data);
        setReport(data.data);
        
      } catch (error) {
        console.error("Error fetching suggest detail report:", error);
      }
    };
    getReport();
  }, [notice_seq]);
  


  const openHandleEdit = async () => {
    try {
        const data = await fetchSuggestDelete(notice_seq); // 삭제 API 호출
        console.log(data,"답장");
        
        navigate('/board/suggest'); // 삭제 후 목록 페이지로 이동
      } catch (error) {
        console.error("Error deleting book report:", error);
      } finally {
        setIsDeleteDialogOpen(false); // 다이얼로그 닫기
      }
  };

  const handleModify = async () => {
    try {
        const data = await fetchSuggestDetail(notice_seq);
        console.log('data', data.data);
        setReport(data.data);
        navigate('/board/suggest/suggestwrite', { state: { selected : report } } )
      } catch (error) {
        console.error("Error fetching suggest detail report:", error);
      }
      
    };
   
  


  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);


if(report){
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
         sx={{ width: 1200, margin: 'auto', mt: 4, p: 10, borderRadius: 5, boxShadow: 10,  bgcolor: '#ffe0b2', mb: 10
        }}
        >
           <CardContent>
            <Box  sx={{ mb: 4, marginTop: '-50px', padding: 2, bgcolor: "#FFFAF3", borderRadius: 3}}>
          <Typography variant="h6" gutterBottom align="center" sx={{fontSize: "24px", mb: -1 }}>
          {report.NOTICE_TITLE}
          </Typography>
          </Box>
          <Typography variant="subtitle1" fontWeight="bold" align="right" gutterBottom>
          작성일: {report.NOTICE_MdfDt
                    ? formatInTimeZone(new Date(report.NOTICE_MdfDt), 'UTC', 'yyyy.MM.dd')
                    : formatInTimeZone(new Date(report.NOTICE_CrtDt), 'UTC', 'yyyy.MM.dd')}
                    <br></br>
            작성자: { report.NICKNAME }
          </Typography>

          <Box sx={{ mt: 4 }}>
            {/* <Typography variant="h6" sx={{ mb: 1 , ml: 2}}>
              제목
            </Typography>
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              {report.NOTICE_TITLE}
            </Typography> */}

            {/* <Typography variant="h6" sx={{ ml: 2, mt: 4, mb: 1 }}>
              내용
            </Typography> */}
            <Typography variant="body1" sx={{ padding: 1, bgcolor: "#FFFAF3", borderRadius: 3 }} style={{ whiteSpace: 'pre-line' }}>
              {report.NOTICE_DETAIL}
            </Typography>


          </Box>
        
          {report.USER_SEQ === userObject.USER_SEQ && (
  <Box sx={{ display: "flex", justifyContent: "center", gap: 10, mt: 6, mb: -8 }}>
    <Button
      variant="outlined"
      onClick={handleModify}
      sx={{
        maxWidth: 400,
        fontWeight: 'bold',
        width: "48%",
        fontSize: '20px',
        color: "#FFB74D",
        bgcolor:"#FFFFFF",
        borderColor: '#FFB74D',
        "&:hover": {
          backgroundColor: "#FFB74D", // hover 시 배경색 변경
          color: "#ffffff", // hover 시 글자색 변경
        }
      }}
    >
      수정
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={openDeleteDialog}
      sx={{
        maxWidth: 400,
        width: "48%",
        fontSize: '20px',
        fontWeight: 'bold',
        bgcolor: '#FFFFFF',
        borderColor: "#d32f2f", // 초기 테두리 색상
        "&:hover": {
          backgroundColor: "#d32f2f", // hover 시 배경색 변경
          color: "#ffffff", // hover 시 글자색 변경
          borderColor: "#b71c1c", // hover 시 테두리 색상 변경
        }
      }}
    >
      삭제
    </Button>
  </Box>
)}

 </CardContent>
        </Card>
      </Container>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>정말로 이 건의사항을 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">취소</Button>
          <Button onClick={openHandleEdit} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
}
export default SuggestDetail;
