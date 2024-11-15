from dotenv import load_dotenv
import os
from pathlib import Path

# 프로젝트 루트 경로에 있는 .env 파일 로드
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    # Flask 기본 설정
    DEBUG = os.getenv('DEBUG', True)
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')

    # CORS 설정
    CORS_HEADERS = 'Content-Type'

    # MySQL 설정 (.env 파일에서 불러옴)
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_NAME = os.getenv('DB_NAME')

    # elevenLabs api key
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")