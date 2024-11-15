from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text

# 공지사항 블루프린트 생성
admin_notice_bp = Blueprint('admin_notice', __name__)

# 공지사항 작성 (관리자용)
@admin_notice_bp.route('/admin/noticeWrite', methods=['POST'])
def notice_write():
    data = request.get_json()   
    user_seq = data.get('userseq')
    title = data.get('title')
    detail = data.get('detail')
    print(data, "data")
    if not all([user_seq, title, detail]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                INSERT INTO notice (USER_SEQ, NOTICE_DIV, NOTICE_TITLE, NOTICE_DETAIL, NOTICE_CrtDt)
                VALUES (:user_seq, :notice_div, :title, :detail, NOW())
            """)
            connection.execute(query, {
                'user_seq': user_seq,
                'notice_div': 1,  
                'title': title,
                'detail': detail,
            })
            connection.commit()
            return jsonify({'message': '게시글이 성공적으로 작성되었습니다.'}), 201
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500

# 최근 공지사항 조회
@admin_notice_bp.route('/admin/recent-notices', methods=['GET'])
def recent_notices():
    connection = get_db_connection()
    
    if connection:
        try:
            query = text("""
                SELECT NOTICE_SEQ, NOTICE_TITLE, NOTICE_DETAIL, NOTICE_CrtDt, USER_SEQ 
                FROM notice
                ORDER BY NOTICE_CrtDt DESC
                LIMIT 10
            """)
            result = connection.execute(query)

            # 데이터 포맷팅: tuple을 딕셔너리 형태로 변환
            notices = []
            for row in result:
                notice_dict = {
                    'NOTICE_SEQ': row[0],
                    'NOTICE_TITLE': row[1],
                    'NOTICE_DETAIL': row[2],
                    'NOTICE_CrtDt': row[3],
                    'USER_SEQ': row[4],
                }
                notices.append(notice_dict)

            return jsonify(notices), 200
            
        except Exception as e:
            print(f"Database Error: {e}")  # 구체적인 오류 메시지
            return jsonify({'error': '데이터베이스 오류'}), 500
            
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500

# 공지사항 업데이트
@admin_notice_bp.route('/admin/update-notice/<int:notice_seq>', methods=['PUT'])
def update_notice(notice_seq):
    data = request.get_json()
    title = data.get('title')
    detail = data.get('detail')

    if not all([title, detail]):
        return jsonify({'error': '모든 필드를 입력해주세요.'}), 400

    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                UPDATE notice
                SET NOTICE_TITLE = :title, NOTICE_DETAIL = :detail, NOTICE_MdfDt = NOW()
                WHERE NOTICE_SEQ = :notice_seq
            """)
            result = connection.execute(query, {
                'title': title,
                'detail': detail,
                'notice_seq': notice_seq,
            })
            connection.commit()
            if result.rowcount == 0:
                return jsonify({'error': '공지사항이 존재하지 않습니다.'}), 404
            return jsonify({'message': '공지사항이 성공적으로 수정되었습니다.'}), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500

# 공지사항 삭제
@admin_notice_bp.route('/admin/delete-notice/<int:notice_seq>', methods=['DELETE'])
def delete_notice(notice_seq):
    connection = get_db_connection()
    if connection:
        try:
            query = text("""DELETE FROM notice WHERE NOTICE_SEQ = :notice_seq""")
            result = connection.execute(query, {'notice_seq': notice_seq})
            connection.commit()
            if result.rowcount == 0:
                return jsonify({'error': '공지사항이 존재하지 않습니다.'}), 404
            return jsonify({'message': '공지사항이 성공적으로 삭제되었습니다.'}), 200
        except Exception as e:
            print(f"Database Error: {e}")
            return jsonify({'error': '데이터베이스 오류'}), 500
        finally:
            close_db_connection(connection)
    else:
        return jsonify({'error': '데이터베이스 연결 실패'}), 500