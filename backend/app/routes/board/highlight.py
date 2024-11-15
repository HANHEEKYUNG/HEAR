import os
from flask import Blueprint, jsonify, request, current_app
from app.model import get_db_connection, close_db_connection
from sqlalchemy import text
import ffmpeg

# 하이라이트 
highlight_bp = Blueprint("highlight", __name__)

@highlight_bp.route("/highlight", methods=["POST"])
def highlight():
    data = request.get_json()
    startPoint = data.get("startPoint")
    endPoint = data.get("endPoint")
    userSeq = data.get("userSeq")
    bookSeq = data.get("bookSeq")
    print("startPoint", startPoint, "endPoint", endPoint)
    # POST 요청으로 받은 'test' 경로를 절대 경로로 변환
    inputFile = os.path.join(current_app.root_path, data.get("test").lstrip("/"))
    highlight_folder = os.path.join(current_app.root_path, "static", "audio", "highlight")
    os.makedirs(highlight_folder, exist_ok=True)  # 폴더가 없으면 생성
    outputFile = os.path.join(highlight_folder, f"{startPoint}_{endPoint}_user{userSeq}_book{bookSeq}.mp3")
    outputFileName = os.path.basename(outputFile)  # 파일명만 추출
    print("inputFile", inputFile)

    # FFmpeg를 사용하여 오디오 파일 자르기
    try:
        # 'copy' 대신 'libmp3lame' 코덱을 사용하여 강제로 MP3로 변환
        ffmpeg.input(inputFile, ss=startPoint, to=endPoint).output(outputFile, codec="libmp3lame").run(capture_stdout=True, capture_stderr=True)
        print("하이라이트 저장이 완료되었습니다.")
    except ffmpeg.Error as e:
        print("FFmpeg 오류 발생:", e.stderr.decode())  # 오류 메시지 출력
        return jsonify({"error": "Failed to create highlight"}), 500

    # DB에 하이라이트 정보 저장
    connection = get_db_connection()
    if connection:
        try:
            query = text("""
                INSERT INTO highlight (USER_SEQ, BOOK_SEQ, HL_StPt, HL_EdPt, HL_PATH, HL_CrtDt) 
                VALUES (:userSeq, :bookSeq, :startPoint, :endPoint, :outputFileName, NOW())
            """)
            connection.execute(query, {
                "userSeq": userSeq,
                "bookSeq": bookSeq,
                "startPoint": startPoint,
                "endPoint": endPoint,
                "outputFileName": outputFileName
            })
            connection.commit()
            return jsonify({"exists": True})
        except Exception as e:
            print("DB 저장 중 오류:", e)
            return jsonify({"exists": False})
        finally:
            close_db_connection(connection)
    return jsonify({"exists": False})
