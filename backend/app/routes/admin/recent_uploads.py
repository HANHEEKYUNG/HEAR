from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 최근 업로드 이력 블루프린트 생성
recent_uploads_bp = Blueprint('recent_uploads', __name__)

# 최근 업로드 이력을 조회하는 엔드포인트
@recent_uploads_bp.route('/admin/recent-uploads', methods=['GET'])
def get_recent_uploads():
    connection = get_db_connection()

    if connection:
        try:
            # SQL 쿼리: 주어진 쿼리로 최근 업로드 이력을 가져오는 쿼리
            query = text("""
                SELECT PRO_NAME, JSON_CrtDt, COUNT(*) as upload_count
                FROM json
                GROUP BY PRO_NAME, JSON_CrtDt
                ORDER BY JSON_CrtDt DESC
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
