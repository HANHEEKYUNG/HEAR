import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import { useDrawer } from '../context/DrawerContext';  // 추가
import theme from "../../../theme";
import { fetchUploadHistory } from "../api/predictAPI.js";

const UploadHistoryPage = () => {
  const { open, toggleDrawer } = useDrawer();  // Context 사용
  const [selectedTab, setSelectedTab] = useState(1); // 기본적으로 두 번째 탭 선택
  const navigate = useNavigate();
  const [uploadHistory, setUploadHistory] = useState([]);

  useEffect(() => {
    const loadUploadHistory = async () => {
      try {
        const data = await fetchUploadHistory();
        console.log('data', data);
        
        setUploadHistory(data);
      } catch (err) {
        console.error("Error fetching upload history:", err);
      }
    };

    loadUploadHistory();
  }, []);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate("/admin/predict");
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
                theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            height: "100vh",            
          }}
        >
            <Toolbar />
            <Container sx={{ height: "calc(100vh - 64px)", minWidth: "xl", display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
              <Box sx={{ width: '100%' }}> {/* borderBottom 제거 */}
                <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
                  <Tab label={<Typography variant="h6" fontSize={'30px'} noWrap>공유 마당 데이터 업로드</Typography>} />
                  <Tab label={<Typography variant="h6" fontSize={'30px'} noWrap>공유 마당 업로드 이력</Typography>} />
                </Tabs>
              </Box>

              {/* 컨텐츠 영역 */}
              <Box mt={2} sx={{ width: '100%', flexGrow: 1 }}> {/* 스크롤 가능 설정 */}
                <TableContainer 
                  component={Paper}
                  sx={{
                    borderRadius: 5,
                    overflow: 'auto', // 테이블 내 스크롤 가능하게 설정
                    maxHeight: "calc(100vh - 200px)" // 컨테이너 최대 높이 설정으로 스크롤 활성화
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ width: "40%", fontSize: 18, fontWeight: 'bold', bgcolor: '#FFBA59' }}>업로드 날짜</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#FFBA59', width: "20%", fontSize: 18, fontWeight: 'bold' }}>파일명</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#FFBA59', width: "20%", fontSize: 18, fontWeight: 'bold' }}>상태</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#FFBA59', width: "20%", fontSize: 18, fontWeight: 'bold' }}>레코드 수</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadHistory.map((history, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">
                            {new Date(history.upload_date).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hourCycle: "h23", // 24시간 형식 사용
                              timeZone: "UTC"   // GMT 시간 기준 출력
                            })}
                          </TableCell>
                          <TableCell align="center">{history.file_name}</TableCell>
                          <TableCell align="center">{"성공"}</TableCell>
                          <TableCell align="center">{history.record_count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Container>

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default UploadHistoryPage;
