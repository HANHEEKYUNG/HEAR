# Node.js 이미지 사용
FROM node:20-slim

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json만 복사하여 의존성만 설치 (캐시 활용)
COPY package*.json ./
RUN npm install --no-cache

# 소스 복사 및 패키치 설치
COPY . .

# 환경 변수 설정
ENV NODE_OPTIONS=--no-deprecation

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "start"]
