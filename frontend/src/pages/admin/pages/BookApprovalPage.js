import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Container,
  Paper,
  CssBaseline,
  ThemeProvider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import { useDrawer } from '../context/DrawerContext';  // 추가
import theme from "../../../theme";

import { fetchBookRequests, updateBookRequestStatus } from "../api/wishbookAPI.js";
import { formatInTimeZone } from 'date-fns-tz';

const BookApprovalPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookRequests, setBookRequests] = useState([]);
  const [error, setError] = useState(null);
  const { open, toggleDrawer } = useDrawer();  // Context 사용
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 1) {
      // 두 번째 탭 클릭 시 새 페이지로 이동
      navigate("/admin/bookapprovalhistory");
    }
  };

  const loadBookRequests = async () => {
    try {
      const data = await fetchBookRequests();
      setBookRequests(data.map((request) => ({ ...request, comment: "" })));
    } catch (err) {
      setError("도서 신청 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadBookRequests();
  }, []);

  const handleOpenDialog = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (selectedRequest) {
      const status = actionType === "approve" ? 2 : 3;
      await updateBookRequestStatus(selectedRequest.WB_SEQ, status, selectedRequest.comment);
      await loadBookRequests();
      handleCloseDialog();
    }
  };

  const handleCommentChange = (id, value) => {
    setBookRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.WB_SEQ === id ? { ...request, comment: value } : request
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />

        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            background: "linear-gradient(180deg, #FFE0B2, #FFFFFF)",
            backgroundColor: (theme) =>
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],       overflowY: "auto",  // 세로 스크롤만 필요할 때 표시
            height: "100vh",            
          }}
        >

          <Toolbar />
          <Container sx={{ height: "calc(100vh - 64px)", width : "100%", maxWidth: "none", display: "flex", flexDirection: "column", alignItems: "center", py: 4, px:4 }}>
          <Box sx={{ width: '100%', borderColor: 'divider' }}>
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered >
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>희망 도서 신청 승인</Typography>} />
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>희망 도서 승인 이력</Typography>} />
            </Tabs>
          </Box>
          <TableContainer  component={Paper}
            sx={{
              marginTop: 2,
              borderRadius: 5,
              width: '100%',
              maxHeight: "calc(100vh - 250px)", // 세로 스크롤을 위한 최대 높이
            }}
          >
<Table  stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: "25%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>도서 제목</TableCell>
                    <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>저자</TableCell>
                    <TableCell align="center" sx={{ width: "15%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>신청자 닉네임</TableCell>
                    <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>신청 날짜</TableCell>
                    <TableCell align="center" sx={{ width: "30%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>코멘트</TableCell>
                    <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>
                      상태 업데이트
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookRequests.map((request) => (
                    <TableRow key={request.WB_SEQ}>
                      <TableCell align="center">{request.WB_NAME}</TableCell>
                      <TableCell align="center">{request.WB_AUTHOR}</TableCell>
                      <TableCell align="center">{request.NICKNAME}</TableCell>
                      <TableCell align="center">{formatInTimeZone(new Date(request.WB_AplDt), 'UTC', 'yyyy.MM.dd')}</TableCell>
                      <TableCell align="center">
                        <TextField
                          value={request.comment}
                          onChange={(e) => handleCommentChange(request.WB_SEQ, e.target.value)}
                          placeholder="코멘트를 입력하세요"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog(request, "approve")}
                          >
                            승인
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenDialog(request, "reject")}
                          >
                            거절
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {error && (
              <Typography color="error" variant="body1" mt={2}>
                오류: {error}
              </Typography>
            )}
          </Container>
        </Box>

        {/* 승인/거절 확인 다이얼로그 */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogContent>
            <DialogContentText>
              {actionType === "approve"
                ? "이 도서 신청을 승인하시겠습니까?"
                : "이 도서 신청을 거절하시겠습니까?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmAction}>네</Button>
            <Button onClick={handleCloseDialog}>아니오</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default BookApprovalPage;
