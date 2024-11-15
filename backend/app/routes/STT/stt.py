import os
import openai
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from io import BytesIO  # BytesIO를 임포트

# 환경 변수 로드
load_dotenv()

stt_bp = Blueprint('stt', __name__)

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# STT 처리 (음성 파일을 텍스트로 변환)
@stt_bp.route('/stt', methods=['POST'])
def convert_speech_to_text():
    if 'file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['file']
    
    # BytesIO로 감싸기
    audio_data = BytesIO(audio_file.read())
    audio_data.name = audio_file.filename  # 파일 이름 설정

    try:
        # OpenAI API를 사용하여 STT 처리
        response = openai.Audio.transcribe(
            model="whisper-1", 
            file=audio_data  # BytesIO 객체를 파일로 사용
        )
        
        return jsonify({"text": response["text"]}), 200
    except Exception as error:
        print(f"STT 변환 실패: {error}")
        return jsonify({"error": "Failed to convert speech to text"}), 500
