import React, { useState } from "react";
import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";
import { fetchWishbook } from "../../api/boardAPI";
import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Wishbook = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [isSuccess, setIsSuccess] = useState(false); // 메시지 상태의 유형을 구분
  const [wishbook, setWishbook] = useState({
    user_seq: userObject.USER_SEQ,
    wb_name: "",
    wb_author: "",
  });

  const handleForm = (event) => {
    const { name, value } = event.target;
    setWishbook((prevWishbook) => ({
      ...prevWishbook,
      [name]: value,
    }));
  };

  const handleWishbook = async (e) => {
    e.preventDefault();
    try {
      if (!wishbook.wb_name || !wishbook.wb_author) {
        setMessage("내용을 입력해주세요.");
        console.log("message", message);

        setIsSuccess(false);
        return;
      }
      const responseMessage = await fetchWishbook(e, wishbook);
      if (responseMessage) {
        setMessage("신청이 완료되었습니다.");
        setIsSuccess(true);
        // 페이지 이동 (예: 신청 완료 후 목록 페이지로 이동)
        setTimeout(() => navigate("/mystudy/mywishbook"), 1500);
      } else {
        setMessage("신청이 되지 않았습니다.");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("희망도서 신청 중 오류가 발생했습니다.");
      setIsSuccess(false);
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

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, marginTop: "0px" }}>
        <Card
          component="form"
          onSubmit={handleWishbook}
          sx={{
            width: 1000,
            margin: "auto",
            mt: 5,
            p: 12,
            mb: 10,
            borderRadius: 5,
            boxShadow: 10,
            alignItems: "center",
            bgcolor: "#ffe0b2",
            justifyContent: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              align="center"
              sx={{ fontSize: "36px", marginTop: "-70px" }}
              gutterBottom
            >
              희망 도서 신청
            </Typography>
            <Typography gutterBottom>
              <Box component="span" variant="subtitle1" fontWeight="bold">
                {"작성자: [   "}
              </Box>
              <Box
                component="span"
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4F2F33", fontSize: "20px" }}
              >
                {userObject?.NICKNAME}
              </Box>
              <Box component="span" variant="subtitle1" fontWeight="bold">
                {"   ]"}
              </Box>
            </Typography>
            <Box
              sx={{
                maxWidth: 700,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 4,
                mx: "auto",
              }}
            >
              <TextField
                label="책 제목"
                fullWidth
                required
                name="wb_name"
                onChange={handleForm}
                sx={{ mb: 3, bgcolor: "#FFFFFF" }}
              />

              <TextField
                label="작가"
                fullWidth
                required
                name="wb_author"
                onChange={handleForm}
                sx={{ mb: 3, bgcolor: "#FFFFFF" }}
              />

              <TextField
                label="신청 사유"
                fullWidth
                multiline
                rows={8}
                required
                sx={{ mb: 3, bgcolor: "#FFFFFF" }}
              />

              {/* 버튼 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 4,
                  mb: -7,
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  sx={{
                    maxWidth: 400,
                    fontWeight: "bold",
                    width: "48%",
                    fontSize: "20px",
                    color: "#FFB74D",
                    bgcolor: "#FFFFFF",
                    borderColor: "#FFB74D",
                    "&:hover": {
                      backgroundColor: "#FFB74D", // hover 시 배경색 변경
                      color: "#ffffff", // hover 시 글자색 변경
                    },
                  }}
                >
                  신청 완료
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    maxWidth: 400,
                    width: "48%",
                    fontSize: "20px",
                    fontWeight: "bold",
                    bgcolor: "#FFFFFF",
                    borderColor: "#d32f2f", // 초기 테두리 색상
                    "&:hover": {
                      backgroundColor: "#d32f2f", // hover 시 배경색 변경
                      color: "#ffffff", // hover 시 글자색 변경
                      borderColor: "#b71c1c", // hover 시 테두리 색상 변경
                    },
                  }}
                  onClick={() => navigate(-1)}
                >
                  취소
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
      {message && (
        <Alert
          variant="filled"
          severity={isSuccess ? "success" : "error"}
          sx={{ mb: 4 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default Wishbook;
