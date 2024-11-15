import os
import requests
import openai
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv
from app.config import Config
from app.utils.random_sentence import get_random_sentence

# 환경 변수 로드
load_dotenv()

tts_bp = Blueprint("tts", __name__)

# 파일 저장 경로 설정
PLAY_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/play'))
PREVIEW_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/preview'))
SUMMARY_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/audio/summary'))
os.makedirs(PLAY_FOLDER, exist_ok=True)
os.makedirs(PREVIEW_FOLDER, exist_ok=True)
os.makedirs(SUMMARY_FOLDER, exist_ok=True)

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

@tts_bp.route("/tts/generate", methods=["POST"])
def generate_tts():
    data = request.get_json()
    voice_id = data.get("voiceId")
    text = data.get("text")
    book_seq = data.get("bookSeq")
    is_summary = data.get("is_summary", False)
    is_preview = (book_seq == "preview" or not book_seq)

    if not voice_id:
        return jsonify({"error": "voiceId는 필수입니다."}), 400

    # 미리듣기 요청 처리
    if is_preview:
        text = text or get_random_sentence()  # 미리듣기 요청 시 랜덤 문장 사용
        save_folder = PREVIEW_FOLDER
        filename = f"preview_voice_{voice_id}.mp3"

    # 요약 요청 처리
    elif is_summary:
        # OpenAI를 사용하여 텍스트 요약 생성
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "당신은 도움이 되는 어시스턴트입니다."},
                    {"role": "user", "content": f"다음 텍스트를 한국어로 요약해 주세요:\n\n{text}"}
                ],
                max_tokens=100,
                temperature=0.5,
            )
            text = response.choices[0].message['content'].strip()  # 요약된 텍스트
        except Exception as error:
            print(f"요약 생성 실패: {error}")
            return jsonify({"error": "Failed to generate summary"}), 500

        save_folder = SUMMARY_FOLDER
        filename = f"summary_{book_seq}_voice_{voice_id}.mp3"

    # 일반 TTS 요청 처리
    else:
        if not text or not book_seq:
            return jsonify({"error": "실제 TTS 파일 생성에는 voiceId, text, book_seq가 필요합니다."}), 400
        save_folder = PLAY_FOLDER
        filename = f"book_{book_seq}_voice_{voice_id}.mp3"

    file_path = os.path.join(save_folder, filename)

    # 파일이 이미 존재하는 경우 해당 경로 반환
    if os.path.exists(file_path):
        print(f"파일이 이미 존재합니다: {file_path}")
        return jsonify({"message": "파일이 이미 존재합니다.", "file_path": file_path}), 200

    # ElevenLabs API 호출 준비
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": Config.ELEVENLABS_API_KEY,
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.8,
            "similarity_boost": 0.8
        }
    }

    try:
        # ElevenLabs API 호출
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        # 파일 저장
        with open(file_path, "wb") as audio_file:
            audio_file.write(response.content)
        print(f"TTS 파일 저장 완료: {file_path}")

        return jsonify({"message": "TTS 파일이 성공적으로 생성되었습니다.", "file_path": file_path}), 200

    except requests.exceptions.RequestException as e:
        print(f"ElevenLabs API 호출 중 오류 발생: {e}")
        return jsonify({"error": "TTS 생성에 실패했습니다."}), 500
