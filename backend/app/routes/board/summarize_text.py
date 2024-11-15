import os
import openai
from flask import Blueprint, jsonify, request
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

summary_bp = Blueprint('summary', __name__)

# OpenAI API 키 설정
openai.api_key = os.getenv("OPENAI_API_KEY")

# 텍스트 요약 처리
@summary_bp.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get("text")

    # 텍스트가 제공되지 않으면 오류 반환
    if not text:
        return jsonify({"error": "No text provided for summarization"}), 400

    try:
        # OpenAI GPT 모델을 사용하여 요약 생성
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Summarize the following text in Korean:\n\n{text}"}
            ],
            max_tokens=100,
            temperature=0.5,
        )
        summary = response.choices[0].message['content'].strip()

        return jsonify({"summary": summary}), 200
    except Exception as error:
        print(f"요약 생성 실패: {error}")
        return jsonify({"error": "Failed to summarize text"}), 500
