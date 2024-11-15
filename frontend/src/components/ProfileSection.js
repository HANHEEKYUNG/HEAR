import React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import { useAuth } from "../context/AuthContext"; // AuthContext 사용


const ProfileSection = () => {
  const { userObject } = useAuth(); // 전역 사용자 정보 가져오기

  if (!userObject) {
    return null; // 사용자 정보가 없으면 아무것도 렌더링하지 않음
  }

  const { NICKNAME: nickName, USER_CrtDt: userCrtDt } = userObject;
  const userDate = new Date(userCrtDt);

  const formattedDate = `${userDate.getUTCFullYear()}.${String(userDate.getUTCMonth() + 1).padStart(2, '0')}.${String(userDate.getUTCDate()).padStart(2, '0')}`;

  const today = new Date();
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const userDateUTC = Date.UTC(userDate.getUTCFullYear(), userDate.getUTCMonth(), userDate.getUTCDate());
  const dayDifference = Math.ceil((todayUTC - userDateUTC) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Box
      py={2} px={2} display="flex" alignItems="center" justifyContent="left" position="relative"
      bgcolor="rgb(247, 247, 247)"
    >
      <Avatar
        sx={{ width: 80, height: 80, bgcolor: '#999999', mr: 2, marginLeft: 33, zIndex: 2 }} // 다크 그레이
        alt="Profile"
      />
      <Box sx={{ zIndex: 2 }}>
        <Typography variant="body3" color="#000000">{nickName}</Typography> 
        <Box component="span" sx={{ variant: "body2", color: "#000000" }}>
          {'님'}
        </Box>
        <Typography variant="body2" color="#000000">인증 완료</Typography> {/* 인증 상태 */}
        <Typography variant="body2" color="#000000">
          {formattedDate}부터 {dayDifference}일간 함께 듣는 중
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileSection;