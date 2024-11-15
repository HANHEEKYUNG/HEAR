import os
from flask import Blueprint, jsonify, request, send_from_directory
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import timedelta, time

highlight_bp = Blueprint('highlights', __name__)
AUDIO_FOLDER = os.path.abspath('app/static/audio/highlight')  # 절대 경로 설정

# timedelta 및 time 객체를 문자열로 변환하는 함수
def convert_special_types_to_str(highlights):
    for highlight in highlights:
        for key, value in highlight.items():
            if isinstance(value, timedelta) or isinstance(value, time):
                highlight[key] = str(value)  # timedelta 및 time 객체를 문자열로 변환
    return highlights

# Highlight 전체 조회 (Read)
@highlight_bp.route('/highlights', methods=['GET'])
def get_all_highlights():
    # 프론트에서 전달된 userSeq 파라미터 받기
    user_seq = request.args.get('userSeq', type=int)

    if user_seq is None:
        return jsonify({"error": "userSeq parameter is required"}), 400

    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # 특정 사용자의 Highlight와 관련 도서 정보 조회 쿼리
            query = text("""
                SELECT 
                    h.HL_SEQ, h.USER_SEQ, h.BOOK_SEQ, h.HL_IMGPATH, h.HL_COMMENT, 
                    h.HL_StPt, h.HL_EdPt, h.HL_CrtDt, h.HL_MdfDt, h.HL_PATH,
                    TIMEDIFF(h.HL_EdPt, h.HL_StPt) AS HL_Duration,
                    b.BOOK_NAME, b.AUTHOR, b.PUBLISHER, b.FULL_PATH, b.SUM_PATH, b.IMG_PATH,
                    b.CATEGORY, b.INFORMATION, b.RUN_TIME, b.SUM_TIME
                FROM highlight h
                LEFT JOIN book b ON h.BOOK_SEQ = b.BOOK_SEQ
                WHERE h.USER_SEQ = :user_seq
            """)
            result = connection.execute(query, {"user_seq": user_seq})
            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            highlights = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]
            # timedelta 및 time 객체를 문자열로 변환
            highlights = convert_special_types_to_str(highlights)
            return jsonify(highlights)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch highlights"}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500

# 특정 Highlight의 오디오 파일 제공 (Read)
@highlight_bp.route('/highlight/audio/<int:highlight_id>', methods=['GET'])
def get_highlight_audio(highlight_id):
    # DB에서 highlight_id에 맞는 파일명을 조회
    connection = get_db_connection()
    result = connection.execute(text("SELECT HL_PATH FROM highlight WHERE HL_SEQ = :highlight_id"), {"highlight_id": highlight_id})
    file_info = result.fetchone()
    connection.close()

    if file_info and file_info[0]:  # file_info[0]을 사용해 HL_PATH에 접근
        audio_path = file_info[0]
        
        # 로그 출력: AUDIO_FOLDER와 audio_path 결합
        print(f"AUDIO_FOLDER: {AUDIO_FOLDER}")
        print(f"audio_path: {audio_path}")
        full_audio_path = os.path.join(AUDIO_FOLDER, audio_path)
        print(f"Full path to audio file: {full_audio_path}")  # 전체 경로 출력
        
        # send_from_directory 호출
        return send_from_directory(AUDIO_FOLDER, audio_path)
    else:
        print(f"Audio file not found for highlight_id: {highlight_id}")  # 로그 출력 추가
        return jsonify({"error": "Audio file not found"}), 404


# 특정 Highlight의 코멘트 수정 (Update)
@highlight_bp.route('/highlight/comment/<int:highlight_id>', methods=['PUT'])
def update_highlight_comment(highlight_id):
    data = request.get_json()
    comment = data.get('comment')

    if not comment:
        return jsonify({"error": "Comment content is required"}), 400

    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # Highlight 코멘트 업데이트 쿼리
            query = text("""
                UPDATE highlight
                SET HL_COMMENT = :comment, HL_MdfDt = NOW()
                WHERE HL_SEQ = :highlight_id
            """)
            connection.execute(query, {"comment": comment, "highlight_id": highlight_id})
            connection.commit()  # 데이터베이스 변경 사항 커밋

            return jsonify({"message": "Highlight comment updated successfully"})
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to update highlight comment"}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500


# 특정 Highlight 삭제 (Delete)
@highlight_bp.route('/highlight/<int:highlight_id>', methods=['DELETE'])
def delete_highlight(highlight_id):
    # MySQL 데이터베이스 연결
    connection = get_db_connection()

    if connection:
        try:
            # Highlight 삭제 쿼리
            query = text("DELETE FROM highlight WHERE HL_SEQ = :highlight_id")
            connection.execute(query, {"highlight_id": highlight_id})
            connection.commit()  # 데이터베이스 변경 사항 커밋

            return jsonify({"message": "Highlight deleted successfully"})
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to delete highlight"}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
