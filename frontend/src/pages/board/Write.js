import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { writeSubmit } from "../../api/boardAPI";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSuggestModify } from "../../api/boardAPI";

import Header from "../../components/Header";
import BreadCrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";

const Write = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userObject } = useAuth();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const report = location.state?.selected;
  const [notice_seq, setNotice_seq] = useState();

  // useEffect로 초기 데이터 설정
  useEffect(() => {
    if (report) {
      setTitle(report.NOTICE_TITLE);
      setDetail(report.NOTICE_DETAIL);
      setNotice_seq(report.NOTICE_SEQ);
    }
  }, [report]);

  const handlewriteSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      userseq: userObject?.USER_SEQ,
      nickname: userObject?.NICKNAME,
      title,
      detail,
    };

    if (report) {
      try {
        const message = await fetchSuggestModify(postData, notice_seq);
        console.log("서버 응답:", message);

        setTitle("");
        setDetail("");
        navigate("/board/suggest");
      } catch (error) {
        console.error("게시글 작성 실패:", error);
      }
    } else {
      try {
        const message = await writeSubmit(postData);
        console.log("서버 응답:", message);

        setTitle("");
        setDetail("");
        navigate("/board/suggest");
      } catch (error) {
        console.error("게시글 작성 실패:", error);
      }
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
      {/* Header와 BreadCrumb 포함 */}
      <Header />
      <BreadCrumb />
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
            bgcolor: "#ffe0b2",
            mb: 10,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{ mb: 4, fontSize: "36px", marginTop: "-50px" }}
            >
              {report ? "건의사항 수정" : "건의사항 작성"}
            </Typography>

            {/* 사용자 정보 표시 */}
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

            <form onSubmit={handlewriteSubmit}>
              {/* 제목 입력 */}
              <TextField
                sx={{ bgcolor: "#FFFFFF" }}
                label="제목"
                variant="outlined"
                fullWidth
                required
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* 내용 입력 */}
              <TextField
                sx={{ bgcolor: "#FFFFFF" }}
                label="내용"
                variant="outlined"
                fullWidth
                required
                bgcolor="#FFFFFF"
                multiline
                rows={8}
                margin="normal"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  align: "center",
                  mt: 5,
                  mb: -5,
                }}
              >
                {/* 작성 완료 버튼 */}
                <Button
                  type="submit"
                  variant="outlined"
                  fullWidth
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    align: "center",

                    maxWidth: 400,
                    fontWeight: "bold",
                    width: "48%",
                    fontSize: "20px",
                    color: "#000000",
                    bgcolor: "#FFB74D",
                    borderColor: "#FFB74D",
                    "&:hover": {
                      backgroundColor: "#FFB74D", // hover 시 배경색 변경
                      color: "#ffffff", // hover 시 글자색 변경
                    },
                  }}
                >
                  {report ? "수정완료" : "작성 완료"}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Write;
