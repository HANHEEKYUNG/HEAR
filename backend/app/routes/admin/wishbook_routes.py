from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# wishbook 블루프린트 생성
wishbook_bp = Blueprint('wishbook', __name__)

# 1. 희망 도서 목록 조회 (관리자용)
@wishbook_bp.route('/admin/wishbooks', methods=['GET'])
def get_wishbooks():
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 희망 도서 목록 조회 쿼리 (닉네임 포함)
            query = text("""
                SELECT w.WB_SEQ, w.USER_SEQ, u.NICKNAME, w.WB_NAME, w.WB_AUTHOR, w.WB_AplDt, 
                       w.WB_APPROVAL, w.WB_REASON, w.WB_COMENT
                FROM wishbook w
                JOIN user u ON w.USER_SEQ = u.USER_SEQ
                WHERE w.WB_APPROVAL = 1
                ORDER BY w.WB_AplDt DESC
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            wishbooks = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(wishbooks)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch wish books"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 2. 희망 도서 승인 및 거절 (Update)
@wishbook_bp.route('/admin/wishbooks/<int:wishbook_id>/status', methods=['PUT'])
def update_wishbook_status(wishbook_id):
    data = request.get_json()
    status = data.get('status')
    comment = data.get('comment', '')  # 코멘트가 없으면 기본값으로 빈 문자열 설정

    # 상태 값이 유효한지 확인 (2: 승인, 3: 거절)
    if status not in [2, 3]:
        return jsonify({"error": "Invalid status value"}), 400

    connection = get_db_connection()
    if connection:
        try:
            # 희망 도서 상태 및 코멘트 업데이트 쿼리
            query = text("""
                UPDATE wishbook
                SET WB_APPROVAL = :status, WB_COMENT = :comment
                WHERE WB_SEQ = :wishbook_id
            """)
            connection.execute(query, {"status": status, "comment": comment, "wishbook_id": wishbook_id})
            connection.commit()  # 변경 사항 적용

            return jsonify({"success": True, "message": "Wish book status updated successfully"}), 200
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to update wish book status"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 3. 승인된 희망 도서 이력 조회 (관리자용)
@wishbook_bp.route('/admin/book-approval-history', methods=['GET'])
def get_book_approval_history():
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 승인된 희망 도서 이력 조회 쿼리
            query = text("""
                SELECT w.WB_SEQ, w.WB_NAME, u.NICKNAME, w.WB_APPROVAL, w.WB_AplDt, w.WB_COMENT
                FROM wishbook w
                JOIN user u ON w.USER_SEQ = u.USER_SEQ
                WHERE w.WB_APPROVAL IN (2, 3)
                ORDER BY w.WB_AplDt DESC
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            approval_history = [dict(zip(keys, row)) for row in result.fetchall()]

            return jsonify(approval_history)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch book approval history"}), 500
        finally:
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
