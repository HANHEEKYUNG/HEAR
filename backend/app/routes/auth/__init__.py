from .login import login_bp
from .join import join_bp
from .check_userid import check_userid_bp
from .check_nickName import check_nickname_bp
from .user_modify import user_modify_bp
from .verify_code import verify_code_bp

auth_blueprints = [login_bp, join_bp, check_userid_bp, check_nickname_bp,user_modify_bp, verify_code_bp]