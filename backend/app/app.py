from flask import Flask
from flask_cors import CORS
from app.routes import register_blueprints

app = Flask(__name__)

# 전역 CORS 설정 적용
CORS(app)

# Blueprint 등록
register_blueprints(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)