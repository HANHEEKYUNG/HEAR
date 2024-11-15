from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 일별 회원가입 건수 블루프린트 생성
daily_signups_bp = Blueprint('daily_signups', __name__)

# 일별 회원가입 건수를 조회하는 엔드포인트
@daily_signups_bp.route('/admin/daily-signups', methods=['GET'])
def get_daily_signups():
    connection = get_db_connection()

    if connection:
        try:
            # SQL 쿼리: 일별 회원 가입 건수를 계산하는 쿼리
            query = text("""
                SELECT DATE(USER_CrtDt) as signup_date, COUNT(*) as count
                FROM user
                WHERE USER_CrtDt >= DATE_SUB(CURDATE(), INTERVAL 5 DAY)  -- 최근 5일의 데이터만
                GROUP BY signup_date
                ORDER BY signup_date DESC
            """)
            result = connection.execute(query)
            keys = result.keys()

            # 데이터 포맷팅: 딕셔너리 형태로 변환
            data = [{'date': row['signup_date'], 'value': row['count']} for row in [dict(zip(keys, r)) for r in result.fetchall()]]

            return jsonify(data), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500
