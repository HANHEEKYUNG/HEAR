# app/routes/board/notice.py
from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

suggest_bp = Blueprint('suggest', __name__)

# 건의사항 전체 조회 (Read)
@suggest_bp.route('/suggests', methods=['GET'])
def get_all_suggests():
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 건의사항 조회 쿼리
            query = text("""
                SELECT n.NOTICE_SEQ, n.USER_SEQ, n.NOTICE_DIV, n.NOTICE_TITLE, n.NOTICE_DETAIL, 
                       n.NOTICE_CrtDt, n.NOTICE_MdfDt, u.NICKNAME
                FROM notice n
                LEFT JOIN user u ON n.USER_SEQ = u.USER_SEQ
                WHERE n.NOTICE_DIV = 2
                ORDER BY n.NOTICE_CrtDt DESC
            """)
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            suggests = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]

            return jsonify(suggests)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch suggests"}), 500

        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 작성 내용 확인
@suggest_bp.route('/suggestDetail', methods=['get'])
def suggestDetail():
    notice_seq = request.args.get('notice_seq')

    connection = get_db_connection()
    if connection:
            try:
                query = text("""
                    SELECT n.*, u.NICKNAME
                    FROM notice n
                    JOIN user u ON n.USER_SEQ = u.USER_SEQ
                    WHERE n.NOTICE_SEQ = :notice_seq;
                """)
                result = connection.execute(query, {
                   "notice_seq":notice_seq
                })
                
                data = result.fetchone()
                print( "오잉크" , data)
             
                if data:
                    data = dict(zip(result.keys(), data))
                    print("userInfo", data)
                return jsonify({"exists": True, "data": data})
  

            except Exception as db_error:
                print(f"Database operation failed: {db_error}")
                return jsonify({"error": "Failed to fetch suggest detail"}), 500
            finally:
                close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500


# 작성 글 삭제
@suggest_bp.route('/suggestDelete', methods=['get'])
def suggestDelete():
    notice_seq = request.args.get('notice_seq')

    connection = get_db_connection()
    if connection:
            try:
                query = text("""
                    DELETE FROM notice
                    WHERE notice_seq = :notice_seq; 
                """)
                connection.execute(query, {
                   "notice_seq":notice_seq
                })
                
                connection.commit()
                return jsonify({"exists": True})
  

            except Exception as db_error:
                print(f"Database operation failed: {db_error}")
                return jsonify({"error": "Failed to fetch suggest detail"}), 500
            finally:
                close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 작성 글 수정
@suggest_bp.route('/suggestModify', methods=['POST'])
def suggestModify():
    data = request.get_json()    
    notice_seq = request.args.get('notice_seq')
    title = data.get('title')
    detail = data.get('detail')

    connection = get_db_connection()
    if connection:
            try:
                query = text("""
                    UPDATE notice
                    SET NOTICE_TITLE = :title, NOTICE_DETAIL = :detail, NOTICE_MdfDt = NOW()
                    WHERE notice_seq = :notice_seq;
                """)
                connection.execute(query, {
                   "notice_seq":notice_seq,
                   "title" : title,
                   "detail" :detail,
                })
                
                connection.commit()
                return jsonify({"exists": True})
  

            except Exception as db_error:
                print(f"Database operation failed: {db_error}")
                return jsonify({"error": "Failed to fetch suggest detail"}), 500
            finally:
                close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
