import redis

from utils.functions import get_sqlalchemy_uri
from utils.settings import DATABASE, REDIS_DATABASE


class Conf:
    # 配置mysql数据库
    SQLALCHEMY_DATABASE_URI = get_sqlalchemy_uri(DATABASE)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PRESERVE_CONTEXT_ON_EXCEPTION = False

    SECRET_KEY = '1234567890qwertyuiopasdfghjklzxcvbnm'

    # 配置redis数据库
    SESSION_TYPE = 'redis'
    SESSION_REDIS = redis.Redis(host=REDIS_DATABASE['HOST'], port=REDIS_DATABASE['PORT'])