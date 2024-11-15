import React, { useState, useEffect } from "react";
import { Typography, Container, Box, Button, TextField, Alert, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userModify, checkNickName } from "../../api/userAPI";

import Header from "../../components/Header";
import Breadcrumb from "../../components/BreadCrumb";
import ProfileSection from "../../components/ProfileSection";

const SettingUser = () => {
  const navigate = useNavigate();
  const { userObject, setUserObject } = useAuth();

  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [formData, setFormData] = useState({
    id: userObject?.USER_ID || "",
    pw: "",
    pwok: "",
    nickName: userObject?.NICKNAME || "",
  });
  const [alertMessage, setAlertMessage] = useState("");

  const handleCheckNickName = async () => {
    try {
      if (!formData.nickName) {
        setMessage("닉네임을 입력해주세요");
        return;
      }

      const isNicknameTaken = await checkNickName(formData.nickName);
      setMessage(isNicknameTaken ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
    } catch {
      setMessage("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.pw && formData.pwok) {
      setPwMessage(
        formData.pw === formData.pwok ? "패스워드가 일치합니다." : "패스워드가 일치하지 않습니다."
      );
    } else {
      setPwMessage("");
    }
  }, [formData.pw, formData.pwok]);

  const handleUserModify = async () => {
    try {
      if (formData.pw !== formData.pwok) {
        setMessage("비밀번호가 일치하지 않습니다.");
        return;
      } else if (!formData.pw || !formData.pwok) {
        setPwMessage("패스워드 또는 패스워드 확인을 입력해주세요.");
        return;
      }
      if (message === "사용 가능한 닉네임입니다.") {
        const response = await userModify(formData);
        if (response.success) {
          const updatedUserInfo = {
            ...userObject,
            USER_PW: formData.pw,
            NICKNAME: formData.nickName,
          };

          setUserObject(updatedUserInfo);
          setAlertMessage("회원정보 수정이 완료되었습니다.");
          setTimeout(() => {
            setAlertMessage(null);
          }, 1000);
        }
      } else {
        setAlertMessage("다시 한 번 확인해주세요.");
        setTimeout(() => {
          setAlertMessage(null);
        }, 1000);
      }
    } catch (error) {
      setMessage("사용자 정보 수정 중 오류가 발생했습니다.");
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

      <Container sx={{ mt: 10, marginTop: '50px' }}> {/* 전체 너비 유지 */}
  <Card sx={{ width: '85%', margin: 'auto', p: 7, borderRadius: 5, boxShadow: 10, bgcolor: '#FFF2ED' }}> 
    <Typography variant="h6" sx={{fontSize: "36px", mb: 3,  textAlign: "center" }}>
      회원정보 수정
    </Typography>
    
  <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center", width: '100%' }}> {/* 텍스트 필드 간격 및 가운데 정렬 */}
  <TextField label="아이디" variant="outlined" value={formData.id} disabled sx={{ width: '100%', maxWidth: 400, bgcolor: "#FFFFFF" }} />
  <TextField label="비밀번호" variant="outlined" type="password" name="pw" onChange={handleChange} sx={{ width: '100%', maxWidth: 400, bgcolor: "#FFFFFF" }} />
  <TextField label="비밀번호 확인" variant="outlined" type="password" name="pwok" onChange={handleChange} sx={{ width: '100%', maxWidth: 400, bgcolor: "#FFFFFF" }} />

  {pwMessage && (
    <Typography sx={{ color: pwMessage.includes("일치합니다") ? "green" : "red", textAlign: "center" }}>
      {pwMessage}
    </Typography>
  )}

  <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: '100%', maxWidth: 400 }}> {/* 닉네임과 버튼 간격 조정 */}
    <TextField
      label="닉네임"
      variant="outlined"
      name="nickName"
      value={formData.nickName}
      onChange={handleChange}
      sx={{ flexGrow: 1, bgcolor: "#FFFFFF" }} 
    />
    <Button
      onClick={handleCheckNickName}
      variant="contained"
      size="small"
      sx={{
        minWidth: 100,
        fontWeight: "bold",
        fontSize: "16px",
        bgcolor: "#FF8888",
        color: "#000000",
        "&:hover": {
          bgcolor: "#FFFFFF",
          color: "#FF8888",
          borderColor: "#FF8888",
        },
      }}
    >
      중복확인
    </Button>
  </Box>


      {message && (
        <Typography sx={{ color: message.includes("가능") ? "green" : "red", textAlign: "center" }}>
          {message}
        </Typography>
      )}
    </Box>

    <Box sx={{ display: "flex", justifyContent: "center", gap: 10, mt: 4}}>
      <Button
        variant="contained"
        onClick={handleUserModify}
        sx={{
          minWidth: 120,
          fontWeight: "bold",
          fontSize: "16px",
          bgcolor: "#FF8888",
          color: "#000000",
          "&:hover": { bgcolor: "#FFFFFF", color: "#FF8888", borderColor: "#FF8888" },
        }}
      >
        저장하기
      </Button>
      <Button
        variant="outlined"
        onClick={() => navigate("/setting")}
        sx={{
          minWidth: 120,
          fontWeight: "bold",
          fontSize: "16px",
          bgcolor: "#FFFFFF",
          color: "#FF8888",
          "&:hover": { bgcolor: "#FF8888", color: "#FFFFFF", borderColor: "#FFFFFF" },
        }}
      >
        취소
      </Button>
    </Box>
  </Card>
</Container>


      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {alertMessage && (
          <Alert
            variant="filled"
            severity={(() => {
              if (alertMessage.includes("완료")) return "success";
              if (alertMessage.includes("확인") || alertMessage.includes("오류")) return "error";
              return "info";
            })()}
            sx={{ mb: 4, width: "50%" }}
          >
            {alertMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default SettingUser;
