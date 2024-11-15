from flask import Blueprint, jsonify
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 공유마당 분류 건수 블루프린트 생성
category_counts_bp = Blueprint('category_counts', __name__)

# 분류별 건수를 조회하는 엔드포인트
@category_counts_bp.route('/admin/category-counts', methods=['GET'])
def get_category_counts():
    connection = get_db_connection()

    if connection:
        try:
            # SQL 쿼리: JSON_DIVISION 필드를 기준으로 각 분류의 데이터 건수를 가져오는 쿼리
            query = text("""
                SELECT JSON_DIVISION as category_name, COUNT(*) as count
                FROM json
                GROUP BY JSON_DIVISION
            """)
            result = connection.execute(query)
            keys = result.keys()
            
            # 데이터 포맷팅: 딕셔너리 형태로 변환
            data = [{'name': row['category_name'], 'value': row['count']} for row in [dict(zip(keys, r)) for r in result.fetchall()]]

            return jsonify(data), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500
