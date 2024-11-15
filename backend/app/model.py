from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from .config import Config

# SQLAlchemy 엔진을 사용해 연결 풀 설정
engine = create_engine(
    f"mysql+pymysql://{Config.DB_USER}:{Config.DB_PASSWORD}@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}",
    poolclass=QueuePool,
    pool_size=5,  # 최대 연결 개수
    max_overflow=10,  # 풀을 초과할 때 더 만들 수 있는 연결 수
    pool_timeout=30,  # 연결을 기다리는 시간
    pool_recycle=540,  # 540초마다 연결을 재활용 (세션 유지)
    pool_pre_ping=True,   # 연결 상태 확인 (연결 끊김 방지)
    echo=True  # SQLAlchemy의 로그 출력을 활성화
)

def get_db_connection():
    try:
        # 풀에서 연결을 가져옴
        connection = engine.connect()
        return connection
    except Exception as err:
        print(f"Database connection error: {err}")
        return None

def close_db_connection(connection):
    if connection:
        try:
            connection.close()  # 풀에 연결 반환
        except Exception as err:
            print(f"Error closing the connection: {err}")