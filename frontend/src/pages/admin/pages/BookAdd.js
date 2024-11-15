import React, { useState } from "react";
import {
  fetchBookAdd,
} from "../api/BookAPI.js";
import {
  Box,
  Button,
  TextField,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  Typography,
  Grid,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Tabs, Tab
} from "@mui/material";

import DrawerComponent from "../components/DrawerComponent.js";
import { useDrawer } from '../context/DrawerContext';  // 추가
import theme from "../../../theme";
import CustomAppBar from "../components/CustomAppBar.js";
import { useNavigate } from "react-router-dom";

const BookAdd = () => {
  const navigate = useNavigate();
  const { open, toggleDrawer } = useDrawer();  // Context 사용
  const [selectedTab, setSelectedTab] = useState(0);

  const [filename, setFilename] = useState("");
  const [bookAdd, setBookAdd] = useState({
    category: "",
    img: null, // img를 null로 초기화
    title: "",
    author: "",
    publisher: "",
    information: "",
    text: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookAdd((prevBookAdd) => {
      return { ...prevBookAdd, [name]: value };
    });
  };

  const handleBookAdd = async () => {
    // 서버로 데이터 전송 시 img 파일 객체를 포함해야 합니다.
    const formData = new FormData();
    formData.append("category", bookAdd.category);
    formData.append("img", bookAdd.img); // 파일 객체를 추가
    formData.append("title", bookAdd.title);
    formData.append("author", bookAdd.author);
    formData.append("publisher", bookAdd.publisher);
    formData.append("information", bookAdd.information);
    formData.append("text", bookAdd.text); // 파일 객체를 추가
 
    await fetchBookAdd(formData);
    setBookAdd({
      category: "",
      img: null,
      title: "",
      author: "",
      publisher: "",
      information: "",
      text: "",
    });
    setFilename("");
   
  };



  const handleFileInputChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    
    if (file) {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result; // 파일 내용을 얻음
      console.log(fileContent); // 파일 내용을 출력
      
      if (name === "text") {
        setFilename(file.name);
        setBookAdd((prevBookAdd) => ({
          ...prevBookAdd,
          text: fileContent, // 파일 내용을 상태로 저장
        }));
      } else if (name === "img") {
        setBookAdd((prevBookAdd) => ({
          ...prevBookAdd,
          img: file, // 이미지 파일 객체로 저장
        }));
      }
    };

    reader.readAsText(file, "UTF-8"); // 파일 객체를 읽음
  }

  // 파일 입력 초기화 (같은 파일을 선택해도 onChange가 작동하도록 하기 위함)
  e.target.value = "";
};

const handleTabChange = (newValue) => {
  setSelectedTab(newValue);
  if (newValue === 1) {
    // 두 번째 탭 클릭 시 업로드 이력 페이지로 이동
    navigate("/admin/booklist");
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
            overflowY: "scroll",  // 세로 스크롤만 필요할 때 표시
            height: "100vh",
            paddingBottom: "2rem"  // 하단 패딩 추가
          }}
        >
          <Toolbar />
          <Container sx={{ minHeight: "calc(100vh - 64px)", maxWidth: "xl", display: "flex", flexDirection: "column", alignItems: "center", py: 4, pb: 8}}>
          <Box sx={{ width: '100%', borderColor: 'divider' }}>  {/* Tabs 컨테이너에 border 추가 */}
            <Tabs value={selectedTab} onChange={(_, newValue) => handleTabChange(newValue)} centered>
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>도서 추가</Typography>} />
              <Tab label={<Typography variant="h6" fontSize={'30px'}  noWrap>도서 목록</Typography>} />
            </Tabs>
          </Box>

            <Box mt={2} display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', maxWidth: 1200, height: 'auto', background: "linear-gradient(180deg, #FFFFFF, #FAF0E6)", borderRadius: 5, boxShadow: 10, py: 4, mb: 8 }}>
  <Grid mt={3} container spacing={4} justifyContent="center">
    {/* 카테고리 선택 */}
    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
      <FormControl sx={{ width: 600, bgcolor: '#FFFFFF' }}> {/* 너비 고정 및 중앙 정렬 */}
        <InputLabel id="category-label">카테고리</InputLabel>
        <Select
          labelId="category-label"
          name="category"
          value={bookAdd.category}
          onChange={handleInputChange}
          label="카테고리"
        >
          <MenuItem value="100">100</MenuItem>
          <MenuItem value="200">200</MenuItem>
          <MenuItem value="300">300</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    {/* 도서 정보 입력 */}
    {["title", "author", "publisher", "information"].map((field) => (
      <Grid item xs={12} key={field} sx={{ display: "flex", justifyContent: "center"}}>
        <TextField
          fullWidth
          name={field}
          value={bookAdd[field]}
          onChange={handleInputChange}
          label={field === "title" ? "도서 제목" : field === "author" ? "작가" : field === "publisher" ? "출판사" : "정보"}
          sx={{ width: 600, bgcolor: '#FFFFFF' }} 
        />
      </Grid>
    ))}
  </Grid>

  {/* 파일명 표시와 파일 선택 버튼들 */}
<Box mt={4} sx={{ display: "flex", justifyContent: "center", gap: 20, alignItems: "center" }}>
  <Box sx={{ textAlign: "center" }}>
    <Typography sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {bookAdd.img ? `이미지 파일: ${bookAdd.img.name}` : "이미지 파일 없음"}
    </Typography>
    <Button variant="contained" component="label" color="primary" sx={{ minWidth: 150, height: 50, fontSize: '16px', fontWeight: 'bold' }}>
      이미지파일
      <input
        type="file"
        hidden
        name="img"
        onChange={handleFileInputChange}
      />
    </Button>
  </Box>

  <Box sx={{ textAlign: "center" }}>
    <Typography sx={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {filename ? `본문 파일: ${filename}` : "본문 파일 없음"}
    </Typography>
    <Button variant="contained" component="label" color="primary" sx={{ minWidth: 150, height: 50, fontSize: '16px', fontWeight: 'bold' }}>
      본문파일
      <input
        type="file"
        accept=".txt"
        hidden
        name="text"
        onChange={handleFileInputChange}
      />
    </Button>
  </Box>
</Box>

{/* 추가 및 초기화 버튼들 가로 정렬 */}
<Box mt={4} sx={{ display: "flex", justifyContent: "center", gap: 20 }}>
  <Button variant="contained" color="primary" onClick={handleBookAdd} sx={{ minWidth: 150, height: 50, fontSize: '16px', fontWeight: 'bold' }}>
    추가
  </Button>
  <Button variant="outlined" color="secondary" onClick={() => setBookAdd({
    category: "",
    img: null,
    title: "",
    author: "",
    publisher: "",
    information: "",
    text: null,
  })} sx={{ minWidth: 150, height: 50, fontSize: '16px', fontWeight: 'bold' }}>
    초기화
  </Button>
</Box>
</Box>





          </Container>
        </Box>
      </Box>

      

    </ThemeProvider>
  );
};

export default BookAdd;
