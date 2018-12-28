from flask import Flask, Blueprint
from flask_session import Session

from app.house_views import house_blueprint
from app.models import db
from app.order_views import order_blueprint
from app.user_views import user_blueprint
from utils.config import Conf
from utils.settings import TEMPLATE_PATH, STATIC_PATH


def create_app():
    app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)
    # 加载配置
    app.config.from_object(Conf)
    # 蓝图
    app.register_blueprint(blueprint=user_blueprint, url_prefix='/user')
    app.register_blueprint(blueprint=order_blueprint, url_prefix='/order')
    app.register_blueprint(blueprint=house_blueprint, url_prefix='/house')
    # 初始化
    db.init_app(app)
    se = Session()
    se.init_app(app)

    return app


