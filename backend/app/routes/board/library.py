import os
from flask import Blueprint, jsonify, request
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
from datetime import timedelta

library_bp = Blueprint('library', __name__)

def convert_timedelta_to_str(book):
    for item in book:
        for key, value in item.items():
            if isinstance(value, timedelta):
                item[key] = str(value)  # timedelta 객체를 문자열로 변환
    return book

# 도서마당
@library_bp.route('/library', methods=['GET'])
def library():
    connection = get_db_connection()
    
    # 업로드 폴더 경로 설정
    play_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/play'))
    summary_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/summary'))
    
    # 요청에서 voice_id와 EL_ID 가져오기
    voice_id = request.args.get('EL_ID')
    is_summary = request.args.get('isSummary', 'false').lower() == 'true'  # 요약 여부 확인

    if connection:
        try:
            # 도서마당 전체 불러오는 쿼리
            query = text("SELECT * FROM book")
            result = connection.execute(query)

            # 결과를 딕셔너리 형태로 변환
            keys = result.keys()
            book = [
                dict(zip(keys, row))
                for row in result.fetchall()
            ]

            # timedelta 데이터를 문자열로 변환
            book = convert_timedelta_to_str(book)

            # 각 책에 대해 TTS 파일 경로 확인 및 추가
            for item in book:
                book_seq = item['BOOK_SEQ']
                filename = f"{'summary' if is_summary else 'book'}_{book_seq}_voice_{voice_id}.mp3"
                file_folder = summary_folder if is_summary else play_folder
                file_path = os.path.join(file_folder, filename)

                if os.path.exists(file_path):
                    item['test'] = f"/static/audio/{'summary' if is_summary else 'play'}/{filename}"
                else:
                    # 파일이 없을 경우 기본 파일 경로를 설정
                    item['test'] = '/static/audio/ButterRingtone.mp3'

            return jsonify(book)
        except Exception as db_error:
            print(f"Database operation failed: {db_error}")
            return jsonify({"error": "Failed to fetch library"}), 500
        finally:
            # 데이터베이스 연결 닫기
            close_db_connection(connection)

    return jsonify({"error": "Database connection failed"}), 500
