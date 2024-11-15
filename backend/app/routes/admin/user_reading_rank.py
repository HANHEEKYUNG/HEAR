from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 유저 독서량 순위 블루프린트 생성
user_reading_rank_bp = Blueprint('user_reading_rank', __name__)

# 유저 독서량 순위를 조회하는 엔드포인트
@user_reading_rank_bp.route('/admin/user-reading-rank', methods=['GET'])
def get_user_reading_rank():
    connection = get_db_connection()

    if connection:
        try:
            # SQL 쿼리: 유저별 총 독서 시간을 계산하는 쿼리
            query = text("""
                SELECT u.NICKNAME, 
                       SUM(TIME_TO_SEC(HIST_EdPt)) as total_reading_seconds
                FROM user u
                LEFT JOIN history h ON u.USER_SEQ = h.USER_SEQ
                GROUP BY u.NICKNAME
                ORDER BY total_reading_seconds DESC
                LIMIT 3
            """)
            result = connection.execute(query)
            keys = result.keys()

            # 데이터 포맷팅: 딕셔너리 형태로 변환
            data = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(data), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500
