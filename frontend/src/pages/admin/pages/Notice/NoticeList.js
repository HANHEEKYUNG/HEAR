import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CustomAppBar from "../../components/CustomAppBar.js";
import DrawerComponent from "../../components/DrawerComponent.js";
import { useDrawer } from "../../context/DrawerContext"; // 추가
import theme from "../../../../theme.js";
import { fetchRecentNotices, deleteNotice } from "../../api/NoticeAPI.js"; // deleteNotice 함수 임포트
import NoticeWriteModal from "./NoticeWriteModal.js";
import NoticeUpdateModal from "./NoticeUpdateModal.js"; // 업데이트 모달 임포트
import { formatInTimeZone } from "date-fns-tz";

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const { open, toggleDrawer } = useDrawer(); // Context 사용
  const [openWriteModal, setOpenWriteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false); // 업데이트 모달 상태
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 삭제 다이얼로그 상태
  const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항

  const getNotices = async () => {
    try {
      const result = await fetchRecentNotices();
      setNotices(result);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    getNotices();
  }, []);

  const handleOpenWriteModal = () => {
    setOpenWriteModal(true);
  };

  const handleCloseWriteModal = () => {
    setOpenWriteModal(false);
  };

  const handleOpenUpdateModal = (notice) => {
    setSelectedNotice(notice);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedNotice(null);
    setOpenUpdateModal(false);
  };

  const handleSuccessWrite = () => {
    getNotices(); // 글쓰기 성공 시 목록 새로고침
  };

  const handleSuccessUpdate = () => {
    getNotices(); // 업데이트 성공 시 목록 새로고침
  };

  // 삭제 다이얼로그 핸들러
  const handleOpenDeleteDialog = (notice) => {
    setSelectedNotice(notice);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedNotice(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteNotice = async () => {
    try {
      await deleteNotice(selectedNotice.NOTICE_SEQ); // 선택된 공지사항 삭제
      getNotices(); // 목록 새로고침
      handleCloseDeleteDialog(); // 다이얼로그 닫기
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
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
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            overflowY: "auto", // 세로 스크롤만 필요할 때 표시
            height: "100vh",
          }}
        >
          <Toolbar />
          <Container
            sx={{
              height: "calc(100vh - 64px)",
              width: "100%",
              maxWidth: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
              px: 4,
            }}
          >
            <Box sx={{ 
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {/* 가운데에 고정된 공지사항 목록 */}
              <Typography 
                variant="h6" 
                fontSize={'30px'} 
                sx={{ 
                  textAlign: 'center',
                  mb: 2
                }}
              >
                공지사항 목록
              </Typography>

              {/* 오른쪽에 배치된 글쓰기 버튼 */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                width: '100%',
                mb: 2
              }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenWriteModal}
                  sx={{
                    fontSize: '16px', 
                    fontWeight: 'bold'
                  }}
                >
                  글쓰기
                </Button>
              </Box>
            </Box>

            <Box mt={2}></Box>
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                borderRadius: 5,
                maxHeight: "calc(100vh - 250px)", // 세로 스크롤을 위한 최대 높이
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{
                        width: "40%",
                        fontSize: 18,
                        fontWeight: "bold",
                        bgcolor: "#FFBA59 ",
                      }}
                    >
                      제목
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "20%",
                        fontSize: 18,
                        fontWeight: "bold",
                        bgcolor: "#FFBA59 ",
                      }}
                    >
                      작성일
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "15%",
                        fontSize: 18,
                        fontWeight: "bold",
                        bgcolor: "#FFBA59 ",
                      }}
                    >
                      작성자
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "25%",
                        fontSize: 18,
                        fontWeight: "bold",
                        bgcolor: "#FFBA59 ",
                      }}
                    >
                      액션
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notices.map((notice, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">
                        {notice.NOTICE_TITLE}
                      </TableCell>
                      <TableCell align="center">
                        {formatInTimeZone(
                          new Date(notice.NOTICE_CrtDt),
                          "UTC",
                          "yyyy.MM.dd"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {notice.NICKNAME || "관리자"}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                          }}
                        >
                          {" "}
                          {/* justifyContent: "center" 추가 */}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenUpdateModal(notice)}
                          >
                            수정
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(notice)}
                          >
                            삭제
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Box>
      </Box>
      <NoticeWriteModal
        open={openWriteModal}
        onClose={handleCloseWriteModal}
        onSuccess={handleSuccessWrite}
      />
      <NoticeUpdateModal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        notice={selectedNotice}
        onSuccess={handleSuccessUpdate}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            정말로 이 공지사항을 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            아니요
          </Button>
          <Button onClick={handleDeleteNotice} color="error">
            네, 삭제합니다.
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default NoticeList;
