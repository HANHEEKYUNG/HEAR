# Python 3.11 이미지를 사용하여 컨테이너 생성
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# FFmpeg 설치
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 필요한 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# PYTHONPATH 설정
ENV PYTHONPATH=/app

# Flask 서버가 실행될 포트 지정
EXPOSE 5000

# Flask 서버 실행 명령
ENV FLASK_APP=app.app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--reload"]
