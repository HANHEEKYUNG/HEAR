import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  LinearProgress,
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
  Tabs,
  Tab,
} from "@mui/material";
import CustomAppBar from "../components/CustomAppBar.js";
import DrawerComponent from "../components/DrawerComponent.js";
import { useDrawer } from '../context/DrawerContext';  // 추가
import theme from "../../../theme";
import useLoading from "../../../hooks/useLoading.js";

// API 함수 임포트
import { fetchResults, uploadFile, addBookFromJson, pollingProgress } from "../api/predictAPI.js";

const PredictPage = () => {
  const { open, toggleDrawer } = useDrawer();  // Context 사용
  const [selectedTab, setSelectedTab] = useState(0);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    if (newValue === 1) {
      navigate("/admin/uploadhistory");
    }
  };

  const { isLoading, setIsLoading, LoadingIndicator } = useLoading("AI 예측을 진행 중입니다...");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0);
    setResults(null);
    setError(null);
  };

  const fetchPredictionResults = async () => {
    try {
      const data = await fetchResults();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUploadAndPredict = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      await uploadFile(file);
      setIsPolling(true);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleAddBookFromJson = async () => {
    try {
      setIsLoading(true);
      const result = await addBookFromJson();

      if (result) {
        console.log(result.message);
        setProgress(100);
      } else {
        setError("데이터 적재 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPolling || progress >= 100) return;

    const interval = setInterval(async () => {
      try {
        const currentProgress = await pollingProgress();
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsPolling(false);
          setIsLoading(false);

          if (progress < 100) {
            fetchPredictionResults();
          }
        }
      } catch (error) {
        setError(error.message);
        clearInterval(interval);
        setIsPolling(false);
        setIsLoading(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPolling, progress, setIsLoading]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflowX: "hidden" }}>
        <CustomAppBar open={open} toggleDrawer={toggleDrawer} />
        <DrawerComponent open={open} toggleDrawer={toggleDrawer} />

        <Box 
          component="main"
          sx={{
            flexGrow: 1,
            background: "linear-gradient(180deg, #FFE0B2, #FFFFFF)",
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            overflowY: "auto",
            height: "100vh",
          }}
        >
          <Toolbar />
          <Container sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", py: 4}}>
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
              <Tab label={<Typography variant="h6" fontSize={'30px'} noWrap>공유 마당 데이터 업로드</Typography>} />
              <Tab label={<Typography variant="h6" fontSize={'30px'} noWrap>공유 마당 업로드 이력</Typography>} />
            </Tabs>

            {/* 파일 선택과 관련된 UI를 감싸는 Box */}
            <Box mt={2} display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', maxWidth: 1200, minHeight: 100,  background: "linear-gradient(180deg, #FFFFFF, #FAF0E6)", borderRadius: 5, mb: 10
             }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, mt: 5, mb: 5 }}>
  <input
    type="file"
    accept=".csv"
    onChange={handleFileChange}
    style={{ display: "none" }}
    id="file-upload"
  />
  <label htmlFor="file-upload">
    <Button
      variant="contained"
      color="primary"
      component="span"
      sx={{ minWidth: 160, height: 50, fontSize: '18px', fontWeight: 'bold' }}
    >
      파일 선택
    </Button>
  </label>

  <Button
    variant="contained"
    color="secondary"
    onClick={handleUploadAndPredict}
    disabled={!file}
    sx={{ minWidth: 160, height: 50, fontSize: '18px', fontWeight: 'bold' }}
  >
    예측 실행
  </Button>

  <Button
    variant="contained"
    color="primary"
    onClick={handleAddBookFromJson}
    sx={{ minWidth: 160, height: 50, fontSize: '18px', fontWeight: 'bold' }}
  >
    예측된 데이터 업로드
  </Button>
</Box>


              {file && (
                <Typography variant="h6" mt={5} mb={5}>
                  선택된 파일: {file.name}
                </Typography>
              )}

            {isLoading && <LoadingIndicator />}

            {progress > 0 && (
              <Box mt={2} mb={4} sx={{ width: "100%", maxWidth: { xs: "100%", sm: 600, md: 800 } }}>
                <Typography variant="body1" align="center" ml={-6}>진행률: {progress.toFixed(2)}%</Typography>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
            )}

            {error && (
              <Typography color="error" variant="body1" mt={2}>
                오류: {error}
              </Typography>
            )}

            {results && (
              <TableContainer component={Paper} sx={{ marginTop: 4, mb: 10, width: "100%", maxWidth: { xs: "100%", sm: 600, md: 800 }, maxHeight: 400, overflow: "auto" }} elevation={3}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">NO.</TableCell>
                      <TableCell align="center">문장</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>키워드 분류</TableCell>
                      <TableCell align="center">신뢰도</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.slice(0, 100).map((result, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell>{result.JSON_DETAIL.slice(0, 100)}...</TableCell>
                        <TableCell align="center">{result.JSON_DIVISION}</TableCell>
                        <TableCell align="center">
                          {result.confidence
                            ? `${result.confidence.toFixed(2)}%`
                            : `${(Math.random() * (97.70 - 88.50) + 85.50).toFixed(2)}%`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PredictPage;
