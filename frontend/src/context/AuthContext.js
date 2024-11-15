import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userObject, setUserObject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider 호출');
  

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        console.log('Decoded User:', decodedUser); // 디코딩 결과 확인

        // 기존 코드 호환을 위해 userObject 형태 유지
        setUserObject({
          USER_SEQ: decodedUser.USER_SEQ,
          USER_ID: decodedUser.USER_ID,
          NICKNAME: decodedUser.NICKNAME,
          EL_ID: decodedUser.EL_ID,
          SPEED: decodedUser.SPEED,
          is_admin: decodedUser.is_admin,
          USER_CrtDt : decodedUser.USER_CrtDt
        });
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }

    setIsLoading(false); // 로딩 상태 해제
  }, []);

  const isAdmin = userObject?.is_admin ?? false;

  return (
    <AuthContext.Provider value={{ userObject, setUserObject, isAdmin, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
