import React, { useState, useEffect } from "react";
import {
  fetchBookData,
  fetchBookDelete,
} from "../api/BookAPI.js";
import {
  Box,
  Button,
  Paper,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,Tabs, Tab
} from "@mui/material";

import DrawerComponent from "../components/DrawerComponent.js";
import { useDrawer } from '../context/DrawerContext';  // 추가
import theme from "../../../theme";
import CustomAppBar from "../components/CustomAppBar.js";
import { useNavigate } from "react-router-dom";

const BookList = () => {
  const navigate = useNavigate();
  const { open, toggleDrawer } = useDrawer();  // Context 사용
  const [bookData, setBookData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [selectedBookText, setSelectedBookText] = useState("");

  const handleBookData = async () => {
    try {
      const response = await fetchBookData();
      setBookData(response);
    } catch (error) {
      console.error("도서 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleBookDelete = async (bookseq) => {
    const response = await fetchBookDelete(bookseq);
    console.log(response);
    handleBookData();
  };

  useEffect(() => {
    handleBookData();
  }, []);

  // 팝업창 열기
  const handleOpenDialog = (bookText) => {
    setSelectedBookText(bookText);
    setOpenDialog(true);
  };

  // 팝업창 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

 
const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate("/admin/bookadd");
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
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],       overflowY: "auto",  // 세로 스크롤만 필요할 때 표시
            height: "100vh",            
          }}
        >
          <Toolbar />
          <Container sx={{ height: "calc(100vh - 64px)", width: "100%", maxWidth: "none", display: "flex", flexDirection: "column", alignItems: "center", py: 4, px: 4}}>
          
          <Box sx={{ width: '100%', borderColor: 'divider' }}>  {/* border 추가 */}
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered >
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>도서 추가</Typography>} />
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>도서 목록</Typography>} />
            </Tabs>
          </Box>
          <TableContainer  component={Paper}
            sx={{
              marginTop: 2,
              borderRadius: 5,
              maxHeight: "calc(100vh - 250px)", // 세로 스크롤을 위한 최대 높이 설정
              width: '100%',
            }}
          >
            <Table  stickyHeader>
              <TableHead>
                <TableRow>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>카테고리</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>도서 이미지</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>도서 제목</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>저자</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>출판사</TableCell>
                <TableCell align="center" sx={{ width: "25%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>도서 정보</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>도서 본문</TableCell>
                <TableCell align="center" sx={{ width: "10%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>등록일</TableCell>
                <TableCell align="center" sx={{ width: "5%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59 ' }}>삭제</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {row.CATEGORY === "100"
                        ? "소설"
                        : row.CATEGORY === "200"
                        ? "시"
                        : "수필"}
                    </TableCell>            
                    <TableCell align="center">
                      <img
                        src={`/static/image/bookcover/${row.IMG_PATH}`}
                        alt={row.BOOK_NAME}
                        style={{ width: "100px", height: "auto" }}
                      />
                  
                    </TableCell>
                    <TableCell align="center">{row.BOOK_NAME}</TableCell>
                    <TableCell align="center">{row.AUTHOR}</TableCell>
                    <TableCell align="center">{row.PUBLISHER}</TableCell>
                    <TableCell align="center">{row.INFORMATION}</TableCell>
                    <TableCell align="center" sx={{ verticalAlign: "middle", padding: "8px" }}>
                      <Typography
                        variant="body2"
                        onClick={() => handleOpenDialog(row.BOOK_TEXT)}
                        sx={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          textAlign: "center",
                          display: "inline-block",
                        }}
                      >
                        본문 보기
                      </Typography>
                    </TableCell>

                    <TableCell>{row.formatted_date}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleBookDelete(row.BOOK_SEQ)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Container>
        </Box>
      </Box>

      {/* 팝업창 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>상세 내용</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{selectedBookText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
};

export default BookList;
