import os
import random
import re
from io import BytesIO

from flask import Blueprint, render_template, request, session, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash

from app.models import User
from utils import status_code
from utils.functions import is_login, Captcha
from utils.settings import UPLOAD_PATH


user_blueprint = Blueprint('user', __name__)


@user_blueprint.route('/captcha/', methods=['GET'])
def graph_captcha():
   text, image = Captcha.gen_graph_captcha()
   session['image_code'] = text
   out = BytesIO()
   image.save(out, 'png')
   out.seek(0)
   resp = make_response(out.read())
   resp.content_type = 'image/png'

   return resp


@user_blueprint.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user_blueprint.route('/register/', methods=['POST'])
def my_register():
    mobile = request.form.get('mobile')
    image_code = request.form.get('image_code').lower()
    password = request.form.get('password')
    password2 = request.form.get('password2')
    code = session.get('image_code').lower()
    if not all([mobile, image_code, password, password2]):
        return jsonify(status_code.USER_REGISTER_PARAMS_INVALID)
    if image_code != code:
        return jsonify(status_code.USER_REGISTER_CODE_INVALID)
    if not re.match(r'^1[3456789]\d{9}$', mobile):
        return jsonify(status_code.USER_REGISTER_MOBILE_INVALID)
    if User.query.filter(User.phone == mobile).first():
        return jsonify(status_code.USER_REGISTER_MOBILE_EXISTS)
    if not password == password2:
        return jsonify(status_code.USER_REGISTER_PASSWORD_ERROR)
    user = User()
    user.phone = mobile
    user.name = mobile
    user.pwd_hash = generate_password_hash(password)
    try:
        user.add_update()
        return jsonify(status_code.SUCCESS)
    except:
        return jsonify(status_code.DATABASE_ERROR)


@user_blueprint.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@user_blueprint.route('/login/', methods=['POST'])
def my_login():
    mobile = request.form.get('mobile')
    password = request.form.get('password')
    if not all([mobile, password]):
        return jsonify(status_code.USER_LOGIN_PARAMS_INVALID)
    user = User.query.filter(User.phone == mobile).first()
    if not user:
        return jsonify(status_code.USER_LOGIN_PARAMS_ERROR)
    if not check_password_hash(user.pwd_hash, password):
        return jsonify(status_code.USER_LOGIN_PARAMS_ERROR)
    session['user_id'] = user.id

    return jsonify(status_code.SUCCESS)


@user_blueprint.route('/logout/', methods=['GET'])
def logout():
    session.clear()
    return jsonify(status_code.SUCCESS)


@user_blueprint.route('/my/', methods=['GET'])
@is_login
def my():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    return render_template('my.html')


@user_blueprint.route('/profile/', methods=['GET'])
@is_login
def profile():
    return render_template('profile.html')


@user_blueprint.route('/profile/', methods=['PATCH'])
@is_login
def my_profile():
    avatar = request.files.get('avatar')
    name = request.form.get('name')
    if avatar:
        if not re.match(r'image/*', avatar.mimetype):
            return jsonify(status_code.USER_PROFILE_AVATAR_INVALID)
        path = os.path.join(UPLOAD_PATH, avatar.filename)
        avatar.save(path)
        user_id = session['user_id']
        user = User.query.get(user_id)
        avatar_path = os.path.join('upload', avatar.filename)
        user.avatar = avatar_path
        try:
            user.add_update()
            return jsonify(code=status_code.OK, avatar=avatar_path)
        except:
            return jsonify(status_code.DATABASE_ERROR)
    if name:
       if User.query.filter(User.name == name).first():
           return jsonify(status_code.USER_PROFILE_NAME_EXISTS)
       user_id = session.get('user_id')
       user = User.query.get(user_id)
       user.name = name
       try:
           user.add_update()
           return jsonify(status_code.SUCCESS)
       except:
           return jsonify(status_code.DATABASE_ERROR)


@user_blueprint.route('/auth/', methods=['GET'])
@is_login
def auth():
    return render_template('auth.html')


@user_blueprint.route('/auth/', methods=['PATCH'])
@is_login
def my_auth():
    real_name = request.form.get('real_name')
    id_card = request.form.get('id_card')
    regex_name = r'^[\u4E00-\u9FA5]{2,6}$'
    regex_card = r'(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|' \
            r'(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)'
    if not all([real_name, id_card]):
        return jsonify(status_code.USER_AUTH_PARAMS_INVALID)
    if not re.match(regex_name, real_name):
        return jsonify(status_code.USER_AUTH_REAL_NAME_INVALID)
    if not re.match(regex_card, id_card):
        return jsonify(status_code.USER_AUTH_ID_CARD_INVALID)
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user.id_name = real_name
    user.id_card = id_card
    try:
        user.add_update()
        return jsonify(status_code.SUCCESS)
    except:
        return jsonify(status_code.DATABASE_ERROR)


@user_blueprint.route('/user_info/', methods=['GET'])
@is_login
def user_info():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user = user.to_basic_dict()

    return jsonify(code=status_code.OK, user=user)


@user_blueprint.route('/user_rel_info/', methods=['GET'])
@is_login
def user_rel_info():
    user_id = session.get('user_id')
    user = User.query.get(user_id)
    user = user.to_auth_dict()

    return jsonify(code=status_code.OK, user=user)