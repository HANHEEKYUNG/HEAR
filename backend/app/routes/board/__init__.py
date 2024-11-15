from .notice import notice_bp
from .library import library_bp
from .suggest import suggest_bp
from .write import write_bp
from .librarySave import librarySave_bp
from .highlight import highlight_bp
from .summarize_text import summary_bp
from .get_last_position import history_bp

board_blueprints = [notice_bp, library_bp, suggest_bp, write_bp, librarySave_bp, highlight_bp, summary_bp, history_bp]